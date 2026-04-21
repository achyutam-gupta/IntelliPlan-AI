/**
 * IntelliNexus AI - Core Infrastructure Configuration
 * This file contains the default system orchestration settings.
 * In a production environment, these should be handled via secure backend or environment variables.
 */

export const SYSTEM_AI_CONFIG = {
  // Primary Provider (System Default)
  defaultProvider: "NVIDIA",
  defaultModel: "mistral-large-3",
  
  // Hardcoded failover hierarchy: Primary (NVIDIA) -> Fallback (Groq)
  failoverSequence: ["NVIDIA", "Groq"],
  providers: {
    Groq: {
      apiKey: "gsk_XmXv9S1vPjG0R2lQ0W9Z4B5C6D7E8F9G0H1I2J3K4L5M6N7", // Internal System Key
      model: "llama-3.3-70b-versatile",
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
    },
    NVIDIA: {
      apiKey: "",
      model: "mistral-large-3",
      endpoint: "/api/v1/integrations/llm/nvidia"
    }
  }
};
