
export const PRICING_CONFIG = {
  plans: {
    free: {
      name: "Free",
      price: 0,
      displayPrice: "$0",
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
      price: 10,
      displayPrice: "$10",
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
      stripeAmount: 1000,
      popular: false
    },
    weekly: {
      name: "1 Week Access",
      price: 18,
      displayPrice: "$18",
      period: "7 days",
      description: "Great for short-term projects",
      features: [
        "Unlimited bio generation",
        "All templates and tones",
        "Export to all formats",
        "7 days of access"
      ],
      limitations: [],
      buttonText: "Get 1 Week Access",
      stripeAmount: 1800,
      popular: false
    },
    monthly: {
      name: "1 Month Access",
      price: 30,
      displayPrice: "$30",
      period: "30 days",
      description: "Perfect for ongoing projects",
      features: [
        "Unlimited bio generation",
        "All templates and tones",
        "Export to all formats",
        "30 days of access",
        "Priority support"
      ],
      limitations: [],
      buttonText: "Get 1 Month Access",
      stripeAmount: 3000,
      popular: true
    },
    lifetime: {
      name: "Lifetime Access",
      price: 90,
      displayPrice: "$90",
      period: "one-time",
      description: "Best value for power users",
      features: [
        "Unlimited bio generation forever",
        "All current and future features",
        "Export to all formats",
        "No recurring payments",
        "Permanent access",
        "Priority support"
      ],
      limitations: [],
      buttonText: "Buy Lifetime",
      stripeAmount: 9000,
      popular: false
    }
  }
} as const;

export type PlanType = keyof typeof PRICING_CONFIG.plans;

export const PLAN_TYPES: PlanType[] = ['free', 'daily', 'weekly', 'monthly', 'lifetime'];

export const getPlanConfig = (planType: PlanType) => {
  return PRICING_CONFIG.plans[planType];
};

export const getStripeConfig = (planType: PlanType) => {
  const plan = getPlanConfig(planType);
  return {
    amount: plan.stripeAmount,
    interval: planType === 'monthly' ? 'month' as const : 
              planType === 'weekly' ? 'week' as const :
              planType === 'daily' ? 'day' as const : null,
    interval_count: planType === 'monthly' || planType === 'weekly' || planType === 'daily' ? 1 : null
  };
};

export const PLAN_HIERARCHY = {
  free: 0,
  daily: 1,
  weekly: 2,
  monthly: 3,
  lifetime: 4
} as const;

export const isDowngrade = (fromPlan: PlanType, toPlan: PlanType): boolean => {
  return PLAN_HIERARCHY[toPlan] < PLAN_HIERARCHY[fromPlan];
};
