// lib/llmGenerate.js

export async function checkJiraConnection() {
  const url = localStorage.getItem('jira_url');
  const email = localStorage.getItem('jira_email');
  const token = localStorage.getItem('jira_token');
  
  if (!url || !email || !token) {
    return false;
  }
  return true;
}

export async function generateContentWithLLM(promptText) {
  const provider = localStorage.getItem('llm_provider') || 'Ollama';
  const model = localStorage.getItem('llm_model') || 'llama3:latest';
  
  try {
    if (provider === 'Ollama') {
      const endpoint = localStorage.getItem('llm_ollamaUrl') || 'http://127.0.0.1:11434';
      const res = await fetch(`${endpoint.replace(/\/$/, '')}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, prompt: promptText, stream: false }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.response;
      }
      let errStr = res.statusText;
      try {
        const errData = await res.json();
        if (errData && errData.error) errStr = errData.error;
      } catch(e) {}
      throw new Error(`Ollama Error: ${errStr}`);
    } else if (provider === 'Groq') {
      const apiKey = localStorage.getItem('llm_groqKey') || '';
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({ model, messages: [{ role: 'user', content: promptText }] }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.choices?.[0]?.message?.content;
      }
      let errMsg = `Groq Error (${res.status}): ${res.statusText}`;
      try {
        const errData = await res.json();
        if (errData?.error?.message) errMsg = `Groq Error: ${errData.error.message}`;
      } catch(e) {}
      throw new Error(errMsg);
    } else if (provider === 'OpenAI') {
      const apiKey = localStorage.getItem('llm_openAIKey') || '';
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({ model, messages: [{ role: 'user', content: promptText }] }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.choices?.[0]?.message?.content;
      }
      throw new Error(`OpenAI Error: ${res.statusText}`);
    } else if (provider === 'Grok') {
      const apiKey = localStorage.getItem('llm_grokKey') || '';
      const res = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({ model, messages: [{ role: 'user', content: promptText }] }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.choices?.[0]?.message?.content;
      }
      throw new Error(`xAI Error: ${res.statusText}`);
    }
  } catch (error) {
    console.error('LLM Generation Error:', error);
    throw error;
  }
}
