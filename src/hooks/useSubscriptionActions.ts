
import { useAuth } from '@/context/AuthContext';
import { userAccessService } from '@/services/userAccessService';
import { useUserAccess } from './useUserAccess';

export const useSubscriptionActions = () => {
  const { user } = useAuth();
  const { refetch } = useUserAccess();

  const upgradeSubscription = async (planType: 'daily' | 'weekly' | 'monthly' | 'lifetime') => {
    if (!user) return false;
    
    const success = await userAccessService.upgradeSubscription(user.id, planType);
    if (success) {
      // Refresh subscription data after successful upgrade
      await refetch();
    }
    return success;
  };

  const cancelSubscription = async () => {
    if (!user) return false;
    
    const success = await userAccessService.cancelSubscription(user.id);
    if (success) {
      // Refresh subscription data after successful cancellation
      await refetch();
    }
    return success;
  };

  return {
    upgradeSubscription,
    cancelSubscription
  };
};
