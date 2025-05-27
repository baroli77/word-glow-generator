
import { PlatformType, PlatformCategory } from '../types';
import { 
  Linkedin, 
  FileText, 
  Briefcase, 
  Twitter, 
  Instagram, 
  Facebook, 
  MessageSquare,
  Music,
  Camera,
  Youtube,
  Gamepad2,
  Image,
  MessageCircle,
  Heart,
  Users,
  Lock
} from 'lucide-react';

export interface PlatformConfig {
  category: PlatformCategory;
  requiresProfession: boolean;
  defaultCharLimit: number;
  fields: string[];
  isPremium: boolean; // New field for access control
}

export const platformConfigs: Record<PlatformType, PlatformConfig> = {
  linkedin: {
    category: 'professional',
    requiresProfession: true,
    defaultCharLimit: 300,
    fields: ['name', 'profession', 'experience', 'achievements', 'interests'],
    isPremium: true
  },
  resume: {
    category: 'professional',
    requiresProfession: true,
    defaultCharLimit: 200,
    fields: ['name', 'profession', 'experience', 'achievements'],
    isPremium: true
  },
  portfolio: {
    category: 'professional',
    requiresProfession: true,
    defaultCharLimit: 250,
    fields: ['name', 'profession', 'experience', 'achievements', 'interests'],
    isPremium: true
  },
  twitter: {
    category: 'social',
    requiresProfession: false,
    defaultCharLimit: 160,
    fields: ['name', 'interests', 'funFacts'],
    isPremium: false
  },
  instagram: {
    category: 'social',
    requiresProfession: false,
    defaultCharLimit: 150,
    fields: ['name', 'interests', 'funFacts'],
    isPremium: false
  },
  facebook: {
    category: 'social',
    requiresProfession: false,
    defaultCharLimit: 200,
    fields: ['name', 'interests', 'funFacts', 'communities'],
    isPremium: false
  },
  threads: {
    category: 'social',
    requiresProfession: false,
    defaultCharLimit: 150,
    fields: ['name', 'interests', 'funFacts'],
    isPremium: true
  },
  tiktok: {
    category: 'content',
    requiresProfession: false,
    defaultCharLimit: 80,
    fields: ['name', 'content', 'interests'],
    isPremium: false
  },
  snapchat: {
    category: 'social',
    requiresProfession: false,
    defaultCharLimit: 100,
    fields: ['name', 'interests', 'funFacts'],
    isPremium: true
  },
  youtube: {
    category: 'content',
    requiresProfession: false,
    defaultCharLimit: 1000,
    fields: ['name', 'content', 'interests', 'schedule'],
    isPremium: true
  },
  twitch: {
    category: 'content',
    requiresProfession: false,
    defaultCharLimit: 300,
    fields: ['name', 'games', 'schedule', 'interests'],
    isPremium: true
  },
  pinterest: {
    category: 'content',
    requiresProfession: false,
    defaultCharLimit: 160,
    fields: ['name', 'interests', 'niche', 'style'],
    isPremium: true
  },
  reddit: {
    category: 'content',
    requiresProfession: false,
    defaultCharLimit: 200,
    fields: ['name', 'interests', 'communities'],
    isPremium: true
  },
  tinder: {
    category: 'dating',
    requiresProfession: false,
    defaultCharLimit: 500,
    fields: ['name', 'interests', 'funFacts', 'lookingFor'],
    isPremium: true
  },
  pof: {
    category: 'dating',
    requiresProfession: false,
    defaultCharLimit: 1000,
    fields: ['name', 'interests', 'funFacts', 'lookingFor'],
    isPremium: true
  }
};

export const platforms = [
  {
    id: 'linkedin' as PlatformType,
    name: 'LinkedIn',
    description: 'Professional networking platform for career growth',
    icon: Linkedin,
    charLimit: 300,
    isPremium: true
  },
  {
    id: 'resume' as PlatformType,
    name: 'Resume',
    description: 'Professional summary for your CV or resume',
    icon: FileText,
    charLimit: 200,
    isPremium: true
  },
  {
    id: 'portfolio' as PlatformType,
    name: 'Portfolio',
    description: 'Personal portfolio or professional website',
    icon: Briefcase,
    charLimit: 250,
    isPremium: true
  },
  {
    id: 'twitter' as PlatformType,
    name: 'Twitter/X',
    description: 'Microblogging platform for quick updates',
    icon: Twitter,
    charLimit: 160,
    isPremium: false
  },
  {
    id: 'instagram' as PlatformType,
    name: 'Instagram',
    description: 'Photo and video sharing social platform',
    icon: Instagram,
    charLimit: 150,
    isPremium: false
  },
  {
    id: 'facebook' as PlatformType,
    name: 'Facebook',
    description: 'Social networking platform for personal connections',
    icon: Facebook,
    charLimit: 200,
    isPremium: false
  },
  {
    id: 'threads' as PlatformType,
    name: 'Threads',
    description: 'Text-based conversation platform by Meta',
    icon: MessageSquare,
    charLimit: 150,
    isPremium: true
  },
  {
    id: 'tiktok' as PlatformType,
    name: 'TikTok',
    description: 'Short-form video content platform',
    icon: Music,
    charLimit: 80,
    isPremium: false
  },
  {
    id: 'snapchat' as PlatformType,
    name: 'Snapchat',
    description: 'Multimedia messaging social platform',
    icon: Camera,
    charLimit: 100,
    isPremium: true
  },
  {
    id: 'youtube' as PlatformType,
    name: 'YouTube',
    description: 'Video sharing and content creation platform',
    icon: Youtube,
    charLimit: 1000,
    isPremium: true
  },
  {
    id: 'twitch' as PlatformType,
    name: 'Twitch',
    description: 'Live streaming platform for gamers and creators',
    icon: Gamepad2,
    charLimit: 300,
    isPremium: true
  },
  {
    id: 'pinterest' as PlatformType,
    name: 'Pinterest',
    description: 'Visual discovery and inspiration platform',
    icon: Image,
    charLimit: 160,
    isPremium: true
  },
  {
    id: 'reddit' as PlatformType,
    name: 'Reddit',
    description: 'Community-driven discussion platform',
    icon: MessageCircle,
    charLimit: 200,
    isPremium: true
  },
  {
    id: 'tinder' as PlatformType,
    name: 'Tinder',
    description: 'Dating app for meeting new people',
    icon: Heart,
    charLimit: 500,
    isPremium: true
  },
  {
    id: 'pof' as PlatformType,
    name: 'Plenty of Fish',
    description: 'Dating platform for meaningful connections',
    icon: Users,
    charLimit: 1000,
    isPremium: true
  }
];

export const getPlatformConfig = (platform: PlatformType): PlatformConfig => {
  return platformConfigs[platform];
};

export const getPlatformCategory = (platform: PlatformType): PlatformCategory => {
  return platformConfigs[platform].category;
};

export const requiresProfession = (platform: PlatformType): boolean => {
  return platformConfigs[platform].requiresProfession;
};

export const isPremiumPlatform = (platform: PlatformType): boolean => {
  return platformConfigs[platform].isPremium;
};
