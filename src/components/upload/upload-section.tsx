// components/upload/upload-section.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { FileUploader } from "./file-uploader";

export function UploadSection() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUploadComplete = async (files: unknown[]) => {
    console.log("Uploaded files:", files);
    setIsProcessing(true);

    try {
      // TODO: Processar arquivos
      const response = await fetch("/api/documents/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          files,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Processing complete:", data);

        // Redirecionar para documentos
        router.push("/documents");
      }
    } catch (error) {
      console.error("Processing error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      {isProcessing && (
        <div className="mb-4 rounded-md bg-blue-50 p-4 text-sm text-blue-600">
          Processing files...
        </div>
      )}
      <FileUploader onUploadComplete={handleUploadComplete} />
    </div>
  );
}
