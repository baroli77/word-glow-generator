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
import { Switch } from "@/components/ui/switch";
import { generateWithAI, createBioPrompt } from '../services/openaiService';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const toneOptions = [
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'enthusiastic', label: 'Enthusiastic' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'confident', label: 'Confident' }
];

// Group platform options by category for better organization
const platformOptions = [
  // Professional
  { value: 'linkedin', label: 'LinkedIn', category: 'professional' },
  { value: 'resume', label: 'Resume/CV', category: 'professional' },
  { value: 'portfolio', label: 'Portfolio Website', category: 'professional' },
  
  // Social Media
  { value: 'twitter', label: 'Twitter', category: 'social' },
  { value: 'instagram', label: 'Instagram', category: 'social' },
  { value: 'facebook', label: 'Facebook', category: 'social' },
  { value: 'threads', label: 'Threads', category: 'social' },
  { value: 'tiktok', label: 'TikTok', category: 'social' },
  { value: 'snapchat', label: 'Snapchat', category: 'social' },
  
  // Content Creation
  { value: 'youtube', label: 'YouTube', category: 'content' },
  { value: 'twitch', label: 'Twitch', category: 'content' },
  { value: 'pinterest', label: 'Pinterest', category: 'content' },
  { value: 'reddit', label: 'Reddit', category: 'content' },
  
  // Dating
  { value: 'tinder', label: 'Tinder', category: 'dating' }
];

