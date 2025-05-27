
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { platforms } from './config/platform-config';

interface PlatformSelectorProps {
  selectedPlatform: string;
  onPlatformChange: (platform: string) => void;
}

const PlatformSelector: React.FC<PlatformSelectorProps> = ({
  selectedPlatform,
  onPlatformChange
}) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Choose your platform</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {platforms.map((platform) => (
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
                  <h4 className="font-medium">{platform.name}</h4>
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
  );
};

export default PlatformSelector;
