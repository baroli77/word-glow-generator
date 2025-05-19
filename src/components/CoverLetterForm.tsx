
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Copy, Download, Upload, FileText } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

const CoverLetterForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  
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
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFileName(file.name);
      
      // In a real app, we would upload and process the CV here
      toast({
        title: "CV Uploaded",
        description: `${file.name} was successfully uploaded.`,
      });
    }
  };
  
  const handleNext = () => {
    setStep(prev => prev + 1);
  };
  
  const handleBack = () => {
    setStep(prev => prev - 1);
  };
  
  const handleGenerate = () => {
    if (!fileName) {
      toast({
        title: "CV Required",
        description: "Please upload your CV to generate a cover letter.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    // Simulate API call to generate cover letter
    setTimeout(() => {
      // This would normally be where we'd call the API
      const simulatedLetter = `
Dear Hiring Manager,

I am writing to express my sincere interest in the ${formData.jobTitle} position at ${formData.companyName}. With my relevant experience and skills outlined in my attached CV, I believe I am a strong candidate for this role.

${formData.additionalInfo ? `Additionally, I would like to highlight that ${formData.additionalInfo}` : ''}

My previous experience has equipped me with the necessary skills to excel in this position. I am confident that my background and passion for this field make me an ideal candidate.

I look forward to the opportunity to discuss how my experience and skills align with your team's needs. Thank you for considering my application.

Sincerely,
[Your Name]
      `;
      
      setGeneratedLetter(simulatedLetter);
      setLoading(false);
      setStep(3); // Move to results step
    }, 2000);
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
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-serif text-2xl font-bold">Create Your Cover Letter</h2>
          <div className="text-sm text-muted-foreground">
            Step {step} of 3
          </div>
        </div>
        
        <div className="w-full bg-muted h-2 rounded-full mb-8">
          <div 
            className="bg-gradient-to-r from-wordcraft-purple to-wordcraft-pink h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>
      </div>
      
      {step === 1 && (
        <div className="animate-fade-in">
          <h3 className="text-lg font-medium mb-4">Upload your CV and job details</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="cv-upload">Your CV / Resume</Label>
              <div className="mt-2">
                <label htmlFor="cv-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-background hover:bg-muted/50">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {fileName ? (
                      <>
                        <FileText className="w-8 h-8 mb-2 text-wordcraft-purple" />
                        <p className="text-sm text-muted-foreground">{fileName}</p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 mb-2 text-wordcraft-purple" />
                        <p className="mb-2 text-sm font-semibold">Click to upload your CV</p>
                        <p className="text-xs text-muted-foreground">PDF, DOCX or TXT (max 5MB)</p>
                      </>
                    )}
                  </div>
                  <input id="cv-upload" type="file" accept=".pdf,.docx,.doc,.txt" className="hidden" onChange={handleFileChange} />
                </label>
              </div>
            </div>
            
            <div>
              <Label htmlFor="jobTitle">Job Title being applied for</Label>
              <Input
                id="jobTitle"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                placeholder="e.g., Marketing Manager, Software Engineer"
              />
            </div>
            
            <div>
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="e.g., Acme Corporation"
              />
            </div>
            
            <div className="pt-4 flex justify-end">
              <Button onClick={handleNext}
                disabled={!fileName}>
                Continue
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {step === 2 && (
        <div className="animate-fade-in">
          <h3 className="text-lg font-medium mb-4">Additional information</h3>
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
              />
            </div>
            
            <div>
              <Label className="mb-2 block">Tone</Label>
              <div className="flex flex-wrap gap-3">
                {toneOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`px-4 py-2 rounded-full border cursor-pointer hover:bg-muted transition-colors ${
                      formData.tone === option.value ? 'bg-wordcraft-purple text-white' : 'bg-background'
                    }`}
                  >
                    <input
                      type="radio"
                      name="tone"
                      value={option.value}
                      checked={formData.tone === option.value}
                      onChange={() => setFormData(prev => ({ ...prev, tone: option.value }))}
                      className="sr-only"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>
            
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
                    Generate Cover Letter
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {step === 3 && (
        <div className="animate-fade-in">
          <h3 className="text-lg font-medium mb-4">Your generated cover letter</h3>
          
          <Tabs defaultValue="preview">
            <TabsList className="mb-4">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="edit">Edit</TabsTrigger>
            </TabsList>
            
            <TabsContent value="preview">
              <Card>
                <CardContent className="p-6 bg-white rounded-md shadow-sm">
                  <pre className="whitespace-pre-line font-sans">{generatedLetter}</pre>
                </CardContent>
              </Card>
              
              <div className="mt-6 flex flex-wrap gap-4">
                <Button onClick={handleCopy}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy to Clipboard
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
              
              <div className="mt-8 text-center">
                <p className="text-muted-foreground mb-4">Not satisfied with your cover letter?</p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setLoading(true);
                    setTimeout(() => {
                      // In a real app, this would call the API again with the same parameters
                      setGeneratedLetter(`
Dear Hiring Team,

I am excited to apply for the ${formData.jobTitle} position at ${formData.companyName}. After reviewing the job description, I am confident that my skills and experience make me an excellent candidate for this role.

Based on my attached CV, you will find that I have a proven track record of success in similar roles, with a focus on delivering exceptional results and driving meaningful outcomes.

${formData.additionalInfo ? `I would also like to mention that ${formData.additionalInfo}` : ''}

I am particularly drawn to ${formData.companyName} because of its reputation for innovation and excellence. I am excited about the possibility of bringing my unique skills and perspective to your team.

Thank you for considering my application. I look forward to the opportunity to discuss how I can contribute to your organization's continued success.

Best regards,
[Your Name]
                      `);
                      setLoading(false);
                    }, 1500);
                  }}
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
            </TabsContent>
          </Tabs>
          
          <div className="mt-8 pt-6 border-t">
            <h4 className="font-medium mb-4">Save this cover letter</h4>
            <div className="flex items-center gap-4">
              <Input placeholder="Give this cover letter a name (e.g. Marketing Position at Acme)" />
              <Button>Save</Button>
            </div>
          </div>
          
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
    </div>
  );
};

export default CoverLetterForm;
