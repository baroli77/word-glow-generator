
import React from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ToneSelectorProps {
  selectedTone: string;
  onToneChange: (tone: string) => void;
  disabled?: boolean;
}

const tones = [
  { value: 'professional', label: 'Professional', description: 'Formal and business-appropriate' },
  { value: 'casual', label: 'Casual', description: 'Relaxed and friendly' },
  { value: 'creative', label: 'Creative', description: 'Unique and expressive' },
  { value: 'confident', label: 'Confident', description: 'Bold and assertive' },
  { value: 'friendly', label: 'Friendly', description: 'Warm and approachable' },
  { value: 'funny', label: 'Funny', description: 'Humorous and entertaining' }
];

const ToneSelector: React.FC<ToneSelectorProps> = ({
  selectedTone,
  onToneChange,
  disabled = false
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium mb-2">Choose your tone</h4>
        <p className="text-sm text-muted-foreground">
          Select the writing style that best fits your personality
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {tones.map((tone) => (
          <Button
            key={tone.value}
            variant={selectedTone === tone.value ? "default" : "outline"}
            className={cn(
              "h-auto p-4 flex flex-col items-start text-left transition-all duration-200",
              selectedTone === tone.value 
                ? "ring-2 ring-primary bg-primary text-primary-foreground" 
                : "hover:border-primary/50"
            )}
            onClick={() => onToneChange(tone.value)}
            disabled={disabled}
          >
            <span className="font-medium">{tone.label}</span>
            <span className={cn(
              "text-xs mt-1",
              selectedTone === tone.value 
                ? "text-primary-foreground/80" 
                : "text-muted-foreground"
            )}>
              {tone.description}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ToneSelector;
