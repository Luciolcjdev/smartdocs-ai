// lib/vector/chunking.ts

export interface Chunk {
  content: string;
  index: number;
  metadata?: Record<string, unknown>;
}

export function chunkText(
  text: string,
  maxChunkSize: number = 1000,
  overlap: number = 200,
): Chunk[] {
  const chunks: Chunk[] = [];

  // Split by sentences first
  const sentences = text.split(/[.!?]\s+/);

  let currentChunk = "";
  let chunkIndex = 0;

  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i] + ". ";

    if ((currentChunk + sentence).length > maxChunkSize) {
      if (currentChunk) {
        chunks.push({
          content: currentChunk.trim(),
          index: chunkIndex,
        });
        chunkIndex++;

        // Overlap: keep last few sentences
        const words = currentChunk.split(" ");
        const overlapWords = words.slice(-Math.floor(overlap / 5)); // Aproximadamente
        currentChunk = overlapWords.join(" ") + " " + sentence;
      } else {
        // Sentence muito longa, forçar quebra
        currentChunk = sentence;
      }
    } else {
      currentChunk += sentence;
    }
  }

  if (currentChunk) {
    chunks.push({
      content: currentChunk.trim(),
      index: chunkIndex,
    });
  }

  return chunks;
}

export function chunkCode(code: string, maxChunkSize: number = 1000): Chunk[] {
  const chunks: Chunk[] = [];
  const lines = code.split("\n");

  let currentChunk = "";
  let chunkIndex = 0;

  for (const line of lines) {
    if ((currentChunk + line + "\n").length > maxChunkSize) {
      if (currentChunk) {
        chunks.push({
          content: currentChunk.trim(),
          index: chunkIndex,
        });
        chunkIndex++;
        currentChunk = line + "\n";
      }
    } else {
      currentChunk += line + "\n";
    }
  }

  if (currentChunk) {
    chunks.push({
      content: currentChunk.trim(),
      index: chunkIndex,
    });
  }

  return chunks;
}
