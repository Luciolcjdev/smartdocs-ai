// lib/stripe/get-invoices.ts
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { workspace } from "@/db/schema";
import { stripe } from "@/lib/stripe";

export async function getInvoices(workspaceId: string) {
  const [ws] = await db.select().from(workspace).where(eq(workspace.id, workspaceId)).limit(1);

  if (!ws?.stripeCustomerId) {
    return [];
  }

  const invoices = await stripe.invoices.list({
    customer: ws.stripeCustomerId,
    limit: 10,
  });

  return invoices.data.map((invoice) => ({
    id: invoice.id,
    date: new Date(invoice.created * 1000),
    amount: invoice.amount_paid,
    status: invoice.status === "paid" ? "paid" : invoice.status === "open" ? "pending" : "failed",
    invoiceUrl: invoice.hosted_invoice_url || invoice.invoice_pdf,
  }));
}
