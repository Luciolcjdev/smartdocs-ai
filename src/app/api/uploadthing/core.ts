// app/api/uploadthing/core.ts
import { createUploadthing, type FileRouter } from "uploadthing/next";

import { getSession } from "@/lib/get-session";

const f = createUploadthing();

export const ourFileRouter = {
  codeUploader: f({
    text: { maxFileSize: "4MB", maxFileCount: 10 },
  })
    .middleware(async () => {
      const session = await getSession();
      if (!session?.user) throw new Error("Unauthorized");
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("✅ Upload:", file.name);
      return {
        uploadedBy: metadata.userId,
        fileUrl: file.ufsUrl,
        fileName: file.name,
        ufsUrl: file.ufsUrl,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
