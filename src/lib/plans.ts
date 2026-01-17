// Planos e preços
export const PLANS = {
  FREE: {
    name: "Free",
    price: 0,
    credits: 10,
    priceId: null, // Não tem produto no Stripe
    features: [
      "10 documentation generations",
      "10 chat messages",
      "1 workspace",
      "Community support",
    ],
  },
  PRO: {
    name: "Pro",
    price: 19,
    credits: 100,
    priceId: process.env.STRIPE_PRO_PRICE_ID!, // Vamos criar
    features: [
      "100 documentation generations",
      "100 chat messages",
      "3 workspaces",
      "Priority support",
      "Unlimited history",
    ],
  },
  ENTERPRISE: {
    name: "Enterprise",
    price: 99,
    credits: -1, // Unlimited
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID!, // Vamos criar
    features: [
      "Unlimited generations",
      "Unlimited chat",
      "Unlimited workspaces",
      "Dedicated support",
      "API access",
      "White-label options",
    ],
  },
} as const;

export type PlanName = keyof typeof PLANS;
