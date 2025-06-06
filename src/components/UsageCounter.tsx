
import React, { useState } from 'react';
import { useUserAccess } from '@/hooks/useUserAccess';
import AccessGuard from './access/AccessGuard';
import SubscriptionDisplay from './access/SubscriptionDisplay';
import PricingModal from './PricingModal';
import type { PlanType } from '@/config/pricing';

interface UsageCounterProps {
  toolType: 'cover_letter' | 'bio_generator';
  toolDisplayName: string;
}

const UsageCounter: React.FC<UsageCounterProps> = ({ toolType, toolDisplayName }) => {
  const {
    user,
    subscription,
    usageCount,
    loading,
    isAdminUser,
    canUseTool,
    getRemainingTime,
    getPlanDisplayName
  } = useUserAccess();
  
  const [showPricingModal, setShowPricingModal] = useState(false);

  if (loading || !user) return null;

  const hasAccess = canUseTool(toolType);
  const remainingTime = getRemainingTime();
  const planName = getPlanDisplayName();
  const currentPlan = (subscription?.plan_type || 'free') as PlanType;

  // For bio generator, use the usage count from useUserAccess
  // For cover letter, we need to fetch it separately since useUserAccess only tracks bio usage
  const displayUsageCount = toolType === 'bio_generator' ? usageCount : 0;

  const handleUpgradeComplete = () => {
    setShowPricingModal(false);
  };

  return (
    <>
      <SubscriptionDisplay
        isAdminUser={isAdminUser}
        planName={planName}
        remainingTime={remainingTime}
        planType={currentPlan}
        toolType={toolType}
        usageCount={displayUsageCount}
        hasAccess={hasAccess}
      />
      
      <AccessGuard
        hasAccess={hasAccess}
        isLoading={loading}
        isAdminUser={isAdminUser}
        planType={currentPlan}
        usageCount={displayUsageCount}
        toolType={toolType}
        toolDisplayName={toolDisplayName}
        onUpgrade={() => setShowPricingModal(true)}
      >
        <div />
      </AccessGuard>
      
      <PricingModal
        isOpen={showPricingModal}
        onClose={() => setShowPricingModal(false)}
        toolName={toolDisplayName}
        currentPlan={currentPlan}
        onUpgradeComplete={handleUpgradeComplete}
      />
    </>
  );
};

export default UsageCounter;
