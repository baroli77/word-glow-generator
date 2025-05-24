
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

// Import new components
import PlatformSelector from './bio-generator/PlatformSelector';
import FormFieldsRenderer from './bio-generator/FormFieldsRenderer';
import ToneSelector from './bio-generator/ToneSelector';
import CharacterLimitSettings from './bio-generator/CharacterLimitSettings';
import BioPreview from './bio-generator/BioPreview';
import BioEditor from './bio-generator/BioEditor';
import { useBioForm } from './bio-generator/hooks/useBioForm';
import { generateBio, simulateBioGeneration } from '../services/bioService';

const BioGeneratorForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [generatedBio, setGeneratedBio] = useState('');
  const { formData, updateField, updatePlatform, resetForm } = useBioForm();
  
  const handleNext = () => {
    setStep(prev => prev + 1);
  };
  
  const handleBack = () => {
    setStep(prev => prev - 1);
  };
  
  const handleGenerate = async () => {
    // Validation
    if (!formData.name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name to generate a bio.",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.profession.trim()) {
      toast({
        title: "Profession Required",
        description: "Please enter your profession or what you do.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await generateBio(formData);
      
      if (response.error) {
        // Fallback to simulation if AI generation fails
        const fallbackBio = simulateBioGeneration(formData);
        setGeneratedBio(fallbackBio);
        toast({
          title: "Using Fallback Generation",
          description: "AI generation failed, using template-based generation.",
        });
      } else {
        setGeneratedBio(response.content);
      }
      
      setStep(4);
    } catch (error) {
      console.error("Error in bio generation:", error);
      const fallbackBio = simulateBioGeneration(formData);
      setGeneratedBio(fallbackBio);
      setStep(4);
    } finally {
      setLoading(false);
    }
  };
  
  const handleRegenerate = async () => {
    setLoading(true);
    
    try {
      // Add variation prompt for regeneration
      const response = await generateBio({
        ...formData,
        // Add some randomness for variation
        tone: formData.tone
      });
      
      if (response.error) {
        const fallbackBio = simulateBioGeneration(formData);
        setGeneratedBio(fallbackBio);
      } else {
        setGeneratedBio(response.content);
      }
    } catch (error) {
      console.error("Error regenerating bio:", error);
      const fallbackBio = simulateBioGeneration(formData);
      setGeneratedBio(fallbackBio);
    } finally {
      setLoading(false);
    }
  };

  const handleStartOver = () => {
    setStep(1);
    setGeneratedBio('');
    resetForm();
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-serif text-2xl font-bold">Create Your Bio</h2>
          <div className="text-sm text-muted-foreground">
            Step {step} of 4
          </div>
        </div>
        
        <div className="w-full bg-muted h-2 rounded-full mb-8">
          <div 
            className="bg-gradient-to-r from-wordcraft-purple to-wordcraft-pink h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          ></div>
        </div>
      </div>
      
      {step === 1 && (
        <div>
          <PlatformSelector
            selectedPlatform={formData.platform}
            onPlatformChange={updatePlatform}
          />
          <div className="pt-4 flex justify-end">
            <Button onClick={handleNext}>
              Continue
            </Button>
          </div>
        </div>
      )}
      
      {step === 2 && (
        <div>
          <FormFieldsRenderer
            formData={formData}
            onFieldChange={updateField}
          />
          <div className="pt-4 flex justify-between">
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
            <Button onClick={handleNext}>
              Continue
            </Button>
          </div>
        </div>
      )}
      
      {step === 3 && (
        <div className="animate-fade-in">
          <h3 className="text-lg font-medium mb-4">Customize your bio</h3>
          <div className="space-y-6">
            <ToneSelector
              selectedTone={formData.tone}
              onToneChange={(tone) => updateField('tone', tone)}
            />
            
            <CharacterLimitSettings
              charLimit={formData.charLimit}
              customCharCount={formData.customCharCount}
              onCharLimitChange={(enabled) => updateField('charLimit', enabled)}
              onCharCountChange={(count) => updateField('customCharCount', count)}
            />
            
            <div className="pt-4 flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleGenerate} disabled={loading}>
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
      )}
      
      {step === 4 && (
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
                onRegenerate={handleRegenerate}
              />
            </TabsContent>
            
            <TabsContent value="edit">
              <BioEditor
                bio={generatedBio}
                charLimit={formData.charLimit}
                customCharCount={formData.customCharCount}
                onBioChange={setGeneratedBio}
              />
            </TabsContent>
          </Tabs>
          
          <div className="mt-8 pt-6 border-t">
            <h4 className="font-medium mb-4">Save this bio</h4>
            <div className="flex items-center gap-4">
              <Input placeholder="Give this bio a name (e.g. LinkedIn Professional)" />
              <Button>Save</Button>
            </div>
          </div>
          
          <div className="pt-8 flex justify-between">
            <Button variant="outline" onClick={() => setStep(3)}>
              Back to Settings
            </Button>
            <Button onClick={handleStartOver}>
              Create Another Bio
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BioGeneratorForm;
