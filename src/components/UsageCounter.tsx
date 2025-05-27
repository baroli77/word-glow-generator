
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Clock, Infinity, Lock, Crown, Star } from 'lucide-react';
import { createClient } from '@/integrations/supabase/client';

interface UsageCounterProps {
  toolType: 'cover_letter' | 'bio_generator';
  toolDisplayName: string;
}

const UsageCounter: React.FC<UsageCounterProps> = ({ toolType, toolDisplayName }) => {
  const { user } = useAuth();
  const { subscription, usageCount, loading, getRemainingTime, getPlanDisplayName, isAdminUser } = useSubscription();
  const [canUse, setCanUse] = useState(false);
  const [upgradeLoading, setUpgradeLoading] = useState<string | null>(null);

  const remainingTime = getRemainingTime();
  const planName = getPlanDisplayName();
  const supabase = createClient();

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

  const handleUpgrade = async (planType: 'daily' | 'monthly' | 'lifetime') => {
    if (!user) return;
    
    setUpgradeLoading(planType);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { planType }
      });

      if (error) {
        console.error('Checkout error:', error);
        return;
      }

      if (data?.url) {
        // Open Stripe checkout in a new tab
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
    } finally {
      setUpgradeLoading(null);
    }
  };

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
                Create a free account to generate your first bio.
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

  // Admin users get unlimited access
  if (isAdminUser) {
    return (
      <Card className="border-purple-200 bg-purple-50 dark:bg-purple-950 dark:border-purple-800 mb-6">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Infinity className="h-5 w-5 text-purple-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-purple-800 dark:text-purple-200">
                Admin Access - Unlimited
              </h3>
              <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                You have unlimited access to all features as an administrator.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Has unlimited access (paid subscription)
  if (subscription && subscription.plan_type !== 'free') {
    return (
      <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800 mb-6">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Infinity className="h-5 w-5 text-green-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-green-800 dark:text-green-200">
                {planName} - Unlimited Access
              </h3>
              <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                Generate as many bios as you need!
                {remainingTime && subscription.plan_type === 'daily' && (
                  <span className="block mt-1 font-medium">
                    <Clock className="inline h-4 w-4 mr-1" />
                    {remainingTime}
                  </span>
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Free user - show usage and upgrade options
  const hasUsedFree = usageCount >= 1;

  if (hasUsedFree) {
    return (
      <div className="mb-8 space-y-6">
        {/* Limit Reached Alert */}
        <Card className="border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <Sparkles className="h-6 w-6 text-red-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                  Free Plan - Limit Reached
                </h3>
                <p className="text-red-700 dark:text-red-300 mb-4">
                  You've reached your free limit. Unlock all bio platforms and unlimited access by upgrading below.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upgrade Plans */}
        <div className="text-center">
          <h4 className="text-xl font-semibold mb-6 text-foreground">Choose Your Plan</h4>
          
          {/* Desktop: 3-column layout, Mobile: stacked */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            
            {/* 24-Hour Access */}
            <Card className="border-2 border-brand-purple/20 hover:border-brand-purple/40 transition-all duration-200 hover:shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <Clock className="h-8 w-8 text-brand-purple mx-auto mb-2" />
                  <h5 className="font-semibold text-lg">24-Hour Access</h5>
                </div>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-brand-purple">£9</span>
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  Unlimited bios for 24 hours
                </p>
                <Button 
                  className="w-full bg-brand-purple hover:bg-brand-purple-dark text-white font-semibold"
                  onClick={() => handleUpgrade('daily')}
                  disabled={upgradeLoading === 'daily'}
                >
                  {upgradeLoading === 'daily' ? 'Processing...' : 'Upgrade Now'}
                </Button>
              </CardContent>
            </Card>

            {/* Monthly Plan */}
            <Card className="border-2 border-brand-purple/20 hover:border-brand-purple/40 transition-all duration-200 hover:shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <Star className="h-8 w-8 text-brand-purple mx-auto mb-2" />
                  <h5 className="font-semibold text-lg">Monthly Plan</h5>
                </div>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-brand-purple">£29</span>
                  <span className="text-sm text-muted-foreground">/month</span>
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  Unlimited bios all month long
                </p>
                <Button 
                  className="w-full bg-brand-purple hover:bg-brand-purple-dark text-white font-semibold"
                  onClick={() => handleUpgrade('monthly')}
                  disabled={upgradeLoading === 'monthly'}
                >
                  {upgradeLoading === 'monthly' ? 'Processing...' : 'Upgrade Now'}
                </Button>
              </CardContent>
            </Card>

            {/* Lifetime Access */}
            <Card className="border-2 border-brand-purple/20 hover:border-brand-purple/40 transition-all duration-200 hover:shadow-lg relative">
              <CardContent className="p-6 text-center">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-brand-pink text-white px-3 py-1 rounded-full text-xs font-semibold">
                    BEST VALUE
                  </span>
                </div>
                <div className="mb-4 mt-2">
                  <Crown className="h-8 w-8 text-brand-purple mx-auto mb-2" />
                  <h5 className="font-semibold text-lg">Lifetime Access</h5>
                </div>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-brand-purple">£99</span>
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  Unlimited bios forever
                </p>
                <Button 
                  className="w-full bg-brand-purple hover:bg-brand-purple-dark text-white font-semibold"
                  onClick={() => handleUpgrade('lifetime')}
                  disabled={upgradeLoading === 'lifetime'}
                >
                  {upgradeLoading === 'lifetime' ? 'Processing...' : 'Upgrade Now'}
                </Button>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    );
  }

  // Free user with remaining usage
  return (
    <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800 mb-6">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <Sparkles className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-medium text-blue-800 dark:text-blue-200">
              Free Plan - {1 - usageCount} Bio Remaining
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              You have 1 free bio generation. Sign up for more access after using it.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UsageCounter;
