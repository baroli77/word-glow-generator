
import React from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BioPreview from '../BioPreview';
import BioEditor from '../BioEditor';
import { BioFormData } from '../types';

interface PreviewStepProps {
  generatedBio: string;
  formData: BioFormData;
  loading: boolean;
  onBioChange: (bio: string) => void;
  onRegenerate: () => void;
  onBackToSettings: () => void;
  onStartOver: () => void;
}

const PreviewStep: React.FC<PreviewStepProps> = ({
  generatedBio,
  formData,
  loading,
  onBioChange,
  onRegenerate,
  onBackToSettings,
  onStartOver
}) => {
  return (
    <div>
      <Tabs defaultValue="preview">
        <TabsList className="mb-4">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="edit">Edit</TabsTrigger>
        </TabsList>
        
        <TabsContent value="preview">
          <BioPreview
            bio={generatedBio}
            charLimit={formData.charLimit}
            customCharCount={formData.customCharCount}
            loading={loading}
            onRegenerate={onRegenerate}
            formData={formData}
          />
        </TabsContent>
        
        <TabsContent value="edit">
          <BioEditor
            bio={generatedBio}
            charLimit={formData.charLimit}
            customCharCount={formData.customCharCount}
            onBioChange={onBioChange}
          />
        </TabsContent>
      </Tabs>
      
      <div className="pt-8 flex justify-between">
        <Button variant="outline" onClick={onBackToSettings}>
          Back to Settings
        </Button>
        <Button onClick={onStartOver}>
          Create Another Bio
        </Button>
      </div>
    </div>
  );
};

export default PreviewStep;
