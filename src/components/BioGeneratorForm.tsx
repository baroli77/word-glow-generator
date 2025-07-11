
import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import PricingModal from './PricingModal';
import StepIndicator from './bio-generator/StepIndicator';
import PlatformStep from './bio-generator/steps/PlatformStep';
import FormStep from './bio-generator/steps/FormStep';
import CustomizeStep from './bio-generator/steps/CustomizeStep';
import PreviewStep from './bio-generator/steps/PreviewStep';
import { useBioForm } from './bio-generator/hooks/useBioForm';
import { useBioGenerator } from './bio-generator/hooks/useBioGenerator';
import { isPremiumPlatform } from './bio-generator/config/platform-config';
import { PlatformType } from './bio-generator/types';

const BioGeneratorForm: React.FC = () => {
  const [showPricingModal, setShowPricingModal] = useState(false);
  const { formData, updateField, updatePlatform, resetForm } = useBioForm();
  const {
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
  } = useBioGenerator();

  const handleUpgradeComplete = () => {
    refetch(); // Refresh subscription data
    setShowPricingModal(false);
  };

  const handlePlatformChange = (platform: string) => {
    // Cast platform to PlatformType since we know it's valid from the selector
    const platformType = platform as PlatformType;
    
    // Check if platform is premium and user is free
    if (isFreeUser && isPremiumPlatform(platformType)) {
      setShowPricingModal(true);
      return;
    }
    updatePlatform(platformType);
  };

  const handleNextStep = () => {
    const result = handleNext(formData);
    if (result.shouldShowPricing) {
      setShowPricingModal(true);
    }
  };

  const handleGenerateBio = async () => {
    const result = await handleGenerate(formData);
    if (result.shouldShowPricing) {
      setShowPricingModal(true);
    }
  };

  const handleRegenerateBio = async () => {
    const result = await handleRegenerate(formData);
    if (result.shouldShowPricing) {
      setShowPricingModal(true);
    }
  };

  const handleFieldChangeWrapper = (field: string, value: string) => {
    updateField(field, value);
    handleFieldChange(field, value);
  };

  const handleStartOverWrapper = () => {
    handleStartOver();
    resetForm();
  };

  return (
    <div className="max-w-3xl mx-auto">
      <StepIndicator currentStep={step} totalSteps={4} />
      
      {step === 1 && (
        <PlatformStep
          selectedPlatform={formData.platform}
          onPlatformChange={handlePlatformChange}
          onNext={handleNextStep}
        />
      )}
      
      {step === 2 && (
        <FormStep
          formData={formData}
          onFieldChange={handleFieldChangeWrapper}
          errors={validationErrors}
          onBack={handleBack}
          onNext={handleNextStep}
        />
      )}
      
      {step === 3 && (
        <CustomizeStep
          formData={formData}
          onFieldChange={updateField}
          showTemplates={showTemplates}
          selectedTemplate={selectedTemplate}
          onTemplateChange={setSelectedTemplate}
          onShowTemplates={() => setShowTemplates(true)}
          onTemplateSelect={handleTemplateUse}
          onSkipTemplates={handleSkipTemplates}
          onBack={handleBack}
          onGenerate={handleGenerateBio}
          loading={loading}
        />
      )}
      
      {step === 4 && (
        <PreviewStep
          generatedBio={generatedBio}
          formData={formData}
          loading={loading}
          onBioChange={setGeneratedBio}
          onRegenerate={handleRegenerateBio}
          onBackToSettings={() => setStep(3)}
          onStartOver={handleStartOverWrapper}
        />
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
