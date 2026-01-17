// app/(dashboard)/dashboard/page.tsx
import { eq } from "drizzle-orm";
import { count } from "drizzle-orm";
import { headers } from "next/headers";

// import { RecentActivity } from "@/components/dashboard/RecentActivity";
// import { StatsCard } from "@/components/dashboard/StatsCard";
// import { UsageChart } from "@/components/dashboard/UsageChart";
import { db } from "@/db";
import { creditUsage, document, workspace, workspaceMember } from "@/db/schema";
import { auth } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  const [documentsCount, creditsCount, workspacesCount] = await Promise.all([
    // 📄 Documents count (workspace → members → user)
    db
      .select({ value: count() })
      .from(document)
      .innerJoin(workspace, eq(document.workspaceId, workspace.id))
      .innerJoin(workspaceMember, eq(workspaceMember.workspaceId, workspace.id))
      .where(eq(workspaceMember.userId, userId))
      .then((res) => res[0]?.value ?? 0),

    // ⚡ Credit usage count
    db
      .select({ value: count() })
      .from(creditUsage)
      .where(eq(creditUsage.userId, userId))
      .then((res) => res[0]?.value ?? 0),

    // 👥 Workspaces count
    db
      .select({ value: count() })
      .from(workspace)
      .innerJoin(workspaceMember, eq(workspaceMember.workspaceId, workspace.id))
      .where(eq(workspaceMember.userId, userId))
      .then((res) => res[0]?.value ?? 0),
  ]);

  return (
    <div className="p-8">
      <h1 className="mb-8 text-3xl font-bold">Dashboard</h1>

      <div className="mb-8 grid grid-cols-3 gap-6">
        {/* <StatsCard title="Documents" value={documentsCount} icon="file" />
        <StatsCard title="Generations" value={creditsCount} icon="zap" />
        <StatsCard title="Workspaces" value={workspacesCount} icon="users" /> */}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* <UsageChart />
        <RecentActivity /> */}
      </div>
    </div>
  );
}
