
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Lock } from 'lucide-react';
import { platforms } from './config/platform-config';
import { PlatformCategory, PlatformType } from './types';
import { useSubscription } from '@/hooks/useSubscription';

interface PlatformCategoryGridProps {
  selectedPlatform: string;
  onPlatformChange: (platform: string) => void;
}

const categoryLabels: Record<PlatformCategory, string> = {
  professional: 'Professional',
  social: 'Social Media',
  content: 'Content Creation',
  dating: 'Dating'
};

const categoryDescriptions: Record<PlatformCategory, string> = {
  professional: 'Build your career and professional network',
  social: 'Connect with friends and share your life',
  content: 'Create and share engaging content',
  dating: 'Find meaningful connections and relationships'
};

const PlatformCategoryGrid: React.FC<PlatformCategoryGridProps> = ({
  selectedPlatform,
  onPlatformChange
}) => {
  const { subscription } = useSubscription();
  const isFreeUser = subscription?.plan_type === 'free';

  // Group platforms by category
  const platformsByCategory = platforms.reduce((acc, platform) => {
    const config = platform.id as PlatformType;
    // Map platform to category based on our config
    let category: PlatformCategory;
    
    if (['linkedin', 'resume', 'portfolio'].includes(platform.id)) {
      category = 'professional';
    } else if (['twitter', 'instagram', 'facebook', 'threads', 'snapchat'].includes(platform.id)) {
      category = 'social';
    } else if (['tiktok', 'youtube', 'twitch', 'pinterest', 'reddit'].includes(platform.id)) {
      category = 'content';
    } else {
      category = 'dating';
    }
    
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(platform);
    return acc;
  }, {} as Record<PlatformCategory, typeof platforms>);

  const categoryOrder: PlatformCategory[] = ['professional', 'social', 'content', 'dating'];

  const handlePlatformClick = (platform: any) => {
    if (isFreeUser && platform.isPremium) {
      // Don't allow selection of premium platforms for free users
      return;
    }
    onPlatformChange(platform.id);
  };

  return (
    <div className="space-y-8">
      {categoryOrder.map((category) => (
        <div key={category}>
          <div className="mb-4">
            <h4 className="text-lg font-semibold text-foreground">
              {categoryLabels[category]}
            </h4>
            <p className="text-sm text-muted-foreground mt-1">
              {categoryDescriptions[category]}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {platformsByCategory[category]?.map((platform) => {
              const isLocked = isFreeUser && platform.isPremium;
              const isSelected = selectedPlatform === platform.id;
              
              const cardContent = (
                <Card 
                  className={cn(
                    "cursor-pointer transition-all duration-200",
                    isLocked 
                      ? "opacity-60 cursor-not-allowed" 
                      : "hover:shadow-md",
                    isSelected && !isLocked
                      ? "ring-2 ring-primary bg-primary/5 border-primary" 
                      : !isLocked && "hover:border-primary/50"
                  )}
                  onClick={() => handlePlatformClick(platform)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center">
                        <platform.icon className={cn(
                          "w-5 h-5 mr-2",
                          isLocked ? "text-muted-foreground" : "text-primary"
                        )} />
                        <h5 className={cn(
                          "font-medium",
                          isLocked && "text-muted-foreground"
                        )}>
                          {platform.name}
                        </h5>
                        {isLocked && (
                          <Lock className="w-4 h-4 ml-2 text-muted-foreground" />
                        )}
                      </div>
                      {isSelected && !isLocked && (
                        <Badge variant="default" className="text-xs">
                          Selected
                        </Badge>
                      )}
                      {isLocked && (
                        <Badge variant="outline" className="text-xs">
                          Premium
                        </Badge>
                      )}
                    </div>
                    <p className={cn(
                      "text-sm mb-3",
                      isLocked ? "text-muted-foreground" : "text-muted-foreground"
                    )}>
                      {platform.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {platform.charLimit ? `${platform.charLimit} char limit` : 'No limit'}
                      </span>
                      <Button 
                        variant={isSelected && !isLocked ? "default" : "outline"}
                        size="sm"
                        disabled={isLocked}
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlatformClick(platform);
                        }}
                      >
                        {isLocked ? "Upgrade Required" : isSelected ? "Selected" : "Select"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );

              if (isLocked) {
                return (
                  <Tooltip key={platform.id}>
                    <TooltipTrigger asChild>
                      {cardContent}
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Upgrade to unlock this feature</p>
                    </TooltipContent>
                  </Tooltip>
                );
              }

              return <div key={platform.id}>{cardContent}</div>;
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlatformCategoryGrid;
