
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { upgradeService } from '@/services/upgradeService';
import { useUserAccess } from './useUserAccess';
import type { PlanType } from '@/config/pricing';

export const useSimpleUpgrade = () => {
  const { user } = useAuth();
  const { refetch } = useUserAccess();
  const [upgradeLoading, setUpgradeLoading] = useState<PlanType | null>(null);

  const handleUpgrade = async (planType: PlanType, onComplete?: () => void) => {
    if (!user) {
      if (planType === 'free') {
        upgradeService.handleFreeSignup();
        return;
      }
      
      upgradeService.handleAuthenticationRequired();
      return;
    }
    
    setUpgradeLoading(planType);
    
    try {
      const checkoutUrl = await upgradeService.createCheckoutSession(planType, user.id);
      if (checkoutUrl) {
        window.open(checkoutUrl, '_blank');
        
        // Call completion callback and refresh data
        onComplete?.();
        setTimeout(() => {
          refetch();
        }, 5000);
      }
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
