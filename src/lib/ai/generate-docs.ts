// lib/ai/generate-docs.ts
import { MODEL_COSTS, MODELS, openai } from "../openai";
import { DOCUMENTATION_SYSTEM_PROMPT, DOCUMENTATION_USER_PROMPT } from "./prompts";

export interface GenerateDocsOptions {
  code: string;
  language: string;
  model?: string;
}

export async function generateDocumentation({
  code,
  language,
  model = MODELS.GPT4_TURBO,
}: GenerateDocsOptions): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content: DOCUMENTATION_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: DOCUMENTATION_USER_PROMPT(code, language),
        },
      ],
      temperature: 0.3, // Baixo para respostas mais consistentes
      max_tokens: 2000,
    });

    const documentation = completion.choices[0]?.message?.content;

    if (!documentation) {
      throw new Error("No documentation generated");
    }

    return documentation;
  } catch (error: unknown) {
    console.error("OpenAI error:", error);
    throw new Error(`Failed to generate documentation: ${error?.toString()}`);
  }
}

// Função para estimar tokens (aproximado)
export function estimateTokens(text: string): number {
  // Aproximação: 1 token ≈ 4 caracteres em inglês
  return Math.ceil(text.length / 4);
}

// Função para calcular custo
export function estimateCost(inputTokens: number, outputTokens: number, model: string): number {
  const costs = MODEL_COSTS[model as keyof typeof MODEL_COSTS];
  if (!costs) return 0;

  const inputCost = (inputTokens / 1000) * costs.input;
  const outputCost = (outputTokens / 1000) * costs.output;

  return inputCost + outputCost;
}
