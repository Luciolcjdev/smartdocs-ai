// lib/credits/check.ts
import { and, eq, gte, sum } from "drizzle-orm";

import { db } from "@/db";
import { creditUsage, workspace } from "@/db/schema";
import { PLANS } from "@/lib/plans";

export async function checkCredits(workspaceId: string, cost: number = 1): Promise<boolean> {
  // Buscar workspace
  const [ws] = await db.select().from(workspace).where(eq(workspace.id, workspaceId)).limit(1);

  if (!ws) return false;

  const plan = PLANS[ws.plan];
  const creditLimit = plan.credits;

  // Unlimited (Enterprise)
  if (creditLimit === -1) return true;

  // Buscar uso no mês atual
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const result = await db
    .select({ total: sum(creditUsage.credits) })
    .from(creditUsage)
    .where(and(eq(creditUsage.workspaceId, workspaceId), gte(creditUsage.createdAt, startOfMonth)));

  const usedCredits = Number(result[0]?.total || 0);

  return usedCredits + cost <= creditLimit;
}

export async function getUsageStats(workspaceId: string) {
  const [ws] = await db.select().from(workspace).where(eq(workspace.id, workspaceId)).limit(1);

  if (!ws) {
    return {
      used: 0,
      limit: 0,
      remaining: 0,
      percentage: 0,
      plan: "FREE",
    };
  }

  const plan = PLANS[ws.plan];
  const creditLimit = plan.credits;

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const result = await db
    .select({ total: sum(creditUsage.credits) })
    .from(creditUsage)
    .where(and(eq(creditUsage.workspaceId, workspaceId), gte(creditUsage.createdAt, startOfMonth)));

  const used = Number(result[0]?.total || 0);

  return {
    used,
    limit: creditLimit,
    remaining: creditLimit === -1 ? "unlimited" : creditLimit - used,
    percentage: creditLimit === -1 ? 0 : (used / creditLimit) * 100,
    plan: ws.plan,
  };
}
