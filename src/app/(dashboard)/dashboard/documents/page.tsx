// app/(dashboard)/documents/page.tsx
import { eq } from "drizzle-orm";
import { Upload } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { DocumentCard } from "@/components/documents/document-card";
import { DocumentListSkeleton } from "@/components/shared/document-skeleton";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { document } from "@/db/schema";
import { getSession } from "@/lib/get-session";

export default async function DocumentsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const workspaceId = "temp-workspace-id";

  const docs = await db
    .select()
    .from(document)
    .where(eq(document.workspaceId, workspaceId))
    .orderBy(document.createdAt);

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Documents</h1>
          <p className="text-muted-foreground mt-1">Manage your generated documentation</p>
        </div>
        <Button asChild>
          <Link href="/upload">
            <Upload className="mr-2 h-4 w-4" />
            Upload New
          </Link>
        </Button>
      </div>

      {docs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="bg-muted mb-4 rounded-full p-4">
            <Upload className="text-muted-foreground h-12 w-12" />
          </div>
          <h3 className="mb-2 text-lg font-semibold">No documents yet</h3>
          <p className="text-muted-foreground mb-6 max-w-sm">
            Upload your first code file to generate AI-powered documentation
          </p>
          <Button asChild>
            <Link href="/upload">
              <Upload className="mr-2 h-4 w-4" />
              Upload Files
            </Link>
          </Button>
        </div>
      ) : (
        <Suspense fallback={<DocumentListSkeleton />}>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {docs.map((doc) => (
              <DocumentCard key={doc.id} document={doc} />
            ))}
          </div>
        </Suspense>
      )}
    </div>
  );
}
