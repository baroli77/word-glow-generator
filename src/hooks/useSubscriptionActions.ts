
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/use-toast";
import type { PlanType } from '@/config/pricing';

export const useSubscriptionActions = () => {
  const { user } = useAuth();

  const upgradeSubscription = async (planType: 'daily' | 'monthly' | 'lifetime') => {
    if (!user) return false;

    try {
      let expiresAt = null;
      
      if (planType === 'daily') {
        expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 1);
      } else if (planType === 'monthly') {
        expiresAt = new Date();
        expiresAt.setMonth(expiresAt.getMonth() + 1);
      }
      // lifetime has no expiration (null)

      // Deactivate current subscription
      await supabase
        .from('user_subscriptions')
        .update({ is_active: false })
        .eq('user_id', user.id);

      // Create new subscription
      const { error } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: user.id,
          plan_type: planType,
          expires_at: expiresAt?.toISOString(),
          is_active: true
        });

      if (error) throw error;

      const planNames = {
        daily: '24-hour access',
        monthly: 'monthly plan',
        lifetime: 'lifetime access'
      };
      
      toast({
        title: "Subscription upgraded!",
        description: `You now have ${planNames[planType]}. Enjoy unlimited bio generation!`
      });
      
      return true;
    } catch (error) {
      console.error('Error upgrading subscription:', error);
      toast({
        title: "Upgrade failed",
        description: "Please try again later.",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    upgradeSubscription
  };
};
