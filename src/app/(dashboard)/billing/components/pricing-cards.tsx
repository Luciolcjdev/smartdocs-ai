// components/billing/pricing-cards.tsx
"use client";

import { Check, Loader2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PLANS } from "@/lib/plans";
import { cn } from "@/lib/utils";

interface PricingCardsProps {
  workspaceId: string;
  currentPlan: "FREE" | "PRO" | "ENTERPRISE";
}

export function PricingCards({ workspaceId, currentPlan }: PricingCardsProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (plan: string) => {
    if (plan === "FREE") return;

    setLoading(plan);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workspaceId, plan }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
      {Object.entries(PLANS).map(([key, plan]) => {
        const isCurrent = key === currentPlan;
        const isPopular = key === "PRO";

        return (
          <Card
            key={key}
            className={cn("relative", isPopular && "border-primary scale-105 shadow-lg")}
          >
            {isPopular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-primary-foreground rounded-full px-3 py-1 text-xs font-bold">
                  POPULAR
                </span>
              </div>
            )}

            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>
                <span className="text-3xl font-bold">
                  {plan.price === 0 ? "Free" : `€${plan.price}`}
                </span>
                {plan.price > 0 && <span className="text-muted-foreground">/month</span>}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <ul className="space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter>
              {isCurrent ? (
                <Button variant="outline" className="w-full" disabled>
                  Current Plan
                </Button>
              ) : (
                <Button
                  onClick={() => handleSubscribe(key)}
                  disabled={loading !== null}
                  className="w-full"
                  variant={isPopular ? "default" : "outline"}
                >
                  {loading === key ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : key === "FREE" ? (
                    "Downgrade"
                  ) : (
                    "Subscribe"
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
