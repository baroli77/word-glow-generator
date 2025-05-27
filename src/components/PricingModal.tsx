
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Clock, Infinity, Star } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/use-toast";

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  toolName: string;
  onUpgradeComplete?: () => void;
}

const pricingPlans = [
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
    icon: Infinity
  }
];

const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose, toolName, onUpgradeComplete }) => {
  const { user } = useAuth();
  const [upgradeLoading, setUpgradeLoading] = useState<string | null>(null);

  const handleUpgrade = async (planType: 'daily' | 'monthly' | 'lifetime') => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upgrade your plan.",
        variant: "destructive"
      });
      return;
    }
    
    setUpgradeLoading(planType);
    console.log('Starting upgrade process for plan:', planType);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { planType }
      });

      console.log('Checkout response:', { data, error });

      if (error) {
        console.error('Checkout error:', error);
        toast({
          title: "Upgrade failed",
          description: error.message || "Unable to create checkout session. Please try again.",
          variant: "destructive"
        });
        return;
      }

      if (data?.url) {
        console.log('Opening checkout URL:', data.url);
        // Open Stripe checkout in a new tab
        window.open(data.url, '_blank');
        
        // Close modal after opening checkout
        onClose();
        
        // Notify parent component
        if (onUpgradeComplete) {
          onUpgradeComplete();
        }
        
        toast({
          title: "Redirecting to checkout",
          description: "Opening Stripe checkout in a new tab...",
        });
      } else {
        throw new Error('No checkout URL received');
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            Upgrade to Continue Using {toolName}
          </DialogTitle>
          <p className="text-center text-muted-foreground">
            You've reached your free limit. Choose a plan to continue creating professional bios.
          </p>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {pricingPlans.map((plan, index) => {
            const isLoading = upgradeLoading === plan.planType;
            
            return (
              <div 
                key={index} 
                className={`relative border rounded-lg p-6 hover:shadow-lg transition-shadow ${
                  plan.popular ? 'ring-2 ring-makemybio-purple shadow-lg border-makemybio-purple' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-makemybio-purple text-white text-xs font-semibold px-3 py-1 rounded-full">
                      MOST POPULAR
                    </div>
                  </div>
                )}
                
                <div className="text-center mb-4">
                  <plan.icon className="h-8 w-8 mx-auto mb-2 text-makemybio-purple" />
                  <h3 className="font-semibold text-lg">{plan.name}</h3>
                </div>
                
                <div className="text-center mb-6">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground ml-1">/{plan.period}</span>
                </div>
                
                <p className="text-muted-foreground text-sm text-center mb-6">{plan.description}</p>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  variant={plan.popular ? "default" : "outline"}
                  className={`w-full ${plan.popular ? 'bg-gradient-to-r from-makemybio-purple to-makemybio-pink text-white hover:opacity-90' : ''}`}
                  onClick={() => handleUpgrade(plan.planType)}
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : `Choose ${plan.name}`}
                </Button>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 text-center bg-muted rounded-lg p-4">
          <p className="text-sm text-muted-foreground">
            All plans include instant access, no setup fees, and can be used immediately after purchase.
            {' '}Monthly plans can be cancelled anytime.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PricingModal;
