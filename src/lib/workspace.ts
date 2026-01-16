// lib/workspace.ts
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { workspace, workspaceMember } from "@/db/schema";

export async function createWorkspace(userId: string, name: string) {
  const slug = name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();

  const [newWorkspace] = await db
    .insert(workspace)
    .values({
      id: crypto.randomUUID(),
      name,
      slug,
      plan: "FREE",
    })
    .returning();

  await db.insert(workspaceMember).values({
    id: crypto.randomUUID(),
    userId,
    workspaceId: newWorkspace.id,
    role: "OWNER",
  });

  return newWorkspace;
}

export async function getUserWorkspaces(userId: string) {
  return await db.query.workspaceMember.findMany({
    where: eq(workspaceMember.userId, userId),
    with: {
      workspace: true,
    },
  });
}
