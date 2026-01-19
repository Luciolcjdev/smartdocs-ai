// src/app/api/documents/process/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { files } = await req.json();

    console.log("📄 Files received for processing:", files);

    // TODO (próximo passo):
    // - validar créditos
    // - baixar arquivo do UploadThing
    // - gerar documentação com IA
    // - salvar no banco

    return NextResponse.json({
      success: true,
      processed: files?.length ?? 0,
    });
  } catch (error) {
    console.error("❌ Document processing error:", error);
    return NextResponse.json({ error: "Failed to process documents" }, { status: 500 });
  }
}
