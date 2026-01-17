// components/upload/file-uploader.tsx
"use client";

import { AlertCircle, CheckCircle2, File, Upload, X } from "lucide-react";
import { useState } from "react";
import { useDropzone } from "react-dropzone";

import { Button } from "@/components/ui/button";
import { useUploadThing } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";

interface FileWithPreview extends File {
  preview?: string;
}

interface UploadedFile {
  name: string;
  url: string;
  size: number;
}

export function FileUploader({
  onUploadComplete,
}: {
  onUploadComplete: (files: UploadedFile[]) => void;
}) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [error, setError] = useState<string>("");

  const { startUpload } = useUploadThing("codeUploader", {
    onClientUploadComplete: (res) => {
      const uploaded = res.map((file) => ({
        name: file.name,
        url: file.ufsUrl,
        ufsUrl: file.ufsUrl,
        size: file.size,
      }));

      setUploadedFiles(uploaded);
      onUploadComplete(uploaded);
      setUploading(false);
      setFiles([]);
    },
    onUploadError: (error) => {
      setError(error.message);
      setUploading(false);
    },
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "text/javascript": [".js", ".jsx"],
      "text/typescript": [".ts", ".tsx"],
      "text/x-python": [".py"],
      "text/markdown": [".md"],
      "text/plain": [".txt"],
    },
    maxFiles: 10,
    maxSize: 4 * 1024 * 1024, // 4MB
    onDrop: (acceptedFiles) => {
      setError("");
      setFiles(acceptedFiles);
    },
    onDropRejected: (fileRejections) => {
      const error = fileRejections[0]?.errors[0];
      if (error?.code === "file-too-large") {
        setError("File is too large. Max size is 4MB.");
      } else if (error?.code === "file-invalid-type") {
        setError("Invalid file type. Only .js, .ts, .py, .md files are allowed.");
      } else {
        setError(error?.message || "Failed to upload files");
      }
    },
  });

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setError("");

    try {
      await startUpload(files);
    } catch (_err) {
      setError("Upload failed. Please try again.");
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={cn(
          "cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors",
          isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400",
          uploading && "pointer-events-none opacity-50",
        )}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm font-medium">
          {isDragActive ? "Drop files here..." : "Drag & drop code files here"}
        </p>
        <p className="mt-1 text-xs text-gray-500">or click to browse (max 4MB per file)</p>
        <p className="mt-1 text-xs text-gray-400">Supported: .js, .jsx, .ts, .tsx, .py, .md</p>
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-600">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {/* Selected files */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Selected files ({files.length})</h3>
          <div className="space-y-1">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between rounded-md border p-2">
                <div className="flex items-center gap-2">
                  <File className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{file.name}</span>
                  <span className="text-xs text-gray-400">
                    ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  disabled={uploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button onClick={handleUpload} disabled={uploading} className="w-full">
            {uploading
              ? "Uploading..."
              : `Upload ${files.length} file${files.length > 1 ? "s" : ""}`}
          </Button>
        </div>
      )}

      {/* Uploaded files */}
      {uploadedFiles.length > 0 && (
        <div className="rounded-md bg-green-50 p-4">
          <div className="mb-2 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <h3 className="text-sm font-medium text-green-900">Upload complete!</h3>
          </div>
          <ul className="space-y-1">
            {uploadedFiles.map((file, index) => (
              <li key={index} className="text-xs text-green-700">
                ✓ {file.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
