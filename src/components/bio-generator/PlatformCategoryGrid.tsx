
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { platforms } from './config/platform-config';
import { PlatformCategory, PlatformType } from './types';

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
            {platformsByCategory[category]?.map((platform) => (
              <Card 
                key={platform.id} 
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:shadow-md",
                  selectedPlatform === platform.id 
                    ? "ring-2 ring-primary bg-primary/5 border-primary" 
                    : "hover:border-primary/50"
                )}
                onClick={() => onPlatformChange(platform.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center">
                      <platform.icon className="w-5 h-5 mr-2 text-primary" />
                      <h5 className="font-medium">{platform.name}</h5>
                    </div>
                    {selectedPlatform === platform.id && (
                      <Badge variant="default" className="text-xs">
                        Selected
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {platform.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {platform.charLimit ? `${platform.charLimit} char limit` : 'No limit'}
                    </span>
                    <Button 
                      variant={selectedPlatform === platform.id ? "default" : "outline"}
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onPlatformChange(platform.id);
                      }}
                    >
                      {selectedPlatform === platform.id ? "Selected" : "Select"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlatformCategoryGrid;
