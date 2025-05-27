
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { upgradeService } from '@/services/upgradeService';
import type { PlanType } from '@/config/pricing';

export const useUpgrade = () => {
  const { user } = useAuth();
  const [upgradeLoading, setUpgradeLoading] = useState<PlanType | null>(null);

  const handleUpgrade = async (planType: PlanType) => {
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
