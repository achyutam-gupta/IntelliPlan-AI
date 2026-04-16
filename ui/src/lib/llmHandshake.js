export async function testOllamaConnection(endpoint) {
  try {
    const res = await fetch(`${endpoint.replace(/\/$/, '')}/api/tags`, { signal: AbortSignal.timeout(5000) });
    if (res.ok) return { ok: true, msg: 'Ollama is reachable and running.' };
    return { ok: false, msg: `Ollama responded with status ${res.status}.` };
  } catch {
    return { ok: false, msg: 'Cannot reach Ollama. Make sure it is running on the specified endpoint.' };
  }
}

export async function testGroqConnection(apiKey, model) {
  if (!apiKey.trim()) return { ok: false, msg: 'Please enter a Groq API key first.' };
  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model, messages: [{ role: 'user', content: 'ping' }], max_tokens: 1 }),
      signal: AbortSignal.timeout(10000),
    });
    if (res.ok) return { ok: true, msg: `Connected to Groq · model: ${model}` };
    if (res.status === 401) return { ok: false, msg: 'Invalid API key. Check your Groq API key.' };
    return { ok: false, msg: `Groq responded with status ${res.status}.` };
  } catch {
    return { ok: false, msg: 'Network error reaching Groq API.' };
  }
}

export async function testGrokConnection(apiKey) {
  if (!apiKey.trim()) return { ok: false, msg: 'Please enter an xAI API key first.' };
  try {
    const res = await fetch('https://api.x.ai/v1/models', {
      headers: { Authorization: `Bearer ${apiKey}` },
      signal: AbortSignal.timeout(10000),
    });
    if (res.ok) return { ok: true, msg: 'Connected to xAI Grok API.' };
    if (res.status === 401) return { ok: false, msg: 'Invalid xAI API key.' };
    return { ok: false, msg: `xAI Grok responded with status ${res.status}.` };
  } catch {
    return { ok: false, msg: 'Network error reaching xAI Grok API.' };
  }
}

export async function testOpenAIConnection(apiKey, model) {
  if (!apiKey.trim()) return { ok: false, msg: 'Please enter an OpenAI API key first.' };
  try {
    const res = await fetch('https://api.openai.com/v1/models', {
      headers: { Authorization: `Bearer ${apiKey}` },
      signal: AbortSignal.timeout(10000),
    });
    if (res.ok) return { ok: true, msg: `Connected to OpenAI API.` };
    if (res.status === 401) return { ok: false, msg: 'Invalid OpenAI API key.' };
    return { ok: false, msg: `OpenAI responded with status ${res.status}.` };
  } catch {
    return { ok: false, msg: 'Network error reaching OpenAI API.' };
  }
}

export async function testJiraConnection(baseUrl, email, token) {
  if (!baseUrl.trim() || !email.trim() || !token.trim())
    return { ok: false, msg: 'Please fill in all Jira credential fields.' };
  try {
    const encoded = btoa(`${email}:${token}`);
    
    // Use the Vite proxy if hitting the main domain, or cleanly format URL
    // We use /api/jira to hit the local proxy configured in vite.config.js and bypass CORS
    const isStandardUrl = baseUrl.includes('http');
    const proxyUrl = isStandardUrl ? `/api/jira/rest/api/3/myself` : `${baseUrl.replace(/\/$/, '')}/rest/api/3/myself`;
    
    const res = await fetch(proxyUrl, {
      headers: { Authorization: `Basic ${encoded}`, Accept: 'application/json' },
      signal: AbortSignal.timeout(10000),
    });
    if (res.ok) {
      const data = await res.json();
      return { ok: true, msg: `Connected as ${data.displayName || email}.` };
    }
    if (res.status === 401) return { ok: false, msg: 'Unauthorized — check your email and API token.' };
    if (res.status === 403) return { ok: false, msg: 'Forbidden — your account may lack API access.' };
    return { ok: false, msg: `Jira responded with HTTP ${res.status}.` };
  } catch {
    return { ok: false, msg: 'Cannot reach Jira. Verify the Instance URL and your network.' };
  }
}
