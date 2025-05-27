
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Lock, Sparkles } from 'lucide-react';
import SubscriptionStatus from './subscription/SubscriptionStatus';
import UpgradePlans from './subscription/UpgradePlans';
import PricingModal from './PricingModal';

interface UsageCounterProps {
  toolType: 'cover_letter' | 'bio_generator';
  toolDisplayName: string;
}

const UsageCounter: React.FC<UsageCounterProps> = ({ toolType, toolDisplayName }) => {
  const { user } = useAuth();
  const { subscription, usageCount, loading, getRemainingTime, getPlanDisplayName, isAdminUser } = useSubscription();
  const [canUse, setCanUse] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);

  const remainingTime = getRemainingTime();
  const planName = getPlanDisplayName();

  // Determine if user can use the tool
  useEffect(() => {
    const checkAccess = () => {
      if (!user) {
        setCanUse(false);
        return;
      }

      // Admin users have unlimited access
      if (isAdminUser) {
        setCanUse(true);
        return;
      }

      // If user has an active paid subscription, they can use the tool
      if (subscription && subscription.plan_type !== 'free') {
        setCanUse(true);
        return;
      }

      // For free users, check if they've used their allocation
      if (toolType === 'bio_generator') {
        setCanUse(usageCount < 1);
      } else {
        setCanUse(false);
      }
    };

    checkAccess();
  }, [user, subscription, usageCount, toolType, isAdminUser]);

  if (loading || !user) return null;

  // Not logged in
  if (!user) {
    return (
      <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950 dark:border-amber-800 mb-6">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Lock className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-amber-800 dark:text-amber-200">Sign up required</h3>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                Create a free account to start generating content.
              </p>
              <Button size="sm" className="mt-3" onClick={() => window.location.href = '/signup'}>
                Sign Up Free
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show subscription status if user has access or is admin
  if (canUse || isAdminUser || (subscription && subscription.plan_type !== 'free')) {
    return (
      <SubscriptionStatus
        isAdminUser={isAdminUser}
        subscription={subscription}
        planName={planName}
        remainingTime={remainingTime}
        toolType={toolType}
        usageCount={usageCount}
        canUse={canUse}
      />
    );
  }

  // Show upgrade prompt with modal trigger
  const hasUsedFree = usageCount >= 1;
  if (hasUsedFree || toolType === 'cover_letter') {
    return (
      <>
        <Card className="border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800 mb-6">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <Sparkles className="h-6 w-6 text-red-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                  {toolType === 'cover_letter' ? 'Premium Feature' : 'Free Limit Reached'}
                </h3>
                <p className="text-red-700 dark:text-red-300 mb-4">
                  {toolType === 'cover_letter' 
                    ? 'The Cover Letter Generator is available to premium users only. Upgrade to create professional, AI-powered cover letters.'
                    : "You've used your free bio generation. Upgrade to continue creating unlimited professional bios."
                  }
                </p>
                <Button 
                  onClick={() => setShowPricingModal(true)}
                  className="bg-brand-purple hover:bg-brand-purple-dark text-white font-semibold"
                >
                  View Upgrade Options
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <PricingModal
          isOpen={showPricingModal}
          onClose={() => setShowPricingModal(false)}
          toolName={toolDisplayName}
        />
      </>
    );
  }

  return null;
};

export default UsageCounter;
