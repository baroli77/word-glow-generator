
import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { bioTemplates, generateFromTemplate } from './utils/templates';
import { BioFormData } from './types';

interface TemplateSelectorProps {
  selectedTemplate: string;
  onTemplateChange: (template: string) => void;
  formData: BioFormData;
  onTemplateSelect: (bio: string) => void;
  onSkip: () => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  onTemplateChange,
  formData,
  onTemplateSelect,
  onSkip
}) => {
  const handleUseTemplate = () => {
    const template = bioTemplates.find(t => t.id === selectedTemplate);
    if (template) {
      const generatedBio = generateFromTemplate(template, formData);
      onTemplateSelect(generatedBio);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-2">Choose a Template Style</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Select a template that matches your desired tone and style
        </p>
      </div>

      <RadioGroup value={selectedTemplate} onValueChange={onTemplateChange}>
        <div className="grid gap-4">
          {bioTemplates.map((template) => (
            <Card key={template.id} className="p-4">
              <div className="flex items-start space-x-3">
                <RadioGroupItem 
                  value={template.id} 
                  id={template.id}
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label 
                    htmlFor={template.id}
                    className="text-base font-medium cursor-pointer"
                  >
                    {template.name}
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {template.category} - {template.platform}
                  </p>
                  <div className="mt-3 p-3 bg-muted/50 rounded-md">
                    <p className="text-sm italic">
                      "{template.example}"
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </RadioGroup>

      <div className="flex gap-4 pt-4">
        <Button variant="outline" onClick={onSkip}>
          Skip Templates
        </Button>
        <Button onClick={handleUseTemplate} disabled={!selectedTemplate}>
          Use This Template
        </Button>
      </div>

      <Card className="p-4 bg-card border border-border">
        <div className="flex items-start space-x-3">
          <div className="flex-1">
            <h4 className="font-medium text-sm">Quick Start Option</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Don't worry about choosing the perfect template now - you can always regenerate your bio with a different style later!
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TemplateSelector;
