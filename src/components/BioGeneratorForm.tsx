import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Copy, Download, Share2 } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

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
  { value: 'tinder', label: 'Tinder' },
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
    lookingFor: '',
    funFacts: '',
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
      let simulatedBio = '';
      
      switch(formData.platform) {
        case 'linkedin':
          simulatedBio = `I'm ${formData.name}, a ${formData.tone} ${formData.profession} with extensive experience in the field. 
          ${formData.achievements ? `Some of my notable achievements include ${formData.achievements}.` : ''} 
          ${formData.interests ? `Outside of work, I enjoy ${formData.interests}.` : ''}
          I'm passionate about using my skills to make a difference and always looking for new opportunities to grow.`;
          break;
        case 'twitter':
          simulatedBio = `${formData.name} | ${formData.profession}
          ${formData.interests ? `Interested in ${formData.interests}` : ''}
          Tweets about tech, insights, and occasional ${formData.tone} thoughts.`;
          break;
        case 'instagram':
          simulatedBio = `✨ ${formData.name} ✨
          ${formData.profession}
          ${formData.interests ? `Passionate about ${formData.interests}` : ''}
          📸 Sharing moments and adventures`;
          break;
        case 'tinder':
          simulatedBio = `${formData.name}, ${formData.tone} spirit
          ${formData.funFacts ? `${formData.funFacts}` : ''}
          ${formData.interests ? `I enjoy ${formData.interests}` : ''}
          ${formData.lookingFor ? `Looking for ${formData.lookingFor}` : ''}`;
          break;
        case 'resume':
          simulatedBio = `Results-driven ${formData.profession} with expertise in ${formData.experience}. 
          ${formData.achievements ? `Achieved ${formData.achievements}.` : ''}
          Seeking to leverage skills and experience to drive success.`;
          break;
        case 'portfolio':
          simulatedBio = `Hello! I'm ${formData.name}, a ${formData.tone} ${formData.profession}.
          ${formData.experience ? `With experience in ${formData.experience},` : ''} I create impactful solutions.
          ${formData.achievements ? `Proud to have ${formData.achievements}.` : ''}
          ${formData.interests ? `When not working, I enjoy ${formData.interests}.` : ''}`;
          break;
        default:
          simulatedBio = `I'm ${formData.name}, a ${formData.profession}.`;
      }
      
      setGeneratedBio(simulatedBio);
      setLoading(false);
      setStep(4); // Move to results step
    }, 2000);
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedBio);
    toast({
      title: "Copied to clipboard",
      description: "Your bio has been copied to clipboard."
    });
  };

  // Determine which fields to show based on the selected platform
  const getFormFields = () => {
    switch(formData.platform) {
      case 'linkedin':
        return (
          <>
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
              <Label htmlFor="experience">Experience</Label>
              <Textarea
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="Briefly describe your professional experience..."
                rows={3}
              />
            </div>
          </>
        );
      
      case 'twitter':
      case 'instagram':
        return (
          <>
            <div>
              <Label htmlFor="name">Your Name/Handle</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe / @johndoe"
              />
            </div>
            
            <div>
              <Label htmlFor="profession">What You Do</Label>
              <Input
                id="profession"
                name="profession"
                value={formData.profession}
                onChange={handleChange}
                placeholder="Designer, Photographer, Travel Enthusiast, etc."
              />
            </div>
            
            <div>
              <Label htmlFor="interests">Interests/Topics</Label>
              <Input
                id="interests"
                name="interests"
                value={formData.interests}
                onChange={handleChange}
                placeholder="design, travel, food, technology, etc."
              />
            </div>
          </>
        );
      
      case 'tinder':
        return (
          <>
            <div>
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John"
              />
            </div>
            
            <div>
              <Label htmlFor="interests">Interests/Hobbies</Label>
              <Input
                id="interests"
                name="interests"
                value={formData.interests}
                onChange={handleChange}
                placeholder="hiking, movies, cooking, etc."
              />
            </div>
            
            <div>
              <Label htmlFor="funFacts">Fun Facts About You</Label>
              <Textarea
                id="funFacts"
                name="funFacts"
                value={formData.funFacts}
                onChange={handleChange}
                placeholder="Something unique or interesting about you..."
                rows={2}
              />
            </div>
            
            <div>
              <Label htmlFor="lookingFor">What You're Looking For</Label>
              <Textarea
                id="lookingFor"
                name="lookingFor"
                value={formData.lookingFor}
                onChange={handleChange}
                placeholder="Describe what kind of connection you're seeking..."
                rows={2}
              />
            </div>
          </>
        );
      
      case 'resume':
        return (
          <>
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
              <Label htmlFor="profession">Professional Title</Label>
              <Input
                id="profession"
                name="profession"
                value={formData.profession}
                onChange={handleChange}
                placeholder="Senior Marketing Specialist, Lead Developer, etc."
              />
            </div>
            
            <div>
              <Label htmlFor="experience">Core Expertise</Label>
              <Textarea
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="Your main professional skills and expertise..."
                rows={2}
              />
            </div>
            
            <div>
              <Label htmlFor="achievements">Key Achievements</Label>
              <Textarea
                id="achievements"
                name="achievements"
                value={formData.achievements}
                onChange={handleChange}
                placeholder="Notable professional accomplishments..."
                rows={2}
              />
            </div>
          </>
        );
      
      case 'portfolio':
        return (
          <>
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
              <Label htmlFor="profession">Professional Title</Label>
              <Input
                id="profession"
                name="profession"
                value={formData.profession}
                onChange={handleChange}
                placeholder="UX Designer, Photographer, Developer, etc."
              />
            </div>
            
            <div>
              <Label htmlFor="experience">Expertise/Specialties</Label>
              <Textarea
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="Your areas of expertise and specialization..."
                rows={2}
              />
            </div>
            
            <div>
              <Label htmlFor="interests">Personal Interests</Label>
              <Input
                id="interests"
                name="interests"
                value={formData.interests}
                onChange={handleChange}
                placeholder="Your hobbies and interests outside of work..."
              />
            </div>
          </>
        );
      
      default:
        return (
          <>
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
                placeholder="What you do"
              />
            </div>
          </>
        );
    }
  };
  
  // Get additional fields for step 2 based on platform
  const getAdditionalFields = () => {
    switch(formData.platform) {
      case 'linkedin':
        return (
          <>
            <div>
              <Label htmlFor="achievements">Key Achievements</Label>
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
              <Label htmlFor="interests">Personal Interests</Label>
              <Textarea
                id="interests"
                name="interests"
                value={formData.interests}
                onChange={handleChange}
                placeholder="Hobbies, passions, or activities outside of work..."
                rows={3}
              />
            </div>
          </>
        );
      
      case 'tinder':
        return null; // We already collected all needed fields in step 1
      
      case 'twitter':
      case 'instagram':
        return (
          <div>
            <Label htmlFor="funFacts">Fun Facts/Hashtags</Label>
            <Textarea
              id="funFacts"
              name="funFacts"
              value={formData.funFacts}
              onChange={handleChange}
              placeholder="Additional facts or hashtags you want to include..."
              rows={3}
            />
          </div>
        );
      
      case 'portfolio':
        return (
          <div>
            <Label htmlFor="achievements">Notable Projects/Works</Label>
            <Textarea
              id="achievements"
              name="achievements"
              value={formData.achievements}
              onChange={handleChange}
              placeholder="Highlight your best work and accomplishments..."
              rows={3}
            />
          </div>
        );
      
      default:
        return (
          <div>
            <Label htmlFor="interests">Additional Information</Label>
            <Textarea
              id="interests"
              name="interests"
              value={formData.interests}
              onChange={handleChange}
              placeholder="Anything else you'd like to include..."
              rows={3}
            />
          </div>
        );
    }
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
          <h3 className="text-lg font-medium mb-4">Choose your platform</h3>
          <div className="space-y-6">
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
          <h3 className="text-lg font-medium mb-4">
            Tell us about yourself for your {platformOptions.find(p => p.value === formData.platform)?.label} bio
          </h3>
          <div className="space-y-4">
            {getFormFields()}
            
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
          <h3 className="text-lg font-medium mb-4">Additional information</h3>
          <div className="space-y-6">
            {getAdditionalFields()}
            
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
                      // This would call the API again with the same parameters
                      const altBio = `I'm ${formData.name}, a dedicated ${formData.profession} with a passion for excellence and innovation.
                      With experience across various projects, I bring a unique perspective to every challenge.
                      ${formData.interests ? `When I'm not working, you can find me ${formData.interests}.` : ''}
                      I'm always looking to connect with like-minded individuals and explore new opportunities.`;
                      setGeneratedBio(altBio);
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
