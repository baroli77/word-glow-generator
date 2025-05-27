
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Star, Crown, Sparkles } from 'lucide-react';
import { useUpgrade } from '@/hooks/useUpgrade';

interface UpgradePlansProps {
  toolType: 'cover_letter' | 'bio_generator';
  hasUsedFree: boolean;
}

const UpgradePlans: React.FC<UpgradePlansProps> = ({ toolType, hasUsedFree }) => {
  const { handleUpgrade, isLoading } = useUpgrade();

  return (
    <div className="mb-8 space-y-6">
      {/* Limit Reached Alert */}
      <Card className="border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <Sparkles className="h-6 w-6 text-red-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                {toolType === 'cover_letter' ? 'Premium Feature' : 'Free Plan - Limit Reached'}
              </h3>
              <p className="text-red-700 dark:text-red-300 mb-4">
                {toolType === 'cover_letter' 
                  ? 'The Cover Letter Generator is available to premium users only. Upgrade to create professional, AI-powered cover letters.'
                  : "You've reached your free limit. Unlock all bio platforms and unlimited access by upgrading below."
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Plans */}
      <div className="text-center">
        <h4 className="text-xl font-semibold mb-6 text-foreground">Choose Your Plan</h4>
        
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
                Unlimited {toolType === 'bio_generator' ? 'bios' : 'cover letters'} for 24 hours
              </p>
              <Button 
                className="w-full bg-brand-purple hover:bg-brand-purple-dark text-white font-semibold"
                onClick={() => handleUpgrade('daily')}
                disabled={isLoading('daily')}
              >
                {isLoading('daily') ? 'Processing...' : 'Upgrade Now'}
              </Button>
            </CardContent>
          </Card>

          {/* Monthly Plan */}
          <Card className="border-2 border-brand-purple shadow-lg shadow-brand-purple/20 scale-105 relative">
            <CardContent className="p-6 text-center">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-brand-pink text-white px-3 py-1 rounded-full text-xs font-semibold">
                  MOST POPULAR
                </span>
              </div>
              <div className="mb-4 mt-2">
                <Star className="h-8 w-8 text-brand-purple mx-auto mb-2" />
                <h5 className="font-semibold text-lg">Monthly Plan</h5>
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold text-brand-purple">£29</span>
                <span className="text-sm text-muted-foreground">/month</span>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                Unlimited {toolType === 'bio_generator' ? 'bios' : 'cover letters'} all month long
              </p>
              <Button 
                className="w-full bg-brand-purple hover:bg-brand-purple-dark text-white font-semibold"
                onClick={() => handleUpgrade('monthly')}
                disabled={isLoading('monthly')}
              >
                {isLoading('monthly') ? 'Processing...' : 'Upgrade Now'}
              </Button>
            </CardContent>
          </Card>

          {/* Lifetime Access */}
          <Card className="border-2 border-brand-purple/20 hover:border-brand-purple/40 transition-all duration-200 hover:shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="mb-4">
                <Crown className="h-8 w-8 text-brand-purple mx-auto mb-2" />
                <h5 className="font-semibold text-lg">Lifetime Access</h5>
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold text-brand-purple">£99</span>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                Unlimited {toolType === 'bio_generator' ? 'bios' : 'cover letters'} forever
              </p>
              <Button 
                className="w-full bg-brand-purple hover:bg-brand-purple-dark text-white font-semibold"
                onClick={() => handleUpgrade('lifetime')}
                disabled={isLoading('lifetime')}
              >
                {isLoading('lifetime') ? 'Processing...' : 'Upgrade Now'}
              </Button>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default UpgradePlans;
