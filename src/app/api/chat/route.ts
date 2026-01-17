// app/api/chat/route.ts
import { db } from "@/db";
import { chat, creditUsage } from "@/db/schema";
import { chatWithRAG } from "@/lib/ai/rag";
import { consumeCredits } from "@/lib/credits/consume";
import { getSession } from "@/lib/get-session";

export async function POST(req: Request) {
  try {
    const session = await getSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { message, workspaceId, documentId } = await req.json();

    if (!message || !workspaceId) {
      return new Response("Missing required fields", { status: 400 });
    }

    // TODO: Verificar créditos

    // Buscar chat existente ou criar novo
    const existingChat = documentId
      ? await db.query.chat.findFirst({
          where: (chat, { eq }) => eq(chat.documentId, documentId),
        })
      : null;

    const chatId = existingChat?.id || crypto.randomUUID();
    const messages = (existingChat?.messages as unknown[]) || [];

    // Adicionar mensagem do usuário
    messages.push({
      role: "user",
      content: message,
      timestamp: new Date().toISOString(),
    });

    await consumeCredits(session.user.id, workspaceId, 1, "chat", { documentId });

    // Gerar resposta com RAG
    const stream = await chatWithRAG(message, workspaceId);

    // Salvar chat (será atualizado depois com resposta completa)
    if (!existingChat && documentId) {
      await db.insert(chat).values({
        id: chatId,
        documentId,
        messages,
      });
    }

    // Registrar uso de crédito
    await db.insert(creditUsage).values({
      id: crypto.randomUUID(),
      userId: session.user.id,
      workspaceId,
      credits: 1,
      type: "chat",
      metadata: { chatId },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: unknown) {
    console.error("Chat error:", error);
    return new Response(error?.toString() || "Chat failed", { status: 500 });
  }
}
