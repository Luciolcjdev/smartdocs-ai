// app/api/stripe/portal/route.ts
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/db";
import { workspace } from "@/db/schema";
import { getSession } from "@/lib/get-session";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { workspaceId } = await req.json();

    const [ws] = await db.select().from(workspace).where(eq(workspace.id, workspaceId)).limit(1);

    if (!ws || !ws.stripeCustomerId) {
      return NextResponse.json({ error: "No subscription found" }, { status: 404 });
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: ws.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error: unknown) {
    console.error("Portal error:", error);
    return NextResponse.json({ error: error?.toString() || "Portal failed" }, { status: 500 });
  }
}
