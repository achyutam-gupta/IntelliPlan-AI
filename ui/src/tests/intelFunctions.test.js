import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateContentWithLLM } from '../lib/llmGenerate';

// Mock fetch and localStorage globally
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn()
};

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn());
  vi.stubGlobal('localStorage', localStorageMock);
});

const groqResponse = (content) => {
  return {
    ok: true,
    json: async () => ({ choices: [{ message: { content } }] })
  };
};

describe('Intel Functions default to Groq GPT-OSS-120B', () => {
  it('User Stories generation uses Groq model', async () => {
    const prompt = 'Generate user story for feature X';
    fetch.mockResolvedValueOnce(groqResponse('User story output'));
    const result = await generateContentWithLLM(prompt);
    expect(fetch).toHaveBeenCalledWith('/api/v1/integrations/llm/groq/chat/completions', expect.any(Object));
    expect(result).toBe('User story output');
  });

  it('Test Plan generation uses Groq model', async () => {
    const prompt = 'Create test plan for feature X';
    fetch.mockResolvedValueOnce(groqResponse('Test plan output'));
    const result = await generateContentWithLLM(prompt);
    expect(result).toBe('Test plan output');
  });

  it('Test Scenario generation uses Groq model', async () => {
    const prompt = 'Generate test scenario for feature X';
    fetch.mockResolvedValueOnce(groqResponse('Test scenario output'));
    const result = await generateContentWithLLM(prompt);
    expect(result).toBe('Test scenario output');
  });

  it('Test Cases generation uses Groq model', async () => {
    const prompt = 'Generate test cases for feature X';
    fetch.mockResolvedValueOnce(groqResponse('Test cases output'));
    const result = await generateContentWithLLM(prompt);
    expect(result).toBe('Test cases output');
  });
});
