
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Copy, Download, Share2 } from 'lucide-react';

const toneOptions = [
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'enthusiastic', label: 'Enthusiastic' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'confident', label: 'Confident' }
];

const platformOptions = [
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'resume', label: 'Resume/CV' },
  { value: 'portfolio', label: 'Portfolio Website' }
];

const BioGeneratorForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [generatedBio, setGeneratedBio] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    profession: '',
    experience: '',
    achievements: '',
    interests: '',
    tone: 'professional',
    platform: 'linkedin',
    length: 'medium'
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleRadioChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNext = () => {
    setStep(prev => prev + 1);
  };
  
  const handleBack = () => {
    setStep(prev => prev - 1);
  };
  
  const handleGenerate = () => {
    setLoading(true);
    
    // Simulate API call to generate bio
    setTimeout(() => {
      // This would normally be where we'd call the OpenAI API
      const simulatedBio = `I'm ${formData.name}, a ${formData.tone} ${formData.profession} with extensive experience in the field. 
      ${formData.achievements ? `Some of my notable achievements include ${formData.achievements}.` : ''} 
      ${formData.interests ? `Outside of work, I enjoy ${formData.interests}.` : ''}
      I'm passionate about using my skills to make a difference and always looking for new opportunities to grow.`;
      
      setGeneratedBio(simulatedBio);
      setLoading(false);
      setStep(4); // Move to results step
    }, 2000);
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedBio);
  };
  
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
        <div className="animate-fade-in">
          <h3 className="text-lg font-medium mb-4">Tell us about yourself</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
              />
            </div>
            
            <div>
              <Label htmlFor="profession">Profession/Title</Label>
              <Input
                id="profession"
                name="profession"
                value={formData.profession}
                onChange={handleChange}
                placeholder="Marketing Specialist, Software Engineer, etc."
              />
            </div>
            
            <div>
              <Label htmlFor="experience">Experience (Optional)</Label>
              <Textarea
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="Briefly describe your professional experience..."
                rows={3}
              />
            </div>
            
            <div className="pt-4 flex justify-end">
              <Button onClick={handleNext}>
                Continue
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {step === 2 && (
        <div className="animate-fade-in">
          <h3 className="text-lg font-medium mb-4">More about you</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="achievements">Key Achievements (Optional)</Label>
              <Textarea
                id="achievements"
                name="achievements"
                value={formData.achievements}
                onChange={handleChange}
                placeholder="Awards, recognitions, or notable projects..."
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="interests">Personal Interests (Optional)</Label>
              <Textarea
                id="interests"
                name="interests"
                value={formData.interests}
                onChange={handleChange}
                placeholder="Hobbies, passions, or activities outside of work..."
                rows={3}
              />
            </div>
            
            <div className="pt-4 flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleNext}>
                Continue
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {step === 3 && (
        <div className="animate-fade-in">
          <h3 className="text-lg font-medium mb-4">Style and format</h3>
          <div className="space-y-6">
            <div>
              <Label className="mb-2 block">Tone</Label>
              <RadioGroup 
                defaultValue={formData.tone} 
                onValueChange={(value) => handleRadioChange('tone', value)}
                className="flex flex-wrap gap-4"
              >
                {toneOptions.map((option) => (
                  <div key={option.value} className="flex items-center">
                    <RadioGroupItem value={option.value} id={`tone-${option.value}`} className="peer sr-only" />
                    <Label
                      htmlFor={`tone-${option.value}`}
                      className="px-4 py-2 rounded-full border cursor-pointer bg-background hover:bg-muted peer-data-[state=checked]:bg-wordcraft-purple peer-data-[state=checked]:text-white"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            <div>
              <Label className="mb-2 block">Platform</Label>
              <RadioGroup 
                defaultValue={formData.platform} 
                onValueChange={(value) => handleRadioChange('platform', value)}
                className="flex flex-wrap gap-4"
              >
                {platformOptions.map((option) => (
                  <div key={option.value} className="flex items-center">
                    <RadioGroupItem value={option.value} id={`platform-${option.value}`} className="peer sr-only" />
                    <Label
                      htmlFor={`platform-${option.value}`}
                      className="px-4 py-2 rounded-full border cursor-pointer bg-background hover:bg-muted peer-data-[state=checked]:bg-wordcraft-purple peer-data-[state=checked]:text-white"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            <div>
              <Label className="mb-2 block">Length</Label>
              <RadioGroup 
                defaultValue={formData.length}
                onValueChange={(value) => handleRadioChange('length', value)}
                className="flex gap-4"
              >
                <div className="flex items-center">
                  <RadioGroupItem value="short" id="length-short" className="peer sr-only" />
                  <Label
                    htmlFor="length-short"
                    className="px-4 py-2 rounded-full border cursor-pointer bg-background hover:bg-muted peer-data-[state=checked]:bg-wordcraft-purple peer-data-[state=checked]:text-white"
                  >
                    Short
                  </Label>
                </div>
                
                <div className="flex items-center">
                  <RadioGroupItem value="medium" id="length-medium" className="peer sr-only" />
                  <Label
                    htmlFor="length-medium"
                    className="px-4 py-2 rounded-full border cursor-pointer bg-background hover:bg-muted peer-data-[state=checked]:bg-wordcraft-purple peer-data-[state=checked]:text-white"
                  >
                    Medium
                  </Label>
                </div>
                
                <div className="flex items-center">
                  <RadioGroupItem value="long" id="length-long" className="peer sr-only" />
                  <Label
                    htmlFor="length-long"
                    className="px-4 py-2 rounded-full border cursor-pointer bg-background hover:bg-muted peer-data-[state=checked]:bg-wordcraft-purple peer-data-[state=checked]:text-white"
                  >
                    Long
                  </Label>
                </div>
              </RadioGroup>
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
                    Generate Bio
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {step === 4 && (
        <div className="animate-fade-in">
          <h3 className="text-lg font-medium mb-4">Your generated bio</h3>
          
          <Tabs defaultValue="preview">
            <TabsList className="mb-4">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="edit">Edit</TabsTrigger>
            </TabsList>
            
            <TabsContent value="preview">
              <Card>
                <CardContent className="p-6 bg-white rounded-md shadow-sm">
                  <p className="whitespace-pre-line">{generatedBio}</p>
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
                <Button variant="outline">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
              
              <div className="mt-8 text-center">
                <p className="text-muted-foreground mb-4">Not happy with your bio?</p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setLoading(true);
                    setTimeout(() => {
                      // In a real app, this would call the API again with the same parameters
                      setGeneratedBio(`I'm ${formData.name}, a dedicated ${formData.profession} with a passion for excellence and innovation.
                      With experience across various projects, I bring a unique perspective to every challenge.
                      ${formData.interests ? `When I'm not working, you can find me ${formData.interests}.` : ''}
                      I'm always looking to connect with like-minded professionals and explore new opportunities.`);
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
                value={generatedBio}
                onChange={(e) => setGeneratedBio(e.target.value)}
                rows={8}
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
            <h4 className="font-medium mb-4">Save this bio</h4>
            <div className="flex items-center gap-4">
              <Input placeholder="Give this bio a name (e.g. LinkedIn Professional)" />
              <Button>Save</Button>
            </div>
          </div>
          
          <div className="pt-8 flex justify-between">
            <Button variant="outline" onClick={() => setStep(3)}>
              Back to Settings
            </Button>
            <Button onClick={() => setStep(1)}>
              Create Another Bio
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BioGeneratorForm;