// Group platforms by category for display
const platformCategories = {
  professional: { title: 'Professional', platforms: platformOptions.filter(p => p.category === 'professional') },
  social: { title: 'Social Media', platforms: platformOptions.filter(p => p.category === 'social') },
  content: { title: 'Content Creation', platforms: platformOptions.filter(p => p.category === 'content') },
  dating: { title: 'Dating', platforms: platformOptions.filter(p => p.category === 'dating') }
};

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
    length: 'medium',
    games: '',
    channels: '',
    topics: '',
    skills: '',
    content: '',
    communities: '',
    style: '',
    niche: '',
    charLimit: false,
    customCharCount: 150,
    schedule: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleRadioChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleNext = () => {
    setStep(prev => prev + 1);
  };
  
  const handleBack = () => {
    setStep(prev => prev - 1);
  };
  
  const handleGenerate = async () => {
    setLoading(true);
    
    try {
      const prompt = createBioPrompt(formData);
      const response = await generateWithAI(prompt);
      
      if (response.error) {
        // If there's an error with the API, fall back to simulated response
        simulateGeneration();
        return;
      }
      
      let bio = response.content.trim();
      
      // Apply character limit if enabled
      if (formData.charLimit && formData.customCharCount > 0) {
        bio = bio.substring(0, formData.customCharCount);
      }
      
      setGeneratedBio(bio);
      setLoading(false);
      setStep(4); // Move to results step
    } catch (error) {
      console.error("Error generating bio:", error);
      // Fall back to simulated response
      simulateGeneration();
    }
  };
  
  // Fallback function for when API is not available
  const simulateGeneration = () => {
    setTimeout(() => {
      // This is the same as the original simulated response
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
        case 'twitch':
          simulatedBio = `${formData.name} | ${formData.profession} 
          ${formData.games ? `Playing ${formData.games}` : ''}
          ${formData.schedule ? `Stream schedule: ${formData.schedule}` : ''}
          ${formData.interests ? `${formData.interests}` : ''}
          !socials !discord #${formData.tone}streamer`;
          break;
        case 'threads':
          simulatedBio = `${formData.name} | ${formData.profession}
          ${formData.interests ? `Into ${formData.interests}` : ''}
          ${formData.topics ? `Discussing ${formData.topics}` : ''}
          Join the conversation! 🧵`;
          break;
        case 'facebook':
          simulatedBio = `${formData.name}
          ${formData.profession ? `Working as ${formData.profession}` : ''}
          ${formData.interests ? `Interests: ${formData.interests}` : ''}
          ${formData.funFacts ? `About me: ${formData.funFacts}` : ''}`;
          break;
        case 'tiktok':
          simulatedBio = `👋 ${formData.name}
          ${formData.content ? `Creating ${formData.content}` : ''}
          ${formData.interests ? `${formData.tone} about ${formData.interests}` : ''}
          👇 New videos weekly`;
          break;
        case 'youtube':
          simulatedBio = `${formData.name} - ${formData.profession}
          ${formData.content ? `${formData.content}` : ''}
          ${formData.schedule ? `Uploading ${formData.schedule}` : ''}
          ${formData.interests ? `Passionate about ${formData.interests}` : ''}
          Subscribe for more!`;
          break;
        case 'reddit':
          simulatedBio = `${formData.name} | ${formData.profession}
          ${formData.interests ? `Interests: ${formData.interests}` : ''}
          ${formData.communities ? `Active in r/${formData.communities}` : ''}
          ${formData.tone} contributor since 2023`;
          break;
        case 'snapchat':
          simulatedBio = `${formData.name} 👻
          ${formData.funFacts ? `${formData.funFacts}` : ''}
          ${formData.interests ? `Into ${formData.interests}` : ''}
          Add me for ${formData.content ? formData.content : 'daily snaps'}!`;
          break;
        case 'pinterest':
          simulatedBio = `${formData.name} | ${formData.profession}
          ${formData.niche ? `Curating ideas for ${formData.niche}` : ''}
          ${formData.interests ? `Inspired by ${formData.interests}` : ''}
          ${formData.style ? `Style: ${formData.style}` : ''}`;
          break;
        default:
          simulatedBio = `I'm ${formData.name}, a ${formData.profession}.`;
      }
      
      // Apply character limit if enabled
      if (formData.charLimit && formData.customCharCount > 0) {
        simulatedBio = simulatedBio.substring(0, formData.customCharCount);
      }
      
      setGeneratedBio(simulatedBio);
      setLoading(false);
      setStep(4); // Move to results step
    }, 2000);
  };
  
  const handleRegenerate = async () => {
    setLoading(true);
    
    try {
      const prompt = createBioPrompt(formData) + "\nPlease provide a different variation from any previous bio you've created.";
      const response = await generateWithAI(prompt);
      
      if (response.error) {
        // If there's an error with the API, fall back to simulated response
        simulateGeneration();
        return;
      }
      
      let bio = response.content.trim();
      
      // Apply character limit if enabled
      if (formData.charLimit && formData.customCharCount > 0) {
        bio = bio.substring(0, formData.customCharCount);
      }
      
      setGeneratedBio(bio);
      setLoading(false);
    } catch (error) {
      console.error("Error regenerating bio:", error);
      // Fall back to simulated regeneration
      simulateGeneration();
    }
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

      case 'twitch':
        return (
          <>
            <div>
              <Label htmlFor="name">Your Name/Username</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="GamerTag123"
              />
            </div>
            
            <div>
              <Label htmlFor="games">Games You Stream</Label>
              <Input
                id="games"
                name="games"
                value={formData.games}
                onChange={handleChange}
                placeholder="Minecraft, Valorant, Just Chatting, etc."
              />
            </div>
            
            <div>
              <Label htmlFor="schedule">Stream Schedule</Label>
              <Input
                id="schedule"
                name="schedule"
                value={formData.schedule || ""}
                onChange={handleChange}
                placeholder="Mon/Wed/Fri 8PM EST"
              />
            </div>

            <div>
              <Label htmlFor="interests">Interests/Communities</Label>
              <Input
                id="interests"
                name="interests"
                value={formData.interests}
                onChange={handleChange}
                placeholder="Speedrunning, eSports, Casual Gaming, etc."
              />
            </div>
          </>
        );

      case 'threads':
        return (
          <>
            <div>
              <Label htmlFor="name">Your Name/Handle</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="@yourname"
              />
            </div>
            
            <div>
              <Label htmlFor="profession">What You Do</Label>
              <Input
                id="profession"
                name="profession"
                value={formData.profession}
                onChange={handleChange}
                placeholder="Writer, Creator, Designer, etc."
              />
            </div>
            
            <div>
              <Label htmlFor="topics">Topics You Discuss</Label>
              <Input
                id="topics"
                name="topics"
                value={formData.topics || ""}
                onChange={handleChange}
                placeholder="Tech, Culture, Design, etc."
              />
            </div>

            <div>
              <Label htmlFor="interests">Interests</Label>
              <Input
                id="interests"
                name="interests"
                value={formData.interests}
                onChange={handleChange}
                placeholder="Art, Music, Hiking, etc."
              />
            </div>
          </>
        );

      case 'facebook':
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
              <Label htmlFor="profession">Occupation</Label>
              <Input
                id="profession"
                name="profession"
                value={formData.profession}
                onChange={handleChange}
                placeholder="Teacher, Designer, Student, etc."
              />
            </div>
            
            <div>
              <Label htmlFor="interests">Interests</Label>
              <Textarea
                id="interests"
                name="interests"
                value={formData.interests}
                onChange={handleChange}
                placeholder="Your hobbies, passions, and interests..."
                rows={2}
              />
            </div>
            
            <div>
              <Label htmlFor="funFacts">About Me</Label>
              <Textarea
                id="funFacts"
                name="funFacts"
                value={formData.funFacts}
                onChange={handleChange}
                placeholder="A brief description about yourself..."
                rows={2}
              />
            </div>
          </>
        );

      case 'tiktok':
        return (
          <>
            <div>
              <Label htmlFor="name">Your Name/Handle</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="@tiktokuser"
              />
            </div>
            
            <div>
              <Label htmlFor="content">Content Type</Label>
              <Input
                id="content"
                name="content"
                value={formData.content || ""}
                onChange={handleChange}
                placeholder="Comedy skits, Dance, Cooking tutorials, etc."
              />
            </div>
            
            <div>
              <Label htmlFor="interests">Niche/Interests</Label>
              <Input
                id="interests"
                name="interests"
                value={formData.interests}
                onChange={handleChange}
                placeholder="Fashion, Tech, Entertainment, etc."
              />
            </div>
          </>
        );

      case 'youtube':
        return (
          <>
            <div>
              <Label htmlFor="name">Channel Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Channel Name"
              />
            </div>
            
            <div>
              <Label htmlFor="profession">Creator Type</Label>
              <Input
                id="profession"
                name="profession"
                value={formData.profession}
                onChange={handleChange}
                placeholder="Vlogger, Tech Reviewer, Educator, etc."
              />
            </div>
            
            <div>
              <Label htmlFor="content">Channel Content</Label>
              <Textarea
                id="content"
                name="content"
                value={formData.content || ""}
                onChange={handleChange}
                placeholder="Describe what content you create..."
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="schedule">Upload Schedule</Label>
              <Input
                id="schedule"
                name="schedule"
                value={formData.schedule || ""}
                onChange={handleChange}
                placeholder="Weekly, Every Monday, Twice a month, etc."
              />
            </div>

            <div>
              <Label htmlFor="interests">Topics/Interests</Label>
              <Input
                id="interests"
                name="interests"
                value={formData.interests}
                onChange={handleChange}
                placeholder="Gaming, Science, DIY, etc."
              />
            </div>
          </>
        );

      case 'reddit':
        return (
          <>
            <div>
              <Label htmlFor="name">Username</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="u/username"
              />
            </div>
            
            <div>
              <Label htmlFor="profession">What You Do</Label>
              <Input
                id="profession"
                name="profession"
                value={formData.profession}
                onChange={handleChange}
                placeholder="Developer, Student, Hobbyist, etc."
              />
            </div>
            
            <div>
              <Label htmlFor="interests">Interests</Label>
              <Input
                id="interests"
                name="interests"
                value={formData.interests}
                onChange={handleChange}
                placeholder="Gaming, Science, Tech, etc."
              />
            </div>

            <div>
              <Label htmlFor="communities">Favorite Subreddits</Label>
              <Input
                id="communities"
                name="communities"
                value={formData.communities || ""}
                onChange={handleChange}
                placeholder="AskReddit, programming, gaming, etc."
              />
            </div>
          </>
        );

      case 'snapchat':
        return (
          <>
            <div>
              <Label htmlFor="name">Your Name/Username</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="snapuser123"
              />
            </div>
            
            <div>
              <Label htmlFor="funFacts">About You</Label>
              <Textarea
                id="funFacts"
                name="funFacts"
                value={formData.funFacts}
                onChange={handleChange}
                placeholder="Quick facts or description about yourself..."
                rows={2}
              />
            </div>
            
            <div>
              <Label htmlFor="interests">Interests</Label>
              <Input
                id="interests"
                name="interests"
                value={formData.interests}
                onChange={handleChange}
                placeholder="Music, Travel, Photography, etc."
              />
            </div>

            <div>
              <Label htmlFor="content">Snap Content</Label>
              <Input
                id="content"
                name="content"
                value={formData.content || ""}
                onChange={handleChange}
                placeholder="Daily life, Travel vlogs, Food, etc."
              />
            </div>
          </>
        );

      case 'pinterest':
        return (
          <>
            <div>
              <Label htmlFor="name">Your Name/Username</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name or Business Name"
              />
            </div>
            
            <div>
              <Label htmlFor="profession">What You Do</Label>
              <Input
                id="profession"
                name="profession"
                value={formData.profession}
                onChange={handleChange}
                placeholder="Designer, Blogger, Business Owner, etc."
              />
            </div>
            
            <div>
              <Label htmlFor="niche">Your Niche</Label>
              <Input
                id="niche"
                name="niche"
                value={formData.niche || ""}
                onChange={handleChange}
                placeholder="Home Decor, Fashion, DIY Projects, etc."
              />
            </div>

            <div>
              <Label htmlFor="interests">Interests</Label>
              <Input
                id="interests"
                name="interests"
                value={formData.interests}
                onChange={handleChange}
                placeholder="Art, Design, Travel, etc."
              />
            </div>

            <div>
              <Label htmlFor="style">Your Style</Label>
              <Input
                id="style"
                name="style"
                value={formData.style || ""}
                onChange={handleChange}
                placeholder="Minimalist, Bohemian, Modern, etc."
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
      case 'threads':
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
      
      case 'facebook':
        return null; // We already collected all needed fields in step 1
      
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

      case 'twitch':
        return (
          <>
            <div>
              <Label htmlFor="channels">Other Social Media</Label>
              <Input
                id="channels"
                name="channels"
                value={formData.channels || ""}
                onChange={handleChange}
                placeholder="Twitter, Instagram, Discord, etc."
              />
            </div>
            <div>
              <Label htmlFor="achievements">Achievements/Milestones</Label>
              <Textarea
                id="achievements"
                name="achievements"
                value={formData.achievements}
                onChange={handleChange}
                placeholder="Affiliate, Partner, Subscriber goals reached, etc."
                rows={2}
              />
            </div>
          </>
        );

      case 'youtube':
      case 'tiktok':
        return (
          <div>
            <Label htmlFor="achievements">Channel Achievements</Label>
            <Textarea
              id="achievements"
              name="achievements"
              value={formData.achievements}
              onChange={handleChange}
              placeholder="100K Subscribers, Viral videos, Awards, etc."
              rows={2}
            />
          </div>
        );

      case 'reddit':
      case 'snapchat':
      case 'pinterest':
        return (
          <div>
            <Label htmlFor="funFacts">Additional Information</Label>
            <Textarea
              id="funFacts"
              name="funFacts"
              value={formData.funFacts}
              onChange={handleChange}
              placeholder="Any other information you want to include..."
              rows={2}
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

  const charCountOptions = [
    { value: '100', label: '100' },
    { value: '150', label: '150' },
    { value: '250', label: '250' },
    { value: '500', label: '500' },
    { value: 'custom', label: 'Custom' }
  ];
  
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
              <Label className="mb-4 block">Select the platform for your bio</Label>
              
              {/* Organized platform selection by categories */}
              {Object.entries(platformCategories).map(([categoryKey, category]) => (
                <div key={categoryKey} className="mb-6">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">{category.title}</h4>
                  <RadioGroup 
                    defaultValue={formData.platform} 
                    onValueChange={(value) => handleRadioChange('platform', value)}
                    className="flex flex-wrap gap-2"
                  >
                    {category.platforms.map((option) => (
                      <div key={option.value} className="flex items-center">
                        <RadioGroupItem value={option.value} id={`platform-${option.value}`} className="peer sr-only" />
                        <Label
                          htmlFor={`platform-${option.value}`}
                          className="px-3 py-1.5 text-sm rounded-full border cursor-pointer bg-background hover:bg-muted peer-data-[state=checked]:bg-wordcraft-purple peer-data-[state=checked]:text-white transition-colors"
                        >
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              ))}
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

            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="charLimit" className="font-medium">Character Limit</Label>
                <Switch
                  id="charLimit"
                  checked={formData.charLimit}
                  onCheckedChange={(checked) => handleSwitchChange('charLimit', checked)}
                />
              </div>
              
              {formData.charLimit && (
                <div className="mt-4 space-y-2">
                  <Label htmlFor="charCountSelect">Character Count</Label>
                  <div className="flex gap-4">
                    <Select 
                      value={formData.customCharCount === 100 ? '100' : 
                            formData.customCharCount === 150 ? '150' :
                            formData.customCharCount === 250 ? '250' :
                            formData.customCharCount === 500 ? '500' : 'custom'}
                      onValueChange={(value) => {
                        if (value === 'custom') {
                          // Keep the current custom value if switching to custom
                          return;
                        }
                        setFormData(prev => ({ ...prev, customCharCount: parseInt(value) }));
                      }}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select limit" />
                      </SelectTrigger>
                      <SelectContent>
                        {charCountOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Input
                      type="number"
                      value={formData.customCharCount}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        customCharCount: parseInt(e.target.value) || 0
                      }))}
                      placeholder="Custom character count"
                      min="1"
                      className="w-[150px]"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Character limits: Twitter (280), Instagram (150), TikTok (80), LinkedIn (2000)
                  </p>
                </div>
              )}
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
                  {formData.charLimit && (
                    <div className="mt-4 text-sm text-muted-foreground">
                      Character count: {generatedBio.length} / {formData.customCharCount}
                    </div>
                  )}
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
              <Textarea
                value={generatedBio}
                onChange={(e) => setGeneratedBio(e.target.value)}
                rows={8}
                className="mb-4"
              />
              
              {formData.charLimit && (
                <div className="mb-4 flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Character count: {generatedBio.length} / {formData.customCharCount}
                  </div>
                  {generatedBio.length > formData.customCharCount && (
                    <div className="text-sm text-red-500">
                      Exceeds character limit by {generatedBio.length - formData.customCharCount} characters
                    </div>
                  )}
                </div>
              )}
              
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
