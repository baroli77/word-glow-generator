import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Lock } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import PricingModal from './PricingModal';

// Import components
import PlatformSelector from './bio-generator/PlatformSelector';
import FormFieldsRenderer from './bio-generator/FormFieldsRenderer';
import ToneSelector from './bio-generator/ToneSelector';
import CharacterLimitSettings from './bio-generator/CharacterLimitSettings';
import BioPreview from './bio-generator/BioPreview';
import BioEditor from './bio-generator/BioEditor';
import TemplateSelector from './bio-generator/TemplateSelector';
import { useBioForm } from './bio-generator/hooks/useBioForm';
import { generateBio, simulateBioGeneration } from '../services/bioService';
import { validateBioForm, ValidationError } from './bio-generator/utils/validation';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/context/AuthContext';
import { isPremiumPlatform, Platform } from './bio-generator/config/platform-config';

const BioGeneratorForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [generatedBio, setGeneratedBio] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const { formData, updateField, updatePlatform, resetForm } = useBioForm();
  const { user } = useAuth();
  const { canUseTool, recordUsage, refetch, subscription } = useSubscription();
  
  const isFreeUser = subscription?.plan_type === 'free';
  
  const handleNext = () => {
    if (step === 1) {
      // Check if selected platform is premium and user is free
      if (isFreeUser && isPremiumPlatform(formData.platform as Platform)) {
        setShowPricingModal(true);
        return;
      }
    }
    
    if (step === 2) {
      // Validate form before proceeding
      const validation = validateBioForm(formData);
      setValidationErrors(validation.errors);
      
      if (!validation.isValid) {
        toast({
          title: "Please fix the errors",
          description: "Some fields need your attention before continuing.",
          variant: "destructive",
        });
        return;
      }
    }
    setStep(prev => prev + 1);
  };
  
  const handleBack = () => {
    setStep(prev => prev - 1);
    setValidationErrors([]); // Clear errors when going back
  };
  
  const handleTemplateUse = (bio: string) => {
    setGeneratedBio(bio);
    setStep(4); // Go directly to preview
  };

  const handleSkipTemplates = () => {
    setShowTemplates(false);
    // Continue to tone/settings step
  };
  
  const handleGenerate = async () => {
    // Check if selected platform is premium and user is free
    if (isFreeUser && isPremiumPlatform(formData.platform as Platform)) {
      setShowPricingModal(true);
      return;
    }

    // Check if user can use the tool
    const hasAccess = await canUseTool('bio_generator');
    if (!hasAccess) {
      setShowPricingModal(true);
      return;
    }

    // Final validation
    const validation = validateBioForm(formData);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      toast({
        title: "Please fix the errors",
        description: "Some fields need your attention before generating.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await generateBio(formData);
      
      if (response.error) {
        const fallbackBio = simulateBioGeneration(formData);
        setGeneratedBio(fallbackBio);
        toast({
          title: "Using Fallback Generation",
          description: "AI generation failed, using template-based generation.",
        });
      } else {
        setGeneratedBio(response.content);
      }

      // Record usage after successful generation
      await recordUsage('bio_generator');
      
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
    // Check if user can use the tool
    const hasAccess = await canUseTool('bio_generator');
    if (!hasAccess) {
      setShowPricingModal(true);
      return;
    }

    setLoading(true);
    
    try {
      const response = await generateBio({
        ...formData,
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
    setValidationErrors([]);
    setShowTemplates(false);
    resetForm();
  };

  const handleFieldChange = (field: string, value: string) => {
    updateField(field, value);
    // Clear validation error for this field when user starts typing
    setValidationErrors(prev => prev.filter(error => error.field !== field));
  };

  const handleUpgradeComplete = () => {
    refetch(); // Refresh subscription data
    setShowPricingModal(false);
  };

  const handlePlatformChange = (platform: string) => {
    // Check if platform is premium and user is free
    if (isFreeUser && isPremiumPlatform(platform as Platform)) {
      setShowPricingModal(true);
      return;
    }
    updatePlatform(platform);
  };

  // Show premium upgrade prompt if free user tries to access premium platform
  if (step === 1 && isFreeUser && isPremiumPlatform(formData.platform as Platform)) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="text-center py-12">
          <Lock className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">Premium Feature</h3>
          <p className="text-muted-foreground mb-6">
            {formData.platform} bios are available to premium users only.
          </p>
          <Button onClick={() => setShowPricingModal(true)}>
            Upgrade to Continue
          </Button>
        </div>
        
        <PricingModal
          isOpen={showPricingModal}
          onClose={() => setShowPricingModal(false)}
          toolName="Bio Generator"
          onUpgradeComplete={handleUpgradeComplete}
        />
      </div>
    );
  }

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
            onPlatformChange={handlePlatformChange}
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
            onFieldChange={handleFieldChange}
            errors={validationErrors}
          />
          <div className="pt-6 flex justify-between">
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
            <Button onClick={handleNext}>
              Continue
            </Button>
          </div>
        </div>
      )}
      
      {step === 3 && !showTemplates && (
        <div className="animate-fade-in">
          <h3 className="text-lg font-medium mb-4">Customize your bio</h3>
          <div className="space-y-6">
            <div className="bg-muted/50 border border-border rounded-lg p-4">
              <h4 className="font-medium mb-2">💡 Quick Start Option</h4>
              <p className="text-muted-foreground text-sm mb-3">
                Want to get started quickly? Try our pre-made templates!
              </p>
              <Button 
                onClick={() => setShowTemplates(true)}
                variant="outline"
                size="sm"
              >
                Browse Templates
              </Button>
            </div>
            
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

      {step === 3 && showTemplates && (
        <TemplateSelector
          selectedTemplate={selectedTemplate}
          onTemplateChange={setSelectedTemplate}
          formData={formData}
          onTemplateSelect={handleTemplateUse}
          onSkip={handleSkipTemplates}
        />
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
                formData={formData}
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

      <PricingModal
        isOpen={showPricingModal}
        onClose={() => setShowPricingModal(false)}
        toolName="Bio Generator"
        onUpgradeComplete={handleUpgradeComplete}
      />
    </div>
  );
};

export default BioGeneratorForm;
