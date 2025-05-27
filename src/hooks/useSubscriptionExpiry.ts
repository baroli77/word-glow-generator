
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { showToast } from '@/utils/toast';

interface ExpiryResult {
  expired: boolean;
  old_plan_type: string;
  new_plan_type: string;
}

export const useSubscriptionExpiry = () => {
  const [isChecking, setIsChecking] = useState(false);

  const checkAndExpireUserSubscription = useCallback(async (userId: string): Promise<ExpiryResult | null> => {
    if (!userId) return null;

    setIsChecking(true);
    try {
      // Call the database function to check and expire subscription
      const { data, error } = await supabase.rpc('check_user_subscription_expiry', {
        target_user_id: userId
      });

      if (error) {
        console.error('Error checking subscription expiry:', error);
        return null;
      }

      const result = data?.[0] as ExpiryResult;
      
      // Show notification if subscription expired
      if (result?.expired) {
        const planNames = {
          daily: '24-hour access',
          monthly: 'monthly plan',
          lifetime: 'lifetime access',
          free: 'free plan'
        };
        
        const oldPlanName = planNames[result.old_plan_type as keyof typeof planNames] || result.old_plan_type;
        
        showToast.error(`Your ${oldPlanName} has expired. You're now on the free plan.`);
      }

      return result;
    } catch (error) {
      console.error('Error in subscription expiry check:', error);
      return null;
    } finally {
      setIsChecking(false);
    }
  }, []);

  return {
    checkAndExpireUserSubscription,
    isChecking
  };
};
