
import { useUserAccess } from './useUserAccess';
import { useSubscriptionActions } from './useSubscriptionActions';

export const useSubscription = () => {
  const userAccess = useUserAccess();
  const { upgradeSubscription } = useSubscriptionActions();

  return {
    ...userAccess,
    upgradeSubscription,
    // Maintain backward compatibility
    canUseTool: (toolType: 'cover_letter' | 'bio_generator') => userAccess.canUseTool(toolType)
  };
};
