// app/(dashboard)/dashboard/billing/page.tsx
import { PageTransition } from "@/components/shared/page-transition";

import { BillingHistory } from "./components/billing-history";
import { PricingCards } from "./components/pricing-cards";

export default function BillingPage() {
  return (
    <PageTransition>
      <div className="p-8">
        <h1 className="mb-8 text-3xl font-bold">Billing & Plans</h1>

        <div className="mb-12">
          <h2 className="mb-4 text-xl font-semibold">Current Plan</h2>
          {/* <CurrentPlanCard /> */}
        </div>

        <div className="mb-12">
          <h2 className="mb-4 text-xl font-semibold">Upgrade Plan</h2>
          <PricingCards currentPlan="FREE" workspaceId="temp-workspace-id" />
        </div>

        <div>
          <h2 className="mb-4 text-xl font-semibold">Billing History</h2>
          <BillingHistory workspaceId="temp-workspace-id" />
        </div>
      </div>
    </PageTransition>
  );
}
