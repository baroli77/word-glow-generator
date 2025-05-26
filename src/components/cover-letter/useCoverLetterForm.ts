
import { useState, useCallback } from 'react';
import { toast } from "@/hooks/use-toast";
import { useAuth } from '@/context/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { generateCoverLetter } from '../../services/coverLetterService';
import { parseFile } from '../../utils/fileParser';

export const useCoverLetterForm = () => {
  const { user } = useAuth();
  const { canUseTool, recordUsage, refetch } = useSubscription();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [parsedCV, setParsedCV] = useState<string>('');
  const [parsingFile, setParsingFile] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    jobTitle: '',
    companyName: '',
    additionalInfo: '',
    tone: 'professional'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFileName(file.name);
      setParsingFile(true);
      
      if (validationErrors.cv) {
        setValidationErrors(prev => ({ ...prev, cv: '' }));
      }
      
      try {
        const result = await parseFile(file);
        
        if (result.error || !result.content) {
          setParsedCV('');
          console.error('CV parsing failed:', result.error);
        } else if (result.content && result.content.trim()) {
          setParsedCV(result.content.trim());
          console.log('CV parsed successfully, content length:', result.content.trim().length);
          toast({
            title: "CV Uploaded Successfully",
            description: `${file.name} was parsed and is ready to use.`,
          });
        } else {
          setParsedCV('');
          toast({
            title: "CV Parsing Failed",
            description: `The file "${file.name}" appears to be empty or couldn't be read properly.`,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('File upload error:', error);
        toast({
          title: "Upload Error",
          description: `Failed to process "${file.name}". Please try again.`,
          variant: "destructive",
        });
        setParsedCV('');
      } finally {
        setParsingFile(false);
      }
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.jobTitle.trim()) {
      errors.jobTitle = 'Job title is required';
    }
    
    if (!formData.companyName.trim()) {
      errors.companyName = 'Company name is required';
    }
    
    if (!fileName || !parsedCV || !parsedCV.trim()) {
      errors.cv = 'Please upload and parse a CV file';
    }
    
    if (!formData.tone) {
      errors.tone = 'Please select a tone';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const checkAccess = async (): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to use the cover letter generator.",
        variant: "destructive",
      });
      return false;
    }

    const hasAccess = await canUseTool('cover_letter');
    if (!hasAccess) {
      setShowPricingModal(true);
      return false;
    }

    return true;
  };

  const handleUpgradeComplete = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const handleNext = () => {
    if (step === 1) {
      const stepErrors: Record<string, string> = {};
      if (!fileName || !parsedCV || !parsedCV.trim()) stepErrors.cv = 'Please upload and parse a CV file';
      if (!formData.jobTitle.trim()) stepErrors.jobTitle = 'Job title is required';
      if (!formData.companyName.trim()) stepErrors.companyName = 'Company name is required';
      
      setValidationErrors(stepErrors);
      if (Object.keys(stepErrors).length === 0) {
        setStep(2);
      }
    } else {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleGenerate = async () => {
    if (!validateForm()) {
      return;
    }

    if (!parsedCV || !parsedCV.trim()) {
      toast({
        title: "CV Required",
        description: "Please upload your CV before generating a cover letter.",
        variant: "destructive",
      });
      return;
    }

    const hasAccess = await checkAccess();
    if (!hasAccess) {
      return;
    }
    
    setLoading(true);
    
    try {
      console.log('Generating cover letter with CV content length:', parsedCV.length);
      const response = await generateCoverLetter(formData, parsedCV);
      
      if (response.error || !response.content) {
        return; // Error handling is done in generateCoverLetter
      }
      
      setGeneratedLetter(response.content);
      await recordUsage('cover_letter');
      setStep(3);
    } catch (error) {
      console.error("Error generating cover letter:", error);
      toast({
        title: "Error",
        description: "Failed to generate cover letter. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    const hasAccess = await checkAccess();
    if (!hasAccess) {
      return;
    }

    setLoading(true);
    
    try {
      const response = await generateCoverLetter(formData, parsedCV);
      
      if (response.error || !response.content) {
        return; // Error handling is done in generateCoverLetter
      }
      
      setGeneratedLetter(response.content);
      await recordUsage('cover_letter');
    } catch (error) {
      console.error("Error regenerating cover letter:", error);
      toast({
        title: "Error",
        description: "Failed to regenerate cover letter. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (generatedLetter && typeof generatedLetter === 'string') {
      navigator.clipboard.writeText(generatedLetter);
      toast({
        title: "Copied to clipboard",
        description: "Your cover letter has been copied to clipboard."
      });
    }
  };

  const isFieldDisabled = (field: string) => {
    return !user;
  };

  const getTooltipContent = (field: string) => {
    if (!user) return "Please sign in to use this feature";
    if (validationErrors[field]) return validationErrors[field];
    return null;
  };

  const canProceedToStep2 = () => {
    return fileName && parsedCV && parsedCV.trim() && formData.jobTitle.trim() && formData.companyName.trim();
  };

  const canGenerate = () => {
    return validateForm() && user;
  };

  return {
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
  };
};
