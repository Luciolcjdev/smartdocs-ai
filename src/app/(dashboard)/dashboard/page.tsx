// app/(dashboard)/dashboard/page.tsx
import { and, count, eq, gte } from "drizzle-orm";
import { redirect } from "next/navigation";

import { PageTransition } from "@/components/shared/page-transition";
import { db } from "@/db";
import { creditUsage, document } from "@/db/schema";
import { getSession } from "@/lib/get-session";

import { RecentActivity } from "../components/recent-activity";
import { StatsCards } from "../components/stats-cards";
import { UsageChart } from "../components/usage-chart";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/authentication");
  }

  // TODO: Pegar workspace real do usuário
  const workspaceId = "temp-workspace-id";

  // Buscar estatísticas
  const [docsCount] = await db
    .select({ count: count() })
    .from(document)
    .where(eq(document.workspaceId, workspaceId));

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [creditsCount] = await db
    .select({ count: count() })
    .from(creditUsage)
    .where(and(eq(creditUsage.workspaceId, workspaceId), gte(creditUsage.createdAt, startOfMonth)));

  const recentDocs = await db
    .select()
    .from(document)
    .where(eq(document.workspaceId, workspaceId))
    .orderBy(document.createdAt)
    .limit(5);

  return (
    <PageTransition>
      <div className="space-y-8 p-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {session.user.name}! Here is what is happening.
          </p>
        </div>

        <StatsCards docsCount={docsCount.count} creditsUsed={creditsCount.count} />

        <div className="grid gap-6 lg:grid-cols-2">
          <UsageChart workspaceId={workspaceId} />
          <RecentActivity documents={recentDocs} />
        </div>
      </div>
    </PageTransition>
  );
}
