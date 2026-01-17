// lib/ai/rag.ts
import { MODELS, openai } from "../openai";
import { searchSimilar } from "../vector/search";
import { CHAT_SYSTEM_PROMPT, CHAT_USER_PROMPT } from "./prompts";

export async function chatWithRAG(
  question: string,
  workspaceId: string,
  topK: number = 5,
): Promise<ReadableStream> {
  try {
    // 1. Buscar contexto relevante
    const similarChunks = await searchSimilar(question, workspaceId, topK);

    // 2. Montar contexto
    const context = similarChunks.map((chunk, i) => `[${i + 1}] ${chunk.content}`).join("\n\n");

    // 3. Stream response
    const stream = await openai.chat.completions.create({
      model: MODELS.GPT4_TURBO,
      messages: [
        {
          role: "system",
          content: CHAT_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: CHAT_USER_PROMPT(question, context),
        },
      ],
      stream: true,
      temperature: 0.5,
    });

    // 4. Converter para ReadableStream
    const encoder = new TextEncoder();

    return new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content || "";
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });
  } catch (error) {
    console.error("RAG error:", error);
    throw error;
  }
}
