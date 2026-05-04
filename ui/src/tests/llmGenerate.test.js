// ui/src/tests/llmGenerate.test.js
/**
 * Unit tests for llmGenerate.js
 * Verifies that all requests default to Groq GPT-OSS-120B model and proper errors are thrown.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { generateContentWithLLM } from '../lib/llmGenerate';

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn()
};

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn());
  vi.stubGlobal('localStorage', localStorageMock);
  localStorageMock.getItem.mockReset();
});

describe('generateContentWithLLM - Groq Default Model', () => {
  it('successful generation returns content and uses openai/gpt-oss-120b', async () => {
    // Mock the Groq endpoint
    fetch.mockImplementationOnce((url, opts) => {
      expect(url).toBe('/api/v1/integrations/llm/groq/chat/completions');
      const body = JSON.parse(opts.body);
      expect(body.model).toBe('openai/gpt-oss-120b');
      expect(body.messages[0].content).toBe('test prompt');
      return Promise.resolve({
        ok: true,
        json: async () => ({ choices: [{ message: { content: 'Generated response' } }] })
      });
    });

    const result = await generateContentWithLLM('test prompt');
    expect(result).toBe('Generated response');
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('API error throws descriptive error', async () => {
    fetch.mockImplementationOnce(() => Promise.resolve({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      json: async () => ({ error: { message: 'Invalid API key' } })
    }));

    await expect(generateContentWithLLM('test')).rejects.toThrow('Groq Error: 401 Invalid API key');
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
