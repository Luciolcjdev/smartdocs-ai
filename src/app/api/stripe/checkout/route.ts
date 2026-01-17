// app/api/stripe/checkout/route.ts
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/db";
import { workspace } from "@/db/schema";
import { getSession } from "@/lib/get-session";
import { PlanName, PLANS } from "@/lib/plans";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { workspaceId, plan } = await req.json();

    if (!workspaceId || !plan || !(plan in PLANS)) {
      return NextResponse.json({ error: "Invalid workspace or plan" }, { status: 400 });
    }

    // Buscar workspace
    const [ws] = await db.select().from(workspace).where(eq(workspace.id, workspaceId)).limit(1);

    if (!ws) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }
    if (ws.plan === plan) {
      return NextResponse.json({ error: "You are already on this plan" }, { status: 400 });
    }

    const planData = PLANS[plan as PlanName];

    if (!planData.priceId) {
      return NextResponse.json({ error: "Cannot checkout Free plan" }, { status: 400 });
    }

    // Criar ou recuperar customer
    let customerId = ws.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: session.user.email,
        metadata: {
          workspaceId: ws.id,
          userId: session.user.id,
        },
      });

      customerId = customer.id;

      await db
        .update(workspace)
        .set({ stripeCustomerId: customerId })
        .where(eq(workspace.id, workspaceId));
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (!appUrl) {
      throw new Error("Missing NEXT_PUBLIC_APP_URL");
    }

    // Criar Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: planData.priceId,
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/dashboard/billing?success=true`,
      cancel_url: `${appUrl}/dashboard/billing?canceled=true`,
      metadata: {
        workspaceId: ws.id,
        plan,
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error: unknown) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: error?.toString() || "Checkout failed" }, { status: 500 });
  }
}
