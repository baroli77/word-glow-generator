import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Copy, Download, Upload, FileText, AlertCircle, Lock } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from '@/context/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { generateCoverLetter } from '../services/coverLetterService';
import { parseFile } from '../utils/fileParser';
import PricingModal from './PricingModal';
import UsageCounter from './UsageCounter';

const CoverLetterForm: React.FC = () => {
  const { user } = useAuth();
  const { canUseTool, recordUsage, subscription, refetch } = useSubscription();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [parsedCV, setParsedCV] = useState<string>('');
  const [parsingFile, setParsingFile] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  // Form state
  const [formData, setFormData] = useState({
    jobTitle: '',
    companyName: '',
    additionalInfo: '',
    tone: 'professional'
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFileName(file.name);
      setParsingFile(true);
      
      // Clear previous validation error
      if (validationErrors.cv) {
        setValidationErrors(prev => ({ ...prev, cv: '' }));
      }
      
      try {
        const result = await parseFile(file);
        
        if (result.error) {
          // Keep the filename but clear the parsed content
          setParsedCV('');
          console.error('CV parsing failed:', result.error);
          // Don't clear fileName here - let user see what file they tried to upload
          toast({
            title: "CV Parsing Failed",
            description: `${result.error} The file "${file.name}" couldn't be processed.`,
            variant: "destructive",
          });
        } else if (result.content && result.content.trim()) {
          // Successfully parsed
          setParsedCV(result.content.trim());
          console.log('CV parsed successfully, content length:', result.content.trim().length);
          toast({
            title: "CV Uploaded Successfully",
            description: `${file.name} was parsed and is ready to use.`,
          });
        } else {
          // Handle case where content is empty
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
    // Refresh subscription data and re-check access
    await refetch();
  }, [refetch]);
  
  const handleNext = () => {
    if (step === 1) {
      // Validate step 1 fields
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

    // Additional check for parsedCV content
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
      
      if (response.error) {
        toast({
          title: "Generation failed",
          description: response.error,
          variant: "destructive",
        });
        return;
      }
      
      // Check if content is valid
      if (!response.content || typeof response.content !== 'string' || !response.content.trim()) {
        toast({
          title: "Generation failed",
          description: "No content was returned. Try again or upload a different file.",
          variant: "destructive",
        });
        return;
      }
      
      setGeneratedLetter(response.content.trim());
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
      
      if (response.error) {
        toast({
          title: "Regeneration failed",
          description: response.error,
          variant: "destructive",
        });
        return;
      }
      
      // Check if content is valid
      if (!response.content || typeof response.content !== 'string' || !response.content.trim()) {
        toast({
          title: "Regeneration failed",
          description: "No content was returned. Try again or upload a different file.",
          variant: "destructive",
        });
        return;
      }
      
      setGeneratedLetter(response.content.trim());
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
    navigator.clipboard.writeText(generatedLetter);
    toast({
      title: "Copied to clipboard",
      description: "Your cover letter has been copied to clipboard."
    });
  };
  
  const toneOptions = [
    { value: 'professional', label: 'Professional' },
    { value: 'confident', label: 'Confident' },
    { value: 'enthusiastic', label: 'Enthusiastic' },
    { value: 'formal', label: 'Formal' },
    { value: 'friendly', label: 'Friendly' }
  ];

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

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <Lock className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Authentication Required</h3>
            <p className="text-muted-foreground mb-6">
              Please sign in to access the cover letter generator and start creating professional cover letters.
            </p>
            <Button onClick={() => window.location.href = '/login'}>
              Sign In to Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
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
          <div className="animate-fade-in">
            <h3 className="text-lg font-medium mb-4">Upload CV and Job Details</h3>
            <div className="space-y-6">
              <div>
                <Label htmlFor="cv-upload">Your CV / Resume *</Label>
                <div className="mt-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <label htmlFor="cv-upload" className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-background hover:bg-muted/50 ${validationErrors.cv ? 'border-red-500' : ''} ${isFieldDisabled('cv') ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          {parsingFile ? (
                            <>
                              <div className="animate-spin h-6 w-6 border-2 border-makemybio-purple border-t-transparent rounded-full mb-2"></div>
                              <p className="text-sm text-muted-foreground">Parsing {fileName}...</p>
                            </>
                          ) : fileName ? (
                            <>
                              <FileText className="w-8 h-8 mb-2 text-makemybio-purple" />
                              <p className="text-sm text-muted-foreground">{fileName}</p>
                              {parsedCV && parsedCV.trim() ? (
                                <p className="text-xs text-green-600">✓ Parsed successfully</p>
                              ) : (
                                <div className="text-center">
                                  <p className="text-xs text-red-600">✗ Parsing failed</p>
                                  <p className="text-xs text-muted-foreground mt-1">Try a different format (PDF recommended)</p>
                                </div>
                              )}
                            </>
                          ) : (
                            <>
                              <Upload className="w-8 h-8 mb-2 text-makemybio-purple" />
                              <p className="mb-2 text-sm font-semibold">Click to upload your CV</p>
                              <p className="text-xs text-muted-foreground">PDF, DOCX or TXT (max 5MB)</p>
                            </>
                          )}
                        </div>
                        <input 
                          id="cv-upload" 
                          type="file" 
                          accept=".pdf,.docx,.doc,.txt" 
                          className="hidden" 
                          onChange={handleFileChange}
                          disabled={isFieldDisabled('cv')}
                        />
                      </label>
                    </TooltipTrigger>
                    {getTooltipContent('cv') && (
                      <TooltipContent>
                        <div className="flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {getTooltipContent('cv')}
                        </div>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </div>
                {validationErrors.cv && (
                  <p className="text-sm text-red-600 mt-1">{validationErrors.cv}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="jobTitle">Job Title *</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Input
                      id="jobTitle"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleChange}
                      placeholder="e.g., Marketing Manager, Software Engineer"
                      disabled={isFieldDisabled('jobTitle')}
                      className={validationErrors.jobTitle ? 'border-red-500' : ''}
                    />
                  </TooltipTrigger>
                  {getTooltipContent('jobTitle') && (
                    <TooltipContent>
                      <div className="flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {getTooltipContent('jobTitle')}
                      </div>
                    </TooltipContent>
                  )}
                </Tooltip>
                {validationErrors.jobTitle && (
                  <p className="text-sm text-red-600 mt-1">{validationErrors.jobTitle}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="companyName">Company Name *</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Input
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder="e.g., Acme Corporation"
                      disabled={isFieldDisabled('companyName')}
                      className={validationErrors.companyName ? 'border-red-500' : ''}
                    />
                  </TooltipTrigger>
                  {getTooltipContent('companyName') && (
                    <TooltipContent>
                      <div className="flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {getTooltipContent('companyName')}
                      </div>
                    </TooltipContent>
                  )}
                </Tooltip>
                {validationErrors.companyName && (
                  <p className="text-sm text-red-600 mt-1">{validationErrors.companyName}</p>
                )}
              </div>
              
              <div className="pt-4 flex justify-end">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      onClick={handleNext}
                      disabled={!canProceedToStep2()}
                    >
                      Continue
                    </Button>
                  </TooltipTrigger>
                  {!canProceedToStep2() && (
                    <TooltipContent>
                      Please complete all required fields to continue
                    </TooltipContent>
                  )}
                </Tooltip>
              </div>
            </div>
          </div>
        )}
        
        {step === 2 && (
          <div className="animate-fade-in">
            <h3 className="text-lg font-medium mb-4">Customize Your Cover Letter</h3>
            <div className="space-y-6">
              <div>
                <Label htmlFor="additionalInfo">Additional Information (Optional)</Label>
                <Textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleChange}
                  placeholder="Add any additional information that's not in your CV..."
                  rows={4}
                  disabled={isFieldDisabled('additionalInfo')}
                />
              </div>
              
              <div>
                <Label className="mb-3 block">Tone *</Label>
                <div className="flex flex-wrap gap-3">
                  {toneOptions.map((option) => (
                    <Tooltip key={option.value}>
                      <TooltipTrigger asChild>
                        <label
                          className={`px-4 py-2 rounded-full border cursor-pointer hover:bg-muted transition-colors ${
                            formData.tone === option.value ? 'bg-makemybio-purple text-white' : 'bg-background'
                          } ${isFieldDisabled('tone') ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <input
                            type="radio"
                            name="tone"
                            value={option.value}
                            checked={formData.tone === option.value}
                            onChange={() => setFormData(prev => ({ ...prev, tone: option.value }))}
                            className="sr-only"
                            disabled={isFieldDisabled('tone')}
                          />
                          {option.label}
                        </label>
                      </TooltipTrigger>
                      {getTooltipContent('tone') && (
                        <TooltipContent>
                          <div className="flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {getTooltipContent('tone')}
                          </div>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  ))}
                </div>
                {validationErrors.tone && (
                  <p className="text-sm text-red-600 mt-1">{validationErrors.tone}</p>
                )}
              </div>
              
              <div className="pt-4 flex justify-between">
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button onClick={handleGenerate} disabled={!canGenerate() || loading}>
                      {loading ? (
                        <div className="flex items-center">
                          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                          Generating...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Sparkles className="w-4 h-4 mr-2" />
                          Generate Cover Letter
                        </div>
                      )}
                    </Button>
                  </TooltipTrigger>
                  {!canGenerate() && (
                    <TooltipContent>
                      Please complete all required fields and sign in to generate
                    </TooltipContent>
                  )}
                </Tooltip>
              </div>
            </div>
          </div>
        )}
        
        {step === 3 && (
          <div className="animate-fade-in">
            <h3 className="text-lg font-medium mb-4">Your Generated Cover Letter</h3>
            
            <Tabs defaultValue="preview">
              <TabsList className="mb-4">
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="edit">Edit</TabsTrigger>
              </TabsList>
              
              <TabsContent value="preview">
                <Card>
                  <CardContent className="p-6 bg-white rounded-md shadow-sm">
                    {generatedLetter && typeof generatedLetter === 'string' && generatedLetter.trim() ? (
                      <div className="whitespace-pre-wrap font-sans">{generatedLetter}</div>
                    ) : (
                      <div className="text-muted-foreground text-center py-8">
                        No content available. Please try generating again.
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <div className="mt-6 flex flex-wrap gap-4">
                  <Button onClick={handleCopy} disabled={!generatedLetter || !generatedLetter.trim()}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy to Clipboard
                  </Button>
                  <Button variant="outline" disabled={!generatedLetter || !generatedLetter.trim()}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
                
                <div className="mt-8 text-center">
                  <p className="text-muted-foreground mb-4">Not satisfied with your cover letter?</p>
                  <Button 
                    variant="outline" 
                    onClick={handleRegenerate}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                        Regenerating...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Regenerate
                      </div>
                    )}
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="edit">
                {generatedLetter && typeof generatedLetter === 'string' && generatedLetter.trim() ? (
                  <>
                    <Textarea
                      value={generatedLetter}
                      onChange={(e) => setGeneratedLetter(e.target.value)}
                      rows={12}
                      className="mb-4"
                    />
                    
                    <div className="flex justify-end">
                      <Button onClick={handleCopy}>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy to Clipboard
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-muted-foreground text-center py-8">
                    No content available to edit. Please try generating again.
                  </div>
                )}
              </TabsContent>
            </Tabs>
            
            <div className="pt-8 flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>
                Back to Settings
              </Button>
              <Button onClick={() => setStep(1)}>
                Create Another Cover Letter
              </Button>
            </div>
          </div>
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
