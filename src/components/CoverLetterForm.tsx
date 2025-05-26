
import React from 'react';
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from '@/context/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import PricingModal from './PricingModal';
import UsageCounter from './UsageCounter';
import AuthGuard from './cover-letter/AuthGuard';
import CVUploadStep from './cover-letter/CVUploadStep';
import CustomizeStep from './cover-letter/CustomizeStep';
import ResultStep from './cover-letter/ResultStep';
import { useCoverLetterForm } from './cover-letter/useCoverLetterForm';

const CoverLetterForm: React.FC = () => {
  const { user } = useAuth();
  const { subscription } = useSubscription();
  
  const {
    step,
    loading,
    generatedLetter,
    fileName,
    parsedCV,
    parsingFile,
    showPricingModal,
    validationErrors,
    formData,
    setStep,
    setFormData,
    setGeneratedLetter,
    setShowPricingModal,
    handleChange,
    handleFileChange,
    handleNext,
    handleBack,
    handleGenerate,
    handleRegenerate,
    handleCopy,
    handleUpgradeComplete,
    isFieldDisabled,
    getTooltipContent,
    canProceedToStep2,
    canGenerate
  } = useCoverLetterForm();

  if (!user) {
    return <AuthGuard />;
  }
  
  return (
    <TooltipProvider>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-serif text-2xl font-bold">Create Your Cover Letter</h2>
            <div className="text-sm text-muted-foreground">
              Step {step} of 3
            </div>
          </div>
          
          <div className="w-full bg-muted h-2 rounded-full mb-4">
            <div 
              className="bg-gradient-to-r from-makemybio-purple to-makemybio-pink h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>

          <UsageCounter toolType="cover_letter" toolDisplayName="Cover Letter" />
        </div>
        
        {step === 1 && (
          <CVUploadStep
            fileName={fileName}
            parsedCV={parsedCV}
            parsingFile={parsingFile}
            formData={formData}
            validationErrors={validationErrors}
            isFieldDisabled={isFieldDisabled}
            getTooltipContent={getTooltipContent}
            handleFileChange={handleFileChange}
            handleChange={handleChange}
            handleNext={handleNext}
            canProceedToStep2={() => !!parsedCV && parsedCV.trim().length > 50}
          />
        )}
        
        {step === 2 && (
          <CustomizeStep
            formData={formData}
            validationErrors={validationErrors}
            loading={loading}
            isFieldDisabled={isFieldDisabled}
            getTooltipContent={getTooltipContent}
            handleChange={handleChange}
            setFormData={setFormData}
            handleBack={handleBack}
            handleGenerate={handleGenerate}
            canGenerate={() => !!user}
          />
        )}
        
        {step === 3 && (
          <ResultStep
            generatedLetter={generatedLetter}
            loading={loading}
            handleCopy={handleCopy}
            handleRegenerate={handleRegenerate}
            setGeneratedLetter={setGeneratedLetter}
            setStep={setStep}
            formData={formData}
          />
        )}

        <PricingModal 
          isOpen={showPricingModal}
          onClose={() => setShowPricingModal(false)}
          toolName="Cover Letter Generator"
          onUpgradeComplete={handleUpgradeComplete}
        />
      </div>
    </TooltipProvider>
  );
};

export default CoverLetterForm;
