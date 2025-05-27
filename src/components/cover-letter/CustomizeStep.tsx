
import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
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
  const handleToneChange = (value: string) => {
    if (value) {
      setFormData(prev => ({ ...prev, tone: value }));
    }
  };

  return (
    <TooltipProvider>
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
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <ToggleGroup 
                    type="single"
                    value={formData.tone} 
                    onValueChange={handleToneChange}
                    disabled={isFieldDisabled('tone')}
                    className="flex flex-wrap gap-2"
                  >
                    {toneOptions.map((option) => (
                      <ToggleGroupItem 
                        key={option.value}
                        value={option.value}
                        className="px-4 py-2 rounded-full border border-input bg-background hover:bg-accent hover:text-accent-foreground data-[state=on]:bg-primary data-[state=on]:text-primary-foreground transition-colors"
                      >
                        {option.label}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </div>
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
    </TooltipProvider>
  );
};

export default CustomizeStep;
