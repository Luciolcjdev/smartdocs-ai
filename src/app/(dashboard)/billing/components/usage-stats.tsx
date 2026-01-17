// components/billing/usage-stats.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getUsageStats } from "@/lib/credits/check";

export async function UsageStats({ workspaceId }: { workspaceId: string }) {
  const stats = await getUsageStats(workspaceId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Usage</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="mb-2 flex justify-between text-sm">
              <span>Credits Used</span>
              <span className="font-medium">
                {stats.used} / {stats.limit === -1 ? "∞" : stats.limit}
              </span>
            </div>
            <Progress value={stats.percentage} className="h-2" />
          </div>

          <div className="border-t pt-4">
            <p className="text-muted-foreground text-sm">
              Current Plan: <span className="text-foreground font-semibold">{stats.plan}</span>
            </p>
            <p className="text-muted-foreground mt-1 text-sm">
              Remaining:{" "}
              <span className="text-foreground font-semibold">
                {typeof stats.remaining === "number" ? stats.remaining : "Unlimited"}
              </span>{" "}
              credits
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
