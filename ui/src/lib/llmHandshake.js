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
  try {
    const headers = { 'Content-Type': 'application/json' };
    if (apiKey && apiKey.trim()) headers['Authorization'] = `Bearer ${apiKey.trim()}`;
    
    const res = await fetch('/api/v1/integrations/llm/groq/chat/completions', {
      method: 'POST',
      headers,
      body: JSON.stringify({ model, messages: [{ role: 'user', content: 'ping' }], max_tokens: 1 }),
      signal: AbortSignal.timeout(10000),
    });
    if (res.ok) return { ok: true, msg: `Connected to Groq · model: ${model}` };
    if (res.status === 401) return { ok: false, msg: 'Invalid API key. Check your Groq API key or Vercel Environment Variables.' };
    return { ok: false, msg: `Groq responded with status ${res.status}.` };
  } catch {
    return { ok: false, msg: 'Network error reaching Groq API.' };
  }
}

export async function testGrokConnection(apiKey) {
  try {
    const headers = {};
    if (apiKey && apiKey.trim()) headers['Authorization'] = `Bearer ${apiKey.trim()}`;
    const res = await fetch('https://api.x.ai/v1/models', {
      headers,
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
  try {
    const headers = {};
    if (apiKey && apiKey.trim()) headers['Authorization'] = `Bearer ${apiKey.trim()}`;
    const res = await fetch('/api/v1/integrations/llm/openai/models', {
      headers,
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
  if (!baseUrl.trim())
    return { ok: false, msg: 'Please enter at least the Jira Domain URL to test.' };
  try {
    const targetBase = baseUrl.replace(/\/$/, '');
    const headers = { 
      Accept: 'application/json',
      'x-target-base-url': targetBase
    };
    
    if (email && email.trim() && token && token.trim()) {
      const encoded = btoa(`${email.trim()}:${token.trim()}`);
      headers['Authorization'] = `Basic ${encoded}`;
    }
    const res = await fetch(`/api/v1/integrations/jira/rest/api/3/myself`, {
      headers,
      signal: AbortSignal.timeout(10000),
    });
    if (res.ok) {
      const data = await res.json();
      return { ok: true, msg: `Connected as ${data.displayName || email || 'Service Account'}.` };
    }
    if (res.status === 401) return { ok: false, msg: 'Unauthorized — check your email and API token.' };
    if (res.status === 403) return { ok: false, msg: 'Forbidden — your account may lack API access.' };
    return { ok: false, msg: `Jira responded with HTTP ${res.status}.` };
  } catch {
    return { ok: false, msg: 'Cannot reach Jira. Verify the Instance URL and your network.' };
  }
}

export async function testNvidiaConnection(apiKey) {
  try {
    const headers = { 'Content-Type': 'application/json' };
    if (apiKey && apiKey.trim()) headers['Authorization'] = `Bearer ${apiKey.trim()}`;
    
    const res = await fetch('/api/v1/integrations/llm/nvidia/chat/completions', {
      method: 'POST',
      headers,
      body: JSON.stringify({ 
        model: 'mistralai/mistral-large-3-675b-instruct-2512', 
        messages: [{ role: 'user', content: 'ping' }], 
        max_tokens: 1 
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (res.ok) return { ok: true, msg: 'Connected to NVIDIA NIM Cloud.' };
    if (res.status === 401) return { ok: false, msg: 'Invalid NVIDIA API key.' };
    return { ok: false, msg: `NVIDIA responded with status ${res.status}.` };
  } catch {
    return { ok: false, msg: 'Network error reaching NVIDIA API.' };
  }
}
