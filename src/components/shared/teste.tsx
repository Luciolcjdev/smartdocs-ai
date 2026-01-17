"use client";

import { Button } from "../ui/button";

export default function Teste() {
  const handleTest = async () => {
    const response = await fetch("/api/documents/process", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        files: [],
        workspaceId: "temp-workspace-id",
      }),
    });

    console.log("status:", response.status);
    console.log("body:", await response.json());
  };

  return <Button onClick={handleTest}>Testar rota /api/documents/process</Button>;
}
