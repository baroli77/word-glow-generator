
export interface BaseBioFormData {
  name: string;
  profession: string;
  tone: 'professional' | 'casual' | 'enthusiastic' | 'friendly' | 'confident' | 'funny';
  platform: string;
  charLimit: boolean;
  customCharCount: number;
}

export interface LinkedInFormData extends BaseBioFormData {
  platform: 'linkedin';
  experience: string;
  achievements: string;
  interests: string;
}

export interface SocialMediaFormData extends BaseBioFormData {
  platform: 'twitter' | 'instagram' | 'threads';
  interests: string;
  funFacts?: string;
}

export interface DatingFormData extends BaseBioFormData {
  platform: 'tinder' | 'pof';
  interests: string;
  funFacts: string;
  lookingFor: string;
}

export interface ResumeFormData extends BaseBioFormData {
  platform: 'resume';
  experience: string;
  achievements: string;
}

export interface PortfolioFormData extends BaseBioFormData {
  platform: 'portfolio';
  experience: string;
  achievements: string;
  interests: string;
}

export interface StreamingFormData extends BaseBioFormData {
  platform: 'twitch';
  games: string;
  schedule: string;
  interests: string;
  channels?: string;
  achievements?: string;
}

export interface ContentCreatorFormData extends BaseBioFormData {
  platform: 'youtube' | 'tiktok';
  content: string;
  schedule?: string;
  interests: string;
  achievements?: string;
}

export interface CommunityFormData extends BaseBioFormData {
  platform: 'reddit' | 'facebook' | 'snapchat' | 'pinterest';
  interests: string;
  funFacts?: string;
  communities?: string;
  niche?: string;
  style?: string;
}

export type BioFormData = 
  | LinkedInFormData 
  | SocialMediaFormData 
  | DatingFormData 
  | ResumeFormData 
  | PortfolioFormData 
  | StreamingFormData 
  | ContentCreatorFormData 
  | CommunityFormData;

export const toneOptions = [
  { value: 'professional' as const, label: 'Professional' },
  { value: 'casual' as const, label: 'Casual' },
  { value: 'enthusiastic' as const, label: 'Enthusiastic' },
  { value: 'friendly' as const, label: 'Friendly' },
  { value: 'confident' as const, label: 'Confident' },
  { value: 'funny' as const, label: 'Funny' }
];

export const platformOptions = [
  { value: 'linkedin', label: 'LinkedIn', category: 'professional' },
  { value: 'resume', label: 'Resume/CV', category: 'professional' },
  { value: 'portfolio', label: 'Portfolio Website', category: 'professional' },
  { value: 'twitter', label: 'Twitter', category: 'social' },
  { value: 'instagram', label: 'Instagram', category: 'social' },
  { value: 'facebook', label: 'Facebook', category: 'social' },
  { value: 'threads', label: 'Threads', category: 'social' },
  { value: 'tiktok', label: 'TikTok', category: 'social' },
  { value: 'snapchat', label: 'Snapchat', category: 'social' },
  { value: 'youtube', label: 'YouTube', category: 'content' },
  { value: 'twitch', label: 'Twitch', category: 'content' },
  { value: 'pinterest', label: 'Pinterest', category: 'content' },
  { value: 'reddit', label: 'Reddit', category: 'content' },
  { value: 'tinder', label: 'Tinder', category: 'dating' },
  { value: 'pof', label: 'PlentyOfFish', category: 'dating' }
];

export type PlatformCategory = 'professional' | 'social' | 'content' | 'dating';
export type ToneType = 'professional' | 'casual' | 'enthusiastic' | 'friendly' | 'confident' | 'funny';
export type PlatformType = 'linkedin' | 'resume' | 'portfolio' | 'twitter' | 'instagram' | 'facebook' | 'threads' | 'tiktok' | 'snapchat' | 'youtube' | 'twitch' | 'pinterest' | 'reddit' | 'tinder' | 'pof';
