// lib/vector/embeddings.ts
import { openai } from "../openai";

export async function createEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error("Embedding error:", error);
    throw error;
  }
}

export async function createEmbeddings(texts: string[]): Promise<number[][]> {
  const embeddings = await Promise.all(texts.map((text) => createEmbedding(text)));
  return embeddings;
}
