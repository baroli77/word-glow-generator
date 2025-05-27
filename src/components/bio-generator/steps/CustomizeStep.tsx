
import React from 'react';
import { Button } from "@/components/ui/button";
import { Sparkles } from 'lucide-react';
import ToneSelector from '../ToneSelector';
import CharacterLimitSettings from '../CharacterLimitSettings';
import TemplateSelector from '../TemplateSelector';
import { BioFormData } from '../types';

interface CustomizeStepProps {
  formData: BioFormData;
  onFieldChange: (field: string, value: string | boolean | number) => void;
  showTemplates: boolean;
  selectedTemplate: string;
  onTemplateChange: (template: string) => void;
  onShowTemplates: () => void;
  onTemplateSelect: (bio: string) => void;
  onSkipTemplates: () => void;
  onBack: () => void;
  onGenerate: () => void;
  loading: boolean;
}

const CustomizeStep: React.FC<CustomizeStepProps> = ({
  formData,
  onFieldChange,
  showTemplates,
  selectedTemplate,
  onTemplateChange,
  onShowTemplates,
  onTemplateSelect,
  onSkipTemplates,
  onBack,
  onGenerate,
  loading
}) => {
  if (showTemplates) {
    return (
      <TemplateSelector
        selectedTemplate={selectedTemplate}
        onTemplateChange={onTemplateChange}
        formData={formData}
        onTemplateSelect={onTemplateSelect}
        onSkip={onSkipTemplates}
      />
    );
  }

  return (
    <div className="animate-fade-in">
      <h3 className="text-lg font-medium mb-4">Customize your bio</h3>
      <div className="space-y-6">
        <div className="bg-muted/50 border border-border rounded-lg p-4">
          <h4 className="font-medium mb-2">💡 Quick Start Option</h4>
          <p className="text-muted-foreground text-sm mb-3">
            Want to get started quickly? Try our pre-made templates!
          </p>
          <Button 
            onClick={onShowTemplates}
            variant="outline"
            size="sm"
          >
            Browse Templates
          </Button>
        </div>
        
        <ToneSelector
          selectedTone={formData.tone}
          onToneChange={(tone) => onFieldChange('tone', tone)}
        />
        
        <CharacterLimitSettings
          charLimit={formData.charLimit}
          customCharCount={formData.customCharCount}
          onCharLimitChange={(enabled) => onFieldChange('charLimit', enabled)}
          onCharCountChange={(count) => onFieldChange('customCharCount', count)}
        />
        
        <div className="pt-4 flex justify-between">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button onClick={onGenerate} disabled={loading}>
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Generating...
              </div>
            ) : (
              <div className="flex items-center">
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Bio
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomizeStep;
