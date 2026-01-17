import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { user, workspace, workspaceMember } from "@/db/schema";

import { protectedProcedure, router } from "../server";

type WorkspaceWithMembers = {
  id: string;
  name: string;
  slug: string;
  members: {
    id: string;
    role: "OWNER" | "ADMIN" | "MEMBER";
    user: {
      id: string;
      name: string;
      email: string;
    };
  }[];
};

export const workspaceRouter = router({
  create: protectedProcedure
    .input(z.object({ name: z.string().min(3) }))
    .mutation(async ({ input, ctx }) => {
      const slug = input.name.toLowerCase().replace(/\s+/g, "-");

      const [workspaceCreated] = await db
        .insert(workspace)
        .values({
          id: crypto.randomUUID(),
          name: input.name,
          slug,
        })
        .returning();

      await db.insert(workspaceMember).values({
        id: crypto.randomUUID(),
        role: "OWNER",
        userId: ctx.user.id,
        workspaceId: workspaceCreated.id,
      });

      return workspaceCreated;
    }),

  list: protectedProcedure.query(async ({ ctx }) => {
    const rows = await db
      .select({
        workspaceId: workspace.id,
        workspaceName: workspace.name,
        workspaceSlug: workspace.slug,
        memberId: workspaceMember.id,
        memberRole: workspaceMember.role,
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
      })
      .from(workspace)
      .innerJoin(workspaceMember, eq(workspaceMember.workspaceId, workspace.id))
      .innerJoin(user, eq(user.id, workspaceMember.userId))
      .where(eq(workspaceMember.userId, ctx.user.id));

    const workspaces = rows.reduce<WorkspaceWithMembers[]>((acc, row) => {
      const existing = acc.find((w) => w.id === row.workspaceId);

      const member = {
        id: row.memberId,
        role: row.memberRole,
        user: {
          id: row.userId,
          name: row.userName,
          email: row.userEmail,
        },
      };

      if (existing) {
        existing.members.push(member);
      } else {
        acc.push({
          id: row.workspaceId,
          name: row.workspaceName,
          slug: row.workspaceSlug,
          members: [member],
        });
      }

      return acc;
    }, []);

    return workspaces;
  }),
});
