/**
 * IntelliNexus AI - Core Infrastructure Configuration
 * This file contains the default system orchestration settings.
 * In a production environment, these should be handled via secure backend or environment variables.
 */

export const SYSTEM_AI_CONFIG = {
  // Primary Provider (System Default)
  defaultProvider: "Groq",
  defaultModel: "openai/gpt-oss-120b",

  // Failover hierarchy: Primary (Groq) -> Fallback (NVIDIA)
  failoverSequence: ["Groq"],
  providers: {
    Groq: {
      apiKey: "", // User provides key manually via Settings
      model: "openai/gpt-oss-120b",
      endpoint: "/api/v1/integrations/llm/groq"
    },
    OpenAI: {
      apiKey: "",
      model: "gpt-4o",
      endpoint: "/api/v1/integrations/llm/openai"
    },
    Ollama: {
      url: "http://localhost:11434",
      model: "llama3:latest"
    }
  }
};
