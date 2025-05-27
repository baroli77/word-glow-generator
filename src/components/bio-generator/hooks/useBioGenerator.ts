
import { useState } from 'react';
import { toast } from "@/components/ui/use-toast";
import { generateBio, simulateBioGeneration } from '../../../services/bioService';
import { validateBioForm, ValidationError } from '../utils/validation';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/context/AuthContext';
import { isPremiumPlatform } from '../config/platform-config';
import { BioFormData, PlatformType } from '../types';

export const useBioGenerator = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [generatedBio, setGeneratedBio] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const { user } = useAuth();
  const { canUseTool, recordUsage, refetch, subscription, usageCount } = useSubscription();
  
  const isFreeUser = subscription?.plan_type === 'free';

  const handleNext = (formData: BioFormData) => {
    if (step === 1) {
      // Check if selected platform is premium and user is free
      if (isFreeUser && isPremiumPlatform(formData.platform as PlatformType)) {
        return { shouldShowPricing: true };
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
        return { shouldShowPricing: false };
      }
    }
    setStep(prev => prev + 1);
    return { shouldShowPricing: false };
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
  };
  
  const handleGenerate = async (formData: BioFormData) => {
    // Check if selected platform is premium and user is free
    if (isFreeUser && isPremiumPlatform(formData.platform as PlatformType)) {
      return { shouldShowPricing: true };
    }

    // Check if user can use the tool
    const hasAccess = await canUseTool('bio_generator');
    if (!hasAccess) {
      return { shouldShowPricing: true };
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
      return { shouldShowPricing: false };
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

    return { shouldShowPricing: false };
  };
  
  const handleRegenerate = async (formData: BioFormData) => {
    // Check if user can use the tool
    const hasAccess = await canUseTool('bio_generator');
    if (!hasAccess) {
      return { shouldShowPricing: true };
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

    return { shouldShowPricing: false };
  };

  const handleStartOver = () => {
    setStep(1);
    setGeneratedBio('');
    setValidationErrors([]);
    setShowTemplates(false);
  };

  const handleFieldChange = (field: string, value: string) => {
    // Clear validation error for this field when user starts typing
    setValidationErrors(prev => prev.filter(error => error.field !== field));
  };

  return {
    step,
    loading,
    generatedBio,
    validationErrors,
    showTemplates,
    selectedTemplate,
    isFreeUser,
    usageCount,
    setStep,
    setGeneratedBio,
    setShowTemplates,
    setSelectedTemplate,
    handleNext,
    handleBack,
    handleTemplateUse,
    handleSkipTemplates,
    handleGenerate,
    handleRegenerate,
    handleStartOver,
    handleFieldChange,
    refetch
  };
};
