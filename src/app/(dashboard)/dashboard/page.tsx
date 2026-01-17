import { eq } from "drizzle-orm";
import Link from "next/link";

import { db } from "@/db";
import { document, workspace, workspaceMember } from "@/db/schema";
import { getSession } from "@/lib/get-session";

async function getWorkspaceId(userId: string) {
  const member = await db.query.workspaceMember.findFirst({
    where: (wm) => eq(wm.userId, userId),
  });

  return member?.workspaceId;
}

export default async function DashboardPage() {
  const session = await getSession();

  if (!session?.user) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-red-500">Você precisa estar logado.</p>
      </div>
    );
  }

  const workspaceId = await getWorkspaceId(session.user.id);

  if (!workspaceId) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-red-500">Workspace não encontrado.</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="mb-4 text-3xl font-bold">Dashboard</h1>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border p-4">
          <h2 className="text-sm font-semibold text-gray-500">Workspace</h2>
          <p className="text-lg font-bold">{workspaceId}</p>
        </div>

        <div className="rounded-xl border p-4">
          <h2 className="text-sm font-semibold text-gray-500">Documentos</h2>
          <p className="text-lg font-bold">21</p>
        </div>

        <div className="rounded-xl border p-4">
          <h2 className="text-sm font-semibold text-gray-500">Status</h2>
          <p className="text-lg font-bold text-green-600">Online</p>
        </div>
      </div>

      <div className="rounded-xl border p-4">
        <h2 className="mb-2 text-xl font-bold">Últimos documentos</h2>

        <p className="text-gray-500">Nenhum documento processado ainda.</p>
        <div className="space-y-2">
          <div className="rounded-lg border p-3 transition hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold">Como plantar uma árvore</p>
                <p className="text-xs text-gray-500">java</p>
              </div>
              {/* <Link
                // href={`/documents/${document.id}`}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-blue-600"
              >
                Abrir arquivo
              </Link> */}
            </div>

            <p className="mt-2 line-clamp-3 text-sm text-gray-700">Plante mais</p>
          </div>
        </div>
      </div>
    </div>
  );
}
