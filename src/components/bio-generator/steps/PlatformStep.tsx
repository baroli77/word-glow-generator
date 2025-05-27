
import React from 'react';
import { Button } from "@/components/ui/button";
import PlatformSelector from '../PlatformSelector';

interface PlatformStepProps {
  selectedPlatform: string;
  onPlatformChange: (platform: string) => void;
  onNext: () => void;
  onShowPricing?: () => void;
}

const PlatformStep: React.FC<PlatformStepProps> = ({
  selectedPlatform,
  onPlatformChange,
  onNext,
  onShowPricing
}) => {
  return (
    <div>
      <PlatformSelector
        selectedPlatform={selectedPlatform}
        onPlatformChange={onPlatformChange}
        onShowPricing={onShowPricing}
      />
      <div className="pt-4 flex justify-end">
        <Button 
          onClick={onNext}
          disabled={!selectedPlatform}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default PlatformStep;
