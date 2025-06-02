
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Sparkles, Infinity } from 'lucide-react';

interface AccessGuardProps {
  hasAccess: boolean;
  isLoading: boolean;
  isAdminUser: boolean;
  planType: string;
  usageCount: number;
  toolType: 'cover_letter' | 'bio_generator';
  toolDisplayName: string;
  onUpgrade: () => void;
  children: React.ReactNode;
}

const AccessGuard: React.FC<AccessGuardProps> = ({
  hasAccess,
  isLoading,
  isAdminUser,
  planType,
  usageCount,
  toolType,
  toolDisplayName,
  onUpgrade,
  children
}) => {
  if (isLoading) {
    return null;
  }

  // If user has access, render the protected content
  if (hasAccess) {
    return <>{children}</>;
  }

  // If no access, show appropriate upgrade prompt
  const hasUsedFree = usageCount >= 1;
  const isRestrictedTool = toolType === 'cover_letter';
  
  if (hasUsedFree || isRestrictedTool) {
    return (
      <Card className="border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800 mb-6">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <Sparkles className="h-6 w-6 text-red-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                {isRestrictedTool ? 'Premium Feature' : 'Free Limit Reached'}
              </h3>
              <p className="text-red-700 dark:text-red-300 mb-4">
                {isRestrictedTool 
                  ? `The ${toolDisplayName} is available to premium users only. Upgrade to create professional, AI-powered content.`
                  : `You've used your free ${toolDisplayName.toLowerCase()}. Upgrade to continue creating unlimited content.`
                }
              </p>
              <Button 
                onClick={onUpgrade}
                className="bg-brand-purple hover:bg-brand-purple-dark text-white font-semibold"
              >
                View Upgrade Options
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show sign up prompt if not authenticated
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
};

export default AccessGuard;
