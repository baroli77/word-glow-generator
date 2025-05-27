
import React from 'react';
import PlatformCategoryGrid from './PlatformCategoryGrid';

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
      <h3 className="text-lg font-medium mb-6">Choose your platform</h3>
      <PlatformCategoryGrid
        selectedPlatform={selectedPlatform}
        onPlatformChange={onPlatformChange}
      />
    </div>
  );
};

export default PlatformSelector;
