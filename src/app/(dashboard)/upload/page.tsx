// app/(dashboard)/upload/page.tsx
import { redirect } from "next/navigation";

import { UploadSection } from "@/components/upload/upload-section";
import { getSession } from "@/lib/get-session";

export default async function UploadPage() {
  const session = await getSession();

  if (!session) {
    redirect("/authentication");
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Upload Code Files</h1>
        <p className="text-muted-foreground mt-2">
          Upload your code files to generate AI-powered documentation
        </p>
      </div>

      <UploadSection />
    </div>
  );
}
