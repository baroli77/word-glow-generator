
import React from 'react';
import PlatformCategoryGrid from './PlatformCategoryGrid';

interface PlatformSelectorProps {
  selectedPlatform: string;
  onPlatformChange: (platform: string) => void;
  onShowPricing?: () => void;
}

const PlatformSelector: React.FC<PlatformSelectorProps> = ({
  selectedPlatform,
  onPlatformChange,
  onShowPricing
}) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-6">Choose your platform</h3>
      <PlatformCategoryGrid
        selectedPlatform={selectedPlatform}
        onPlatformChange={onPlatformChange}
        onShowPricing={onShowPricing}
      />
    </div>
  );
};

export default PlatformSelector;
