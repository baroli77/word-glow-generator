export const PRICING_CONFIG = {
  plans: {
    free: {
      name: "Free",
      price: 0,
      displayPrice: "£0",
      period: "forever",
      description: "Try our bio generator",
      features: [
        "1 free bio generation",
        "Basic templates",
        "Standard export options"
      ],
      limitations: ["Must sign up to access", "Limited to 1 bio"],
      buttonText: "Sign Up Free",
      stripeAmount: 0,
      popular: false
    },
    daily: {
      name: "24-Hour Access",
      price: 9,
      displayPrice: "£9",
      period: "24 hours",
      description: "Perfect for immediate needs",
      features: [
        "Unlimited bio generation",
        "All templates and tones",
        "Export to all formats",
        "24 hours of access"
      ],
      limitations: [],
      buttonText: "Get 24h Access",
      stripeAmount: 900,
      popular: false
    },
    monthly: {
      name: "Monthly Plan",
      price: 29,
      displayPrice: "£29",
      period: "per month",
      description: "Great for regular use",
      features: [
        "Unlimited bio generation",
        "All templates and tones",
        "Export to all formats",
        "Auto-renew monthly",
        "Cancel anytime"
      ],
      limitations: [],
      buttonText: "Start Monthly",
      stripeAmount: 2900,
      popular: true
    },
    lifetime: {
      name: "Lifetime Access",
      price: 99,
      displayPrice: "£99",
      period: "one-time",
      description: "Best value for power users",
      features: [
        "Unlimited bio generation forever",
        "All current and future features",
        "Export to all formats",
        "No recurring payments",
        "Permanent access"
      ],
      limitations: [],
      buttonText: "Buy Lifetime",
      stripeAmount: 9900,
      popular: false
    }
  }
} as const;

export type PlanType = keyof typeof PRICING_CONFIG.plans;

export const PLAN_TYPES: PlanType[] = ['free', 'daily', 'monthly', 'lifetime'];

export const getPlanConfig = (planType: PlanType) => {
  return PRICING_CONFIG.plans[planType];
};

export const getStripeConfig = (planType: PlanType) => {
  const plan = getPlanConfig(planType);
  return {
    amount: plan.stripeAmount,
    interval: planType === 'monthly' ? 'month' as const : planType === 'daily' ? 'day' as const : null,
    interval_count: planType === 'monthly' || planType === 'daily' ? 1 : null
  };
};

export const PLAN_HIERARCHY = {
  free: 0,
  daily: 1,
  monthly: 2,
  lifetime: 3
} as const;

export const isDowngrade = (fromPlan: PlanType, toPlan: PlanType): boolean => {
  return PLAN_HIERARCHY[toPlan] < PLAN_HIERARCHY[fromPlan];
};
