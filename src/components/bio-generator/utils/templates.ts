
import { BioFormData } from '../types';

export interface BioTemplate {
  id: string;
  name: string;
  platform: string;
  category: string;
  template: string;
  example: string;
}

export const bioTemplates: BioTemplate[] = [
  {
    id: 'linkedin-professional',
    name: 'Professional Leader',
    platform: 'linkedin',
    category: 'Professional',
    template: '{profession} with {experience} years of experience in {industry}. Passionate about {interests} and driving {achievements}.',
    example: 'Software Engineer with 5+ years of experience in fintech. Passionate about AI and driving innovative solutions that impact millions of users.'
  },
  {
    id: 'linkedin-entrepreneur',
    name: 'Entrepreneur',
    platform: 'linkedin',
    category: 'Professional',
    template: 'Founder & {profession} | Building {company} to {mission} | {achievements}',
    example: 'Founder & CEO | Building TechCorp to revolutionize healthcare | Featured in Forbes 30 Under 30'
  },
  {
    id: 'twitter-creator',
    name: 'Content Creator',
    platform: 'twitter',
    category: 'Social',
    template: '{profession} sharing insights about {interests} ✨ {funFacts} 📍 {location}',
    example: 'Digital Marketing sharing insights about growth strategies ✨ Coffee enthusiast & dog parent 📍 San Francisco'
  },
  {
    id: 'instagram-lifestyle',
    name: 'Lifestyle Influencer',
    platform: 'instagram',
    category: 'Social',
    template: '✨ {profession} ✨\n{interests}\n📍 {location}\n{funFacts}',
    example: '✨ Travel Photographer ✨\nCapturing moments around the world\n📍 Currently in Bali\n☕ Coffee addict | 📸 Fujifilm shooter'
  }
];

export const getTemplatesForPlatform = (platform: string): BioTemplate[] => {
  return bioTemplates.filter(template => template.platform === platform);
};

export const generateFromTemplate = (template: BioTemplate, formData: BioFormData): string => {
  let result = template.template;
  
  // Replace placeholders with form data
  result = result.replace('{profession}', formData.profession);
  result = result.replace('{name}', formData.name);
  
  // Platform-specific replacements
  if ('experience' in formData) {
    result = result.replace('{experience}', formData.experience || '');
  }
  if ('achievements' in formData) {
    result = result.replace('{achievements}', formData.achievements || '');
  }
  if ('interests' in formData) {
    result = result.replace('{interests}', formData.interests || '');
  }
  if ('funFacts' in formData) {
    result = result.replace('{funFacts}', formData.funFacts || '');
  }
  
  // Clean up any remaining placeholders
  result = result.replace(/\{[^}]+\}/g, '');
  
  return result.trim();
};
