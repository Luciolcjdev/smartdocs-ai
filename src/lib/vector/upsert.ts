// lib/vector/upsert.ts
import { db } from "@/db";
import { embedding } from "@/db/schema";

import { chunkText } from "./chunking";
import { createEmbeddings } from "./embeddings";
import { index } from "./pinecone";

export async function upsertDocument(documentId: string, content: string, workspaceId: string) {
  try {
    // 1. Chunk o conteúdo
    const chunks = chunkText(content, 1000, 200);

    // 2. Criar embeddings
    const embeddings = await createEmbeddings(chunks.map((c) => c.content));

    // 3. Preparar vetores para Pinecone
    const vectors = chunks.map((chunk, i) => ({
      id: `${documentId}-chunk-${i}`,
      values: embeddings[i],
      metadata: {
        documentId,
        workspaceId,
        content: chunk.content,
        chunkIndex: i,
      },
    }));

    // 4. Upsert no Pinecone
    await index.upsert(vectors);

    // 5. Salvar referências no banco
    const embeddingRecords = chunks.map((chunk, i) => ({
      id: crypto.randomUUID(),
      documentId,
      vectorId: `${documentId}-chunk-${i}`,
      content: chunk.content,
      metadata: { chunkIndex: i },
    }));

    await db.insert(embedding).values(embeddingRecords);

    return {
      success: true,
      chunksCreated: chunks.length,
    };
  } catch (error) {
    console.error("Upsert error:", error);
    throw error;
  }
}
