
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CharacterLimitSettingsProps {
  charLimit: boolean;
  customCharCount: number;
  onCharLimitChange: (enabled: boolean) => void;
  onCharCountChange: (count: number) => void;
}

const charCountOptions = [
  { value: '80', label: '80 (TikTok)' },
  { value: '150', label: '150 (Instagram)' },
  { value: '200', label: '200 (Twitter)' },
  { value: 'custom', label: 'Custom' }
];

const CharacterLimitSettings: React.FC<CharacterLimitSettingsProps> = ({
  charLimit,
  customCharCount,
  onCharLimitChange,
  onCharCountChange
}) => {
  const isCustomValue = ![80, 150, 200].includes(customCharCount);

  const handlePresetChange = (value: string) => {
    if (value !== 'custom') {
      onCharCountChange(parseInt(value));
    }
  };

  const validateCharCount = (value: string) => {
    const num = parseInt(value);
    if (isNaN(num) || num < 1) return 1;
    if (num > 10000) return 10000;
    return num;
  };

  return (
    <div className="border-t pt-4">
      <div className="flex items-center justify-between mb-2">
        <Label htmlFor="charLimit" className="font-medium">Character Limit</Label>
        <Switch
          id="charLimit"
          checked={charLimit}
          onCheckedChange={onCharLimitChange}
          aria-describedby="char-limit-help"
        />
      </div>
      <p id="char-limit-help" className="text-sm text-muted-foreground mb-4">
        Enable to set a maximum character count for your bio
      </p>
      
      {charLimit && (
        <div className="mt-4 space-y-2">
          <Label htmlFor="charCountSelect">Character Count</Label>
          <div className="flex gap-4">
            <Select 
              value={isCustomValue ? 'custom' : customCharCount.toString()}
              onValueChange={handlePresetChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select limit" />
              </SelectTrigger>
              <SelectContent>
                {charCountOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {isCustomValue && (
              <Input
                type="number"
                value={customCharCount}
                onChange={(e) => onCharCountChange(validateCharCount(e.target.value))}
                placeholder="Custom character count"
                min="1"
                max="10000"
                className="w-[150px]"
                aria-label="Custom character count"
              />
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Character limits: TikTok (80), Instagram (150), Twitter (200). Max: 10,000 characters.
          </p>
        </div>
      )}
    </div>
  );
};

export default CharacterLimitSettings;
