// lib/credits/consume.ts
import { db } from "@/db";
import { creditUsage } from "@/db/schema";

import { checkCredits } from "./check";

export async function consumeCredits(
  userId: string,
  workspaceId: string,
  cost: number,
  type: "generation" | "chat" | "embedding",
  metadata?: Record<string, unknown>,
): Promise<void> {
  // Verificar se tem créditos
  const hasCredits = await checkCredits(workspaceId, cost);

  if (!hasCredits) {
    throw new Error("Insufficient credits. Please upgrade your plan.");
  }

  // Consumir
  await db.insert(creditUsage).values({
    id: crypto.randomUUID(),
    userId,
    workspaceId,
    credits: cost,
    type,
    metadata,
  });
}
