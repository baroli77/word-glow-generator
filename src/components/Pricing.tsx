
import React from 'react';
import { Button } from "@/components/ui/button";
import { Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';

const pricingPlans = [
  {
    name: "Free",
    price: "£0",
    period: "forever",
    description: "Try our bio generator",
    features: [
      "1 free bio generation",
      "Basic templates",
      "Standard export options"
    ],
    limitations: ["Must sign up to access", "Limited to 1 bio"],
    planType: "free" as const,
    buttonText: "Sign Up Free"
  },
  {
    name: "24-Hour Access",
    price: "£9",
    period: "24 hours",
    description: "Perfect for immediate needs",
    features: [
      "Unlimited bio generation",
      "All templates and tones",
      "Export to all formats",
      "24 hours of access"
    ],
    limitations: [],
    planType: "daily" as const,
    popular: true,
    buttonText: "Get 24h Access"
  },
  {
    name: "Monthly Plan",
    price: "£29",
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
    planType: "monthly" as const,
    buttonText: "Start Monthly"
  },
  {
    name: "Lifetime Access",
    price: "£99",
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
    planType: "lifetime" as const,
    buttonText: "Buy Lifetime"
  }
];

const Pricing: React.FC = () => {
  const { user } = useAuth();
  const { subscription, upgradeSubscription } = useSubscription();

  const handleUpgrade = async (planType: 'daily' | 'monthly' | 'lifetime') => {
    if (!user) {
      // Redirect to signup if not authenticated
      window.location.href = '/signup';
      return;
    }
    
    await upgradeSubscription(planType);
  };

  const getCurrentPlan = () => {
    if (!subscription) return 'free';
    return subscription.plan_type;
  };

  const currentPlan = getCurrentPlan();

  return (
    <section className="py-16 md:py-24 px-6 bg-accent/50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Simple, transparent <span className="text-gradient">pricing</span>
          </h2>
          <p className="text-muted-foreground md:text-lg max-w-2xl mx-auto">
            Choose the plan that's right for you and start creating professional bios.
          </p>
          {user && (
            <div className="mt-4 inline-block bg-wordcraft-purple/10 border border-wordcraft-purple/20 px-4 py-2 rounded-lg">
              <p className="text-sm text-wordcraft-purple font-medium">
                Current Plan: {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}
              </p>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pricingPlans.map((plan, index) => {
            const isCurrentPlan = currentPlan === plan.planType;
            const isDowngrade = currentPlan === 'lifetime' || 
              (currentPlan === 'monthly' && ['daily', 'free'].includes(plan.planType)) ||
              (currentPlan === 'daily' && plan.planType === 'free');
            
            return (
              <div 
                key={index} 
                className={`wordcraft-card relative overflow-hidden ${
                  plan.popular ? 'ring-2 ring-wordcraft-purple shadow-lg shadow-wordcraft-purple/10' : ''
                } ${isCurrentPlan ? 'ring-2 ring-green-500 shadow-lg shadow-green-500/10' : ''} animate-enter`} 
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {plan.popular && !isCurrentPlan && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-wordcraft-purple text-white text-xs font-semibold px-3 py-1 rounded-bl-lg">
                      MOST POPULAR
                    </div>
                  </div>
                )}
                {isCurrentPlan && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-bl-lg">
                      CURRENT PLAN
                    </div>
                  </div>
                )}
                
                <h3 className="font-semibold text-xl">{plan.name}</h3>
                <div className="mt-4 mb-6">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground ml-1">/{plan.period}</span>
                </div>
                <p className="text-muted-foreground mb-6">{plan.description}</p>
                
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                  {plan.limitations.map((limitation, i) => (
                    <li key={i} className="flex items-start">
                      <span className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-amber-500">⚠️</span>
                      <span className="text-sm text-muted-foreground">{limitation}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  variant={plan.popular && !isCurrentPlan ? "default" : "outline"}
                  className={`w-full ${
                    plan.popular && !isCurrentPlan 
                      ? 'bg-gradient-to-r from-wordcraft-purple to-wordcraft-pink text-white hover:opacity-90' 
                      : ''
                  } ${isCurrentPlan ? 'bg-green-500 text-white hover:bg-green-600' : ''}`}
                  disabled={isCurrentPlan || isDowngrade}
                  onClick={() => {
                    if (plan.planType === 'free') {
                      window.location.href = '/signup';
                    } else {
                      handleUpgrade(plan.planType);
                    }
                  }}
                >
                  {isCurrentPlan ? 'Current Plan' : 
                   isDowngrade ? 'Downgrade' : 
                   plan.buttonText}
                </Button>
              </div>
            );
          })}
        </div>
        
        <div className="mt-16 text-center">
          <div className="bg-card border rounded-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold mb-4">Need help choosing?</h3>
            <p className="text-muted-foreground mb-6">
              Start with our free tier to try the service, then upgrade when you need more bio generations.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">Perfect for trying out:</h4>
                <p className="text-muted-foreground">Free tier</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Best for regular use:</h4>
                <p className="text-muted-foreground">Monthly or Lifetime</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
