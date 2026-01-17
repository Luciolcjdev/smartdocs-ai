// lib/vector/search.ts
import { createEmbedding } from "./embeddings";
import { index } from "./pinecone";

export interface SearchResult {
  content: string;
  score: number;
  documentId: string;
  chunkIndex: number;
}

export async function searchSimilar(
  query: string,
  workspaceId: string,
  topK: number = 5,
): Promise<SearchResult[]> {
  try {
    // 1. Criar embedding da query
    const queryEmbedding = await createEmbedding(query);

    // 2. Buscar no Pinecone
    const results = await index.query({
      vector: queryEmbedding,
      topK,
      filter: { workspaceId },
      includeMetadata: true,
    });

    // 3. Formatar resultados
    return (results.matches || []).map((match) => ({
      content: (match.metadata?.content as string) || "",
      score: match.score || 0,
      documentId: (match.metadata?.documentId as string) || "",
      chunkIndex: (match.metadata?.chunkIndex as number) || 0,
    }));
  } catch (error) {
    console.error("Search error:", error);
    throw error;
  }
}
