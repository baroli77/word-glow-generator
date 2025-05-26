import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Sparkles, AlertCircle } from 'lucide-react';

interface CustomizeStepProps {
  formData: {
    additionalInfo: string;
    tone: string;
  };
  validationErrors: Record<string, string>;
  loading: boolean;
  isFieldDisabled: (field: string) => boolean;
  getTooltipContent: (field: string) => string | null;
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  handleBack: () => void;
  handleGenerate: () => void;
  canGenerate: () => boolean;
}

const toneOptions = [
  { value: 'professional', label: 'Professional' },
  { value: 'confident', label: 'Confident' },
  { value: 'enthusiastic', label: 'Enthusiastic' },
  { value: 'formal', label: 'Formal' },
  { value: 'friendly', label: 'Friendly' }
];

const CustomizeStep: React.FC<CustomizeStepProps> = ({
  formData,
  validationErrors,
  loading,
  isFieldDisabled,
  getTooltipContent,
  handleChange,
  setFormData,
  handleBack,
  handleGenerate,
  canGenerate
}) => {
  return (
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
  );
};

export default CustomizeStep;
