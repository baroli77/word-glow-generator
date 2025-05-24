
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from 'lucide-react';
import { BioTemplate, getTemplatesForPlatform, generateFromTemplate } from './utils/templates';
import { BioFormData } from './types';

interface TemplateSelectorProps {
  formData: BioFormData;
  onTemplateSelect: (bio: string) => void;
  onSkip: () => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  formData,
  onTemplateSelect,
  onSkip
}) => {
  const templates = getTemplatesForPlatform(formData.platform);

  const handleTemplateSelect = (template: BioTemplate) => {
    const generatedBio = generateFromTemplate(template, formData);
    onTemplateSelect(generatedBio);
  };

  if (templates.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">No templates available for this platform yet.</p>
        <Button onClick={onSkip}>Continue with AI Generation</Button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium mb-2">Choose a Starting Template</h3>
        <p className="text-muted-foreground">
          Select a template to get started, or skip to use AI generation
        </p>
      </div>

      <div className="grid gap-4 mb-6">
        {templates.map((template) => (
          <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{template.name}</CardTitle>
              <CardDescription className="text-sm">
                Perfect for {template.category.toLowerCase()} profiles
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="bg-muted p-3 rounded text-sm mb-3 font-mono">
                {template.example}
              </div>
              <Button 
                onClick={() => handleTemplateSelect(template)}
                className="w-full"
                variant="outline"
              >
                Use This Template
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button onClick={onSkip} variant="outline">
          <Sparkles className="w-4 h-4 mr-2" />
          Skip Templates - Use AI Generation
        </Button>
      </div>
    </div>
  );
};

export default TemplateSelector;
