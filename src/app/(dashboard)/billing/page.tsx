// app/(dashboard)/billing/page.tsx
import { redirect } from "next/navigation";

import { db } from "@/db";
import { getSession } from "@/lib/get-session";

import { ManageSubscription } from "./components/manage-subscription";
import { PricingCards } from "./components/pricing-cards";
import { UsageStats } from "./components/usage-stats";

export default async function BillingPage() {
  const session = await getSession();

  if (!session) {
    redirect("/authetication");
  }

  // TODO: Pegar workspace do usuário (por enquanto, pegar o primeiro)
  const workspaces = await db.query.workspaceMember.findMany({
    where: (member, { eq }) => eq(member.userId, session.user.id),
    with: { workspace: true },
  });

  const currentWorkspace = workspaces[0]?.workspace;

  if (!currentWorkspace) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col space-y-8 px-5 py-8">
      <div>
        <h1 className="text-3xl font-bold">Billing & Plans</h1>
        <p className="text-muted-foreground mt-2">Manage your subscription and usage</p>
      </div>
      <div className="flex w-full flex-col space-y-8">
        <UsageStats workspaceId={currentWorkspace.id} />
        <div>
          <h2 className="text-2xl font-bold">Subscription</h2>

          {currentWorkspace.stripeCustomerId && (
            <ManageSubscription workspaceId={currentWorkspace.id} />
          )}
        </div>
      </div>

      <div>
        <h2 className="mb-6 text-2xl font-bold">Choose Your Plan</h2>
        <PricingCards workspaceId={currentWorkspace.id} currentPlan={currentWorkspace.plan} />
      </div>
    </div>
  );
}
