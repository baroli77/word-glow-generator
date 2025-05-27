
import React from 'react';
import { Button } from "@/components/ui/button";
import PlatformSelector from '../PlatformSelector';

interface PlatformStepProps {
  selectedPlatform: string;
  onPlatformChange: (platform: string) => void;
  onNext: () => void;
}

const PlatformStep: React.FC<PlatformStepProps> = ({
  selectedPlatform,
  onPlatformChange,
  onNext
}) => {
  return (
    <div>
      <PlatformSelector
        selectedPlatform={selectedPlatform}
        onPlatformChange={onPlatformChange}
      />
      <div className="pt-4 flex justify-end">
        <Button onClick={onNext}>
          Continue
        </Button>
      </div>
    </div>
  );
};

export default PlatformStep;
