
import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Smartphone, Video, Heart } from 'lucide-react';
import { platformOptions } from './types';

const platformCategories = {
  professional: { 
    title: 'Professional', 
    icon: Briefcase,
    platforms: platformOptions.filter(p => p.category === 'professional') 
  },
  social: { 
    title: 'Social Media', 
    icon: Smartphone,
    platforms: platformOptions.filter(p => p.category === 'social') 
  },
  content: { 
    title: 'Content Creation', 
    icon: Video,
    platforms: platformOptions.filter(p => p.category === 'content') 
  },
  dating: { 
    title: 'Dating', 
    icon: Heart,
    platforms: platformOptions.filter(p => p.category === 'dating') 
  }
};

interface PlatformSelectorProps {
  selectedPlatform: string;
  onPlatformChange: (platform: string) => void;
}

const PlatformSelector: React.FC<PlatformSelectorProps> = ({
  selectedPlatform,
  onPlatformChange
}) => {
  return (
    <div className="animate-fade-in">
      <h3 className="text-lg font-medium mb-4">Choose your platform</h3>
      <div className="space-y-6">
        <div>
          <Label className="mb-4 block">Select the platform for your bio</Label>
          
          <Card className="border border-border bg-card">
            <CardContent className="p-6">
              {Object.entries(platformCategories).map(([categoryKey, category]) => (
                <div key={categoryKey} className="mb-8">
                  <h4 className="flex items-center gap-2 text-lg font-semibold mb-4 text-card-foreground">
                    <category.icon className="h-5 w-5" />
                    {category.title}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {category.platforms.map((option) => (
                      <div key={option.value} className="flex items-center">
                        <RadioGroup 
                          value={selectedPlatform} 
                          onValueChange={onPlatformChange}
                          className="flex"
                        >
                          <div className="flex items-center">
                            <RadioGroupItem 
                              value={option.value} 
                              id={`platform-${option.value}`} 
                              className="peer sr-only" 
                            />
                            <Label
                              htmlFor={`platform-${option.value}`}
                              className={`px-4 py-2 rounded-full border cursor-pointer transition-colors ${
                                selectedPlatform === option.value 
                                  ? "bg-wordcraft-purple text-white border-wordcraft-purple" 
                                  : "bg-background hover:bg-accent border-border text-foreground"
                              }`}
                            >
                              {option.label}
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PlatformSelector;
