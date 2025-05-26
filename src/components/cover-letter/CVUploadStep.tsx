import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Upload, FileText, AlertCircle } from 'lucide-react';

interface CVUploadStepProps {
  fileName: string | null;
  parsedCV: string;
  parsingFile: boolean;
  formData: {
    jobTitle: string;
    companyName: string;
  };
  validationErrors: Record<string, string>;
  isFieldDisabled: (field: string) => boolean;
  getTooltipContent: (field: string) => string | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleNext: () => void;
  canProceedToStep2: () => boolean;
}

const CVUploadStep: React.FC<CVUploadStepProps> = ({
  fileName,
  parsedCV,
  parsingFile,
  formData,
  validationErrors,
  isFieldDisabled,
  getTooltipContent,
  handleFileChange,
  handleChange,
  handleNext,
  canProceedToStep2
}) => {
  return (
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
  );
};

export default CVUploadStep;
