
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Infinity, Clock, Sparkles, Lock, Crown } from 'lucide-react';

interface SubscriptionStatusProps {
  isAdminUser: boolean;
  subscription: any;
  planName: string;
  remainingTime: string | null;
  toolType: 'cover_letter' | 'bio_generator';
  usageCount: number;
  canUse: boolean;
}

const SubscriptionStatus: React.FC<SubscriptionStatusProps> = ({
  isAdminUser,
  subscription,
  planName,
  remainingTime,
  toolType,
  usageCount,
  canUse
}) => {
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
                Generate as many {toolType === 'bio_generator' ? 'bios' : 'cover letters'} as you need!
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

  // Free user with remaining usage
  if (canUse && toolType === 'bio_generator') {
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
  }

  return null;
};

export default SubscriptionStatus;
