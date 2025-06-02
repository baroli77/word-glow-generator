
import React, { useState } from 'react';
import { useUserAccess } from '@/hooks/useUserAccess';
import AccessGuard from './access/AccessGuard';
import SubscriptionDisplay from './access/SubscriptionDisplay';
import PricingModal from './PricingModal';

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

  const hasAccess = canUseTool(toolType);
  const remainingTime = getRemainingTime();
  const planName = getPlanDisplayName();

  if (loading || !user) return null;

  return (
    <>
      <SubscriptionDisplay
        isAdminUser={isAdminUser}
        planName={planName}
        remainingTime={remainingTime}
        planType={subscription?.plan_type || 'free'}
        toolType={toolType}
        usageCount={usageCount}
        hasAccess={hasAccess}
      />
      
      <AccessGuard
        hasAccess={hasAccess}
        isLoading={loading}
        isAdminUser={isAdminUser}
        planType={subscription?.plan_type || 'free'}
        usageCount={usageCount}
        toolType={toolType}
        toolDisplayName={toolDisplayName}
        onUpgrade={() => setShowPricingModal(true)}
      >
        {/* This will only render if user has access */}
        <div />
      </AccessGuard>
      
      <PricingModal
        isOpen={showPricingModal}
        onClose={() => setShowPricingModal(false)}
        toolName={toolDisplayName}
      />
    </>
  );
};

export default UsageCounter;
