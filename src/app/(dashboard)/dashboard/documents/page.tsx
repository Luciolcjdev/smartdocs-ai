// import { DocumentCard } from "@/components/documents/DocumentCard";
// import { UploadButton } from "@/components/documents/UploadButton";

import { headers } from "next/headers";

import { auth } from "@/lib/auth";

export default async function DocumentsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Documents</h1>
        {/* <UploadButton /> */}
      </div>

      <div className="grid grid-cols-3 gap-6">{/* DocumentCard components */}</div>
    </div>
  );
}
