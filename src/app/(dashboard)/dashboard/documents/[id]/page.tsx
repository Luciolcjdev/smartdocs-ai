// app/(dashboard)/dashboard/documents/[id]/page.tsx
import { eq } from "drizzle-orm";

// import { RegenerateButton } from "@/components/documents/RegenerateButton";
// import { Markdown } from "@/components/Markdown";
import { db } from "@/db";
import { document as documentTable } from "@/db/schema";

export default async function DocumentPage({ params }: { params: { id: string } }) {
  const [document] = await db
    .select()
    .from(documentTable)
    .where(eq(documentTable.id, params.id))
    .limit(1);

  if (!document) {
    throw new Error("Document not found");
    // ou: notFound() se quiser usar Next.js navigation
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex justify-between">
        <h1 className="text-3xl font-bold">{document.title}</h1>
        {/* <RegenerateButton documentId={document.id} /> */}
      </div>

      <div className="prose max-w-none">{/* <Markdown content={document.content} /> */}</div>
    </div>
  );
}
