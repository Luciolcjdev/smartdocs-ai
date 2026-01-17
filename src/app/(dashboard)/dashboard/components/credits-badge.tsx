// components/dashboard/credits-badge.tsx
import { Zap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { getUsageStats } from "@/lib/credits/check";

export async function CreditsBadge({ workspaceId }: { workspaceId?: string }) {
  if (!workspaceId) return null;

  const stats = await getUsageStats(workspaceId);

  if (!stats) return null;

  const isLow = typeof stats.remaining === "number" && stats.remaining < 10;
  const isUnlimited = stats.limit === -1;

  return (
    <Badge variant={isLow ? "destructive" : "secondary"} className="gap-1">
      <Zap className="h-3 w-3" />
      {isUnlimited ? "∞ Unlimited" : `${stats.remaining}/${stats.limit} credits`}
    </Badge>
  );
}
