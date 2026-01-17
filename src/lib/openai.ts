// lib/openai.ts
import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY environment variable");
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Modelos disponíveis
export const MODELS = {
  GPT4_TURBO: "gpt-4-turbo-preview",
  GPT4: "gpt-4",
  GPT35_TURBO: "gpt-3.5-turbo",
} as const;

// Custos (aproximados por 1K tokens)
export const MODEL_COSTS = {
  [MODELS.GPT4_TURBO]: { input: 0.01, output: 0.03 },
  [MODELS.GPT4]: { input: 0.03, output: 0.06 },
  [MODELS.GPT35_TURBO]: { input: 0.0005, output: 0.0015 },
};
