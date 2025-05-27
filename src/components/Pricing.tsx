import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Check, Clock, Star, Crown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/use-toast";

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
    buttonText: "Sign Up Free",
    icon: Star
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
    buttonText: "Get 24h Access",
    icon: Clock
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
    popular: true,
    buttonText: "Start Monthly",
    icon: Star
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
    buttonText: "Buy Lifetime",
    icon: Crown
  }
];

const Pricing: React.FC = () => {
  const { user } = useAuth();
  const { subscription, isAdminUser } = useSubscription();
  const [upgradeLoading, setUpgradeLoading] = useState<string | null>(null);

  const handleUpgrade = async (planType: 'daily' | 'monthly' | 'lifetime') => {
    if (!user) {
      // Redirect to signup if not authenticated
      window.location.href = '/signup';
      return;
    }
    
    setUpgradeLoading(planType);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { planType }
      });

      if (error) {
        console.error('Checkout error:', error);
        toast({
          title: "Upgrade failed",
          description: "Unable to create checkout session. Please try again.",
          variant: "destructive"
        });
        return;
      }

      if (data?.url) {
        // Open Stripe checkout in a new tab
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Upgrade failed",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setUpgradeLoading(null);
    }
  };

  const getCurrentPlan = () => {
    if (!subscription) return 'free';
    return subscription.plan_type;
  };

  const currentPlan = getCurrentPlan();

  const isDowngrade = (planType: string) => {
    const planHierarchy = { 'free': 0, 'daily': 1, 'monthly': 2, 'lifetime': 3 };
    return planHierarchy[planType as keyof typeof planHierarchy] < planHierarchy[currentPlan as keyof typeof planHierarchy];
  };

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
            <div className="mt-4 inline-block bg-brand-purple/10 border border-brand-purple/20 px-4 py-2 rounded-lg">
              <p className="text-sm text-brand-purple font-medium">
                Current Plan: {isAdminUser ? 'Admin (Unlimited)' : currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}
              </p>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {pricingPlans.map((plan, index) => {
            const isCurrentPlan = currentPlan === plan.planType;
            const isPlanDowngrade = isDowngrade(plan.planType);
            const isLoading = upgradeLoading === plan.planType;
            
            return (
              <div 
                key={index} 
                className={`relative h-full bg-card border-2 rounded-xl p-6 shadow-sm transition-all duration-300 hover:shadow-lg flex flex-col ${
                  plan.popular ? 'border-brand-purple shadow-lg shadow-brand-purple/20 scale-105' : 'border-border'
                } ${isCurrentPlan ? 'border-green-500 shadow-lg shadow-green-500/10' : ''} animate-enter`} 
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {plan.popular && !isCurrentPlan && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-brand-pink text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                      MOST POPULAR
                    </div>
                  </div>
                )}
                {isCurrentPlan && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                      CURRENT PLAN
                    </div>
                  </div>
                )}
                
                <div className="flex-grow">
                  <div className="text-center mb-4">
                    <plan.icon className="h-8 w-8 mx-auto mb-2 text-brand-purple" />
                    <h3 className="font-semibold text-xl">{plan.name}</h3>
                  </div>
                  <div className="text-center mb-4">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground ml-1 text-sm">/{plan.period}</span>
                  </div>
                  <p className="text-muted-foreground mb-6 text-sm leading-relaxed text-center">{plan.description}</p>
                  
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-sm leading-relaxed">{feature}</span>
                      </li>
                    ))}
                    {plan.limitations.map((limitation, i) => (
                      <li key={i} className="flex items-start">
                        <span className="h-4 w-4 mr-3 mt-0.5 flex-shrink-0 text-amber-500 text-xs">⚠️</span>
                        <span className="text-sm text-muted-foreground leading-relaxed">{limitation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-auto">
                  <Button 
                    variant={plan.popular && !isCurrentPlan ? "default" : "outline"}
                    className={`w-full font-semibold ${
                      plan.popular && !isCurrentPlan 
                        ? 'bg-brand-purple hover:bg-brand-purple-dark text-white' 
                        : ''
                    } ${isCurrentPlan ? 'bg-green-500 text-white hover:bg-green-600' : ''}`}
                    disabled={isCurrentPlan || isPlanDowngrade || isAdminUser || isLoading}
                    onClick={() => {
                      if (plan.planType === 'free') {
                        window.location.href = '/signup';
                      } else {
                        handleUpgrade(plan.planType);
                      }
                    }}
                  >
                    {isLoading ? 'Processing...' :
                     isCurrentPlan ? 'Current Plan' : 
                     isPlanDowngrade ? 'Downgrade Not Allowed' :
                     isAdminUser ? 'Admin Access' :
                     plan.buttonText}
                  </Button>
                </div>
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
