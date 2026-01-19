// components/billing/billing-history.tsx
import { Calendar, DollarSign, Download } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getInvoices } from "@/lib/stripe/get-invoices";
import { formatDate } from "@/lib/utils";

interface Invoice {
  id: string;
  date: Date;
  amount: number;
  status: "paid" | "pending" | "failed";
  invoiceUrl?: string;
}

interface BillingHistoryProps {
  workspaceId: string;
}

export async function BillingHistory({ workspaceId }: BillingHistoryProps) {
  // TODO: Buscar invoices reais do Stripe
  const invoices = await getInvoices(workspaceId);

  // Mock data por enquanto
  // const invoices: Invoice[] = [
  //   {
  //     id: "inv_001",
  //     date: new Date("2024-01-15"),
  //     amount: 1900, // em centavos (€19.00)
  //     status: "paid",
  //     invoiceUrl: "https://invoice.stripe.com/...",
  //   },
  //   {
  //     id: "inv_002",
  //     date: new Date("2023-12-15"),
  //     amount: 1900,
  //     status: "paid",
  //     invoiceUrl: "https://invoice.stripe.com/...",
  //   },
  //   {
  //     id: "inv_003",
  //     date: new Date("2023-11-15"),
  //     amount: 1900,
  //     status: "paid",
  //     invoiceUrl: "https://invoice.stripe.com/...",
  //   },
  // ];

  if (invoices.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="bg-muted mb-4 rounded-full p-3">
              <DollarSign className="text-muted-foreground h-8 w-8" />
            </div>
            <p className="text-muted-foreground text-sm">No invoices yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {invoices.map((invoice) => (
            <div
              key={invoice.id}
              className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-4 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-green-50 p-2 dark:bg-green-950">
                  <DollarSign className="h-4 w-4 text-green-600" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">€{(invoice.amount / 100).toFixed(2)}</p>
                    <Badge
                      variant={
                        invoice.status === "paid"
                          ? "default"
                          : invoice.status === "pending"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {invoice.status}
                    </Badge>
                  </div>
                  <div className="text-muted-foreground mt-1 flex items-center gap-2 text-xs">
                    <Calendar className="h-3 w-3" />
                    {formatDate(invoice.date)}
                  </div>
                </div>
              </div>

              {invoice.invoiceUrl && (
                <Button variant="outline" size="sm" asChild>
                  <Link href={invoice.invoiceUrl} target="_blank" rel="noopener noreferrer">
                    <Download className="mr-2 h-4 w-4" />
                    Invoice
                  </Link>
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
