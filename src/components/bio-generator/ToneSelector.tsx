
import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toneOptions } from './types';

interface ToneSelectorProps {
  selectedTone: string;
  onToneChange: (tone: string) => void;
}

const ToneSelector: React.FC<ToneSelectorProps> = ({
  selectedTone,
  onToneChange
}) => {
  return (
    <div>
      <Label className="mb-2 block">Tone</Label>
      <RadioGroup 
        value={selectedTone} 
        onValueChange={onToneChange}
        className="flex flex-wrap gap-4"
      >
        {toneOptions.map((option) => (
          <div key={option.value} className="flex items-center">
            <RadioGroupItem 
              value={option.value} 
              id={`tone-${option.value}`} 
              className="peer sr-only" 
            />
            <Label
              htmlFor={`tone-${option.value}`}
              className="px-4 py-2 rounded-full border cursor-pointer bg-background hover:bg-muted peer-data-[state=checked]:bg-wordcraft-purple peer-data-[state=checked]:text-white"
            >
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default ToneSelector;
