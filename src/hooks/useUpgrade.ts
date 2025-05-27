
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/use-toast";
import { useAuth } from '@/context/AuthContext';
import type { PlanType } from '@/config/pricing';

export const useUpgrade = () => {
  const { user } = useAuth();
  const [upgradeLoading, setUpgradeLoading] = useState<PlanType | null>(null);

  const handleUpgrade = async (planType: PlanType) => {
    if (!user) {
      if (planType === 'free') {
        window.location.href = '/signup';
        return;
      }
      
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
        window.open(data.url, '_blank');
        
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

  return {
    handleUpgrade,
    upgradeLoading,
    isLoading: (planType: PlanType) => upgradeLoading === planType
  };
};
