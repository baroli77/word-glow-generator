
import { useSubscriptionData } from './useSubscriptionData';
import { useUsageTracking } from './useUsageTracking';
import { useSubscriptionActions } from './useSubscriptionActions';

export const useSubscription = () => {
  const {
    subscription,
    loading,
    fetchSubscription,
    getRemainingTime,
    getPlanDisplayName,
    isAdminUser
  } = useSubscriptionData();

  const {
    usageCount,
    canUseTool,
    recordUsage,
    fetchUsageCount
  } = useUsageTracking();

  const { upgradeSubscription } = useSubscriptionActions();

  return {
    subscription,
    loading,
    usageCount,
    canUseTool: (toolType: 'cover_letter' | 'bio_generator') => canUseTool(toolType, subscription, isAdminUser),
    recordUsage,
    upgradeSubscription,
    refetch: fetchSubscription,
    getRemainingTime,
    getPlanDisplayName,
    isAdminUser
  };
};
