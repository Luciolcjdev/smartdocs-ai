import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/db";
import { document, workspace, workspaceMember } from "@/db/schema";
import { getSession } from "@/lib/get-session";
import { processFile } from "@/lib/process-file";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Pega o workspace do usuário
    let workspaceMemberRecord = await db.query.workspaceMember.findFirst({
      where: (wm) => eq(wm.userId, session.user.id),
    });

    // Se não existe workspace, cria um workspace e um workspace_member
    if (!workspaceMemberRecord) {
      const workspaceId = crypto.randomUUID();

      await db.insert(workspace).values({
        id: workspaceId,
        name: `${session.user.name}'s Workspace`,
        slug: `${session.user.name}-${workspaceId.slice(0, 6)}`,
      });

      const [newWorkspaceMember] = await db
        .insert(workspaceMember)
        .values({
          id: crypto.randomUUID(),
          role: "OWNER",
          userId: session.user.id,
          workspaceId,
        })
        .returning();

      workspaceMemberRecord = newWorkspaceMember;
    }

    const workspaceId = workspaceMemberRecord.workspaceId;

    const { files } = await req.json();

    const processedDocs = [];

    for (const file of files) {
      const processed = await processFile(file.ufsUrl, file.name);

      const [newDoc] = await db
        .insert(document)
        .values({
          id: crypto.randomUUID(),
          title: file.name,
          content: processed.content,
          language: processed.language,
          fileName: processed.fileName,
          fileUrl: processed.fileUrl,
          workspaceId,
        })
        .returning();

      processedDocs.push(newDoc);
    }

    return NextResponse.json({
      success: true,
      documents: processedDocs,
    });
  } catch (error) {
    console.error("Process error:", error);
    return NextResponse.json({ error: "Failed to process files" }, { status: 500 });
  }
}
