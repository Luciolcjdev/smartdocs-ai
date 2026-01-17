// app/api/documents/generate/route.ts
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/db";
import { creditUsage, document } from "@/db/schema";
import { generateDocumentation } from "@/lib/ai/generate-docs";
import { consumeCredits } from "@/lib/credits/consume";
import { getSession } from "@/lib/get-session";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { documentId } = await req.json();

    // Buscar documento
    const [doc] = await db.select().from(document).where(eq(document.id, documentId)).limit(1);

    if (!doc) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    await consumeCredits(session.user.id, doc.workspaceId, 1, "generation", { documentId: doc.id });

    // TODO: Verificar créditos disponíveis
    // const hasCredits = await checkCredits(doc.workspaceId, 1);
    // if (!hasCredits) {
    //   return NextResponse.json({ error: "Insufficient credits" }, { status: 403 });
    // }

    // Gerar documentação
    const generatedDocs = await generateDocumentation({
      code: doc.content,
      language: doc.language || "text",
    });

    // Atualizar documento com documentação gerada
    const [updatedDoc] = await db
      .update(document)
      .set({
        content: generatedDocs,
        updatedAt: new Date(),
      })
      .where(eq(document.id, documentId))
      .returning();

    // Registrar uso de crédito
    await db.insert(creditUsage).values({
      id: crypto.randomUUID(),
      userId: session.user.id,
      workspaceId: doc.workspaceId,
      credits: 1,
      type: "generation",
      metadata: {
        documentId: doc.id,
        model: "gpt-4-turbo-preview",
      },
    });

    return NextResponse.json({
      success: true,
      documentation: generatedDocs,
      document: updatedDoc,
    });
  } catch (error: unknown) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: error?.toString() || "Failed to generate documentation" },
      { status: 500 },
    );
  }
}
