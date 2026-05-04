// lib/llmGenerate.js
import { SYSTEM_AI_CONFIG } from '../config/aiConfig';

export async function checkJiraConnection() {
  const url = localStorage.getItem('jira_url');
  const email = localStorage.getItem('jira_email');
  const token = localStorage.getItem('jira_token');
  if (!url || !email || !token) return false;
  return true;
}

export function repairJSON(rawString) {
  if (!rawString) return "";
  let clean = rawString.replace(/```json/g, '').replace(/```/g, '').trim();
  let startChar = '[';
  let endChar = ']';
  const firstBrace = clean.indexOf('{');
  const firstBracket = clean.indexOf('[');
  if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
    startChar = '{';
    endChar = '}';
  }
  let startIdx = clean.indexOf(startChar);
  let endIdx = clean.lastIndexOf(endChar);
  if (startIdx !== -1 && endIdx === -1) {
     const lastClosingBrace = clean.lastIndexOf('}');
     if (lastClosingBrace !== -1) {
        clean = clean.substring(0, lastClosingBrace + 1) + (startChar === '[' ? ']' : '');
        endIdx = clean.length - 1;
     }
  }
  let result = (startIdx !== -1 && endIdx !== -1) ? clean.substring(startIdx, endIdx + 1) : "";
  if (!result || !result.includes(':')) return ""; 

  result = result
    .replace(/,\s*([\]}])/g, '$1')
    .replace(/\}\s*\{/g, '}, {')
    .replace(/\]\s*\[/g, '], [')
    .replace(/\"(\s*)\n(\s*)\"/g, '", "')
    .replace(/(\"|true|false|null|\d+)\s*\n\s*\"/g, '$1, "')
    .replace(/\"(\w+)\"(\s*):(\s*)(\"|\[|\{)/g, '"$1": $4')
    .replace(/([^\\])\"(\s+)(\w+)(\s*)\":/g, '$1", "$3":');
    
  const lastAbsoluteEnd = result.lastIndexOf(endChar);
  if (lastAbsoluteEnd !== -1) result = result.substring(0, lastAbsoluteEnd + 1);
  return result;
}

export function parseLLMJSON(rawString) {
  if (!rawString) return null;
  
  // Step 1: Strip markdown codeblocks
  let clean = rawString.replace(/```(?:json)?/gi, '').trim();
  
  // Extract just the JSON part (from first { or [ to last } or ])
  const startIdx = clean.search(/[\{\[]/);
  const endIdx = clean.search(/[\}\]][^}\]]*$/);
  if (startIdx !== -1 && endIdx !== -1) {
    clean = clean.substring(startIdx, endIdx + 1);
  }

  // Attempt 1: Standard parse
  try { return JSON.parse(clean); } catch (e) {}

  // Attempt 2: Strip unescaped newlines/tabs (common LLM error in string values)
  try {
    const noNewlines = clean.replace(/[\r\n\t]+/g, ' ');
    return JSON.parse(noNewlines);
  } catch (e) {}

  // Attempt 3: Aggressive repair (adds missing commas, removes trailing commas)
  try {
    const repaired = repairJSON(clean);
    return JSON.parse(repaired);
  } catch (e) {}

  // Attempt 4: Aggressive repair + no newlines
  try {
    const repairedNoNewlines = repairJSON(clean).replace(/[\r\n\t]+/g, ' ');
    return JSON.parse(repairedNoNewlines);
  } catch (e) {
    // If all fail, run standard parse again to throw the error to the UI
    return JSON.parse(clean);
  }
}

export async function generateContentWithLLM(promptText) {
  const timeout = 60000;
  const failoverSequence = SYSTEM_AI_CONFIG.failoverSequence;

  let errors = [];
  
  for (const provider of failoverSequence) {
    const controller = new AbortController();
    const timerId = setTimeout(() => controller.abort(), timeout);
    
    try {
      console.log(`[LLM] Attempting synthesis with: ${provider}`);
      const result = await executeProvider(provider, promptText, controller.signal);
      clearTimeout(timerId);
      return result;
    } catch (error) {
      clearTimeout(timerId);
      errors.push(`${provider}: ${error.message}`);
      console.warn(`[LLM] ${provider} failed: ${error.message}`);
      // Continue to next provider in sequence
    }
  }

  // If we reach here, everything failed
  const isTimeout = errors.some(e => e.includes('AbortError'));
  if (isTimeout) {
    throw new Error("Synthesis timed out. The neural engines were unable to process the payload in time.");
  }
  
  throw new Error(`Orchestration failure: All neural engines (${failoverSequence.join(', ')}) failed. Roots: | ${errors.join(' | ')}`);
}

async function executeProvider(provider, promptText, signal) {
  const sysConfig = SYSTEM_AI_CONFIG.providers[provider];
  
  const model = localStorage.getItem('llm_model') || sysConfig?.model || SYSTEM_AI_CONFIG.defaultModel;
  const apiKey = localStorage.getItem(`llm_${provider.toLowerCase()}Key`) || sysConfig?.apiKey || '';

  if (provider !== 'Ollama' && !apiKey) {
    console.warn(`[LLM] No client-side key for ${provider}. Attempting to use server-side environment variables.`);
  }

  if (provider === 'Ollama') {
    const endpoint = localStorage.getItem('llm_ollamaUrl') || sysConfig?.url || 'http://127.0.0.1:11434';
    const res = await fetch(`${endpoint.replace(/\/$/, '')}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, prompt: promptText, stream: false }),
      signal
    });
    if (res.ok) {
      const data = await res.json();
      return data.response;
    }
    throw new Error(`Ollama Error: ${res.statusText}`);
  }

  if (provider === 'Groq') {
    const activeModel = model;
    const headers = { 'Content-Type': 'application/json' };
    if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;
    
    const res = await fetch('/api/v1/integrations/llm/groq/chat/completions', {
      method: 'POST',
      headers,
      body: JSON.stringify({ model: activeModel, messages: [{ role: 'user', content: promptText }] }),
      signal
    });
    if (res.ok) {
      const data = await res.json();
      return data.choices?.[0]?.message?.content;
    }
    
    let errMsg = res.statusText;
    try {
      const errData = await res.json();
      errMsg = errData.error?.message || errData.detail || JSON.stringify(errData);
    } catch(e) {}
    throw new Error(`Groq Error: ${res.status} ${errMsg}`);
  }

  if (provider === 'NVIDIA') {
    const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
    if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;
    
    const res = await fetch('/api/v1/integrations/llm/nvidia/chat/completions', {
      method: 'POST',
      headers,
      body: JSON.stringify({ model: 'mistralai/mistral-large-3-675b-instruct-2512', messages: [{ role: 'user', content: promptText }], max_tokens: 4096 }),
      signal
    });
    if (res.ok) {
      const data = await res.json();
      return data.choices?.[0]?.message?.content;
    }
    
    let errMsg = res.statusText;
    try {
      const errData = await res.json();
      errMsg = errData.error?.message || errData.detail || JSON.stringify(errData);
    } catch(e) {}
    throw new Error(`NVIDIA Error: ${res.status} ${errMsg}`);
  }

  // OpenAI, Grok, etc.
  const urlMap = { 'OpenAI': '/api/v1/integrations/llm/openai/chat/completions', 'Grok': 'https://api.x.ai/v1/chat/completions' };
  if (urlMap[provider]) {
    const headers = { 'Content-Type': 'application/json' };
    if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;
    
    const res = await fetch(urlMap[provider], {
      method: 'POST',
      headers,
      body: JSON.stringify({ model, messages: [{ role: 'user', content: promptText }] }),
      signal
    });
    if (res.ok) {
      const data = await res.json();
      return data.choices?.[0]?.message?.content;
    }
    throw new Error(`${provider} Error: ${res.statusText}`);
  }

  throw new Error(`Unsupported provider: ${provider}`);
}
