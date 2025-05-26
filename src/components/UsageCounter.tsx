
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Clock, Infinity, Lock } from 'lucide-react';

interface UsageCounterProps {
  toolType: 'cover_letter' | 'bio_generator';
  toolDisplayName: string;
}

const UsageCounter: React.FC<UsageCounterProps> = ({ toolType, toolDisplayName }) => {
  const { user } = useAuth();
  const { subscription, usageCount, loading, getRemainingTime, getPlanDisplayName } = useSubscription();
  const [canUse, setCanUse] = useState(false);

  const remainingTime = getRemainingTime();
  const planName = getPlanDisplayName();

  // Determine if user can use the tool
  useEffect(() => {
    const checkAccess = () => {
      if (!user) {
        setCanUse(false);
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
  }, [user, subscription, usageCount, toolType]);

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

  // Has unlimited access
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

  return (
    <Card className={`border mb-6 ${hasUsedFree ? 'border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800' : 'border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800'}`}>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <Sparkles className={`h-5 w-5 mt-0.5 ${hasUsedFree ? 'text-red-600' : 'text-blue-600'}`} />
            <div className="flex-1">
              <h3 className={`font-medium ${hasUsedFree ? 'text-red-800 dark:text-red-200' : 'text-blue-800 dark:text-blue-200'}`}>
                Free Plan - {hasUsedFree ? 'Limit Reached' : `${1 - usageCount} Bio Remaining`}
              </h3>
              <p className={`text-sm mt-1 ${hasUsedFree ? 'text-red-700 dark:text-red-300' : 'text-blue-700 dark:text-blue-300'}`}>
                {hasUsedFree 
                  ? 'You\'ve used your free bio generation. Upgrade to create more bios.'
                  : 'You have 1 free bio generation. Sign up for more access after using it.'
                }
              </p>
            </div>
          </div>

          {hasUsedFree && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-red-800 dark:text-red-200">Choose an upgrade option:</p>
              <div className="flex flex-wrap gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => window.location.href = '/pricing'}
                  className="text-xs"
                >
                  £9 - 24h Access
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => window.location.href = '/pricing'}
                  className="text-xs"
                >
                  £29/mo - Monthly
                </Button>
                <Button 
                  size="sm"
                  onClick={() => window.location.href = '/pricing'}
                  className="text-xs bg-wordcraft-purple hover:bg-wordcraft-purple/90"
                >
                  £99 - Lifetime
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UsageCounter;
