
import { useAuth } from '@/context/AuthContext';
import { subscriptionService } from '@/services/subscriptionService';

export const useSubscriptionActions = () => {
  const { user } = useAuth();

  const upgradeSubscription = async (planType: 'daily' | 'monthly' | 'lifetime') => {
    if (!user) return false;
    return await subscriptionService.upgradeSubscription(user.id, planType);
  };

  return {
    upgradeSubscription
  };
};
