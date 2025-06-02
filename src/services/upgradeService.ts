
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/use-toast";
import type { PlanType } from '@/config/pricing';

export class UpgradeService {
  private static instance: UpgradeService;
  
  static getInstance(): UpgradeService {
    if (!UpgradeService.instance) {
      UpgradeService.instance = new UpgradeService();
    }
    return UpgradeService.instance;
  }

  async createCheckoutSession(planType: PlanType, userId: string): Promise<string | null> {
    try {
      console.log('Starting upgrade process for plan:', planType);
      
      // Get user email from auth
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user?.email) {
        console.error('User authentication error:', userError);
        toast({
          title: "Authentication error",
          description: "Please sign in to continue.",
          variant: "destructive"
        });
        return null;
      }

      // Map planType to the correct plan string for the API
      const planMapping = {
        'daily': '24hr',
        'weekly': '1week', 
        'monthly': '1month',
        'lifetime': 'lifetime',
        'free': null // Free plan doesn't need checkout
      };

      const apiPlan = planMapping[planType as keyof typeof planMapping];
      
      if (!apiPlan) {
        console.error('Invalid plan type for checkout:', planType);
        toast({
          title: "Invalid plan",
          description: "Please select a valid plan.",
          variant: "destructive"
        });
        return null;
      }

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { 
          email: user.email,
          plan: apiPlan
        }
      });

      console.log('Checkout response:', { data, error });

      if (error) {
        console.error('Checkout error:', error);
        toast({
          title: "Upgrade failed",
          description: error.message || "Unable to create checkout session. Please try again.",
          variant: "destructive"
        });
        return null;
      }

      if (data?.url) {
        console.log('Opening checkout URL:', data.url);
        
        toast({
          title: "Redirecting to checkout",
          description: "Opening Stripe checkout in a new tab...",
        });
        
        return data.url;
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
      return null;
    }
  }

  handleFreeSignup(): void {
    window.location.href = '/signup';
  }

  handleAuthenticationRequired(): void {
    toast({
      title: "Authentication required",
      description: "Please sign in to upgrade your plan.",
      variant: "destructive"
    });
  }
}

export const upgradeService = UpgradeService.getInstance();
