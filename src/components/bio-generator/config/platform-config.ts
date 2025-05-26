
import { PlatformType, PlatformCategory } from '../types';

export interface PlatformConfig {
  category: PlatformCategory;
  requiresProfession: boolean;
  defaultCharLimit: number;
  fields: string[];
}

export const platformConfigs: Record<PlatformType, PlatformConfig> = {
  linkedin: {
    category: 'professional',
    requiresProfession: true,
    defaultCharLimit: 300,
    fields: ['name', 'profession', 'experience', 'achievements', 'interests']
  },
  resume: {
    category: 'professional',
    requiresProfession: true,
    defaultCharLimit: 200,
    fields: ['name', 'profession', 'experience', 'achievements']
  },
  portfolio: {
    category: 'professional',
    requiresProfession: true,
    defaultCharLimit: 250,
    fields: ['name', 'profession', 'experience', 'achievements', 'interests']
  },
  twitter: {
    category: 'social',
    requiresProfession: false,
    defaultCharLimit: 160,
    fields: ['name', 'interests', 'funFacts']
  },
  instagram: {
    category: 'social',
    requiresProfession: false,
    defaultCharLimit: 150,
    fields: ['name', 'interests', 'funFacts']
  },
  facebook: {
    category: 'social',
    requiresProfession: false,
    defaultCharLimit: 200,
    fields: ['name', 'interests', 'funFacts', 'communities']
  },
  threads: {
    category: 'social',
    requiresProfession: false,
    defaultCharLimit: 150,
    fields: ['name', 'interests', 'funFacts']
  },
  tiktok: {
    category: 'content',
    requiresProfession: false,
    defaultCharLimit: 80,
    fields: ['name', 'content', 'interests']
  },
  snapchat: {
    category: 'social',
    requiresProfession: false,
    defaultCharLimit: 100,
    fields: ['name', 'interests', 'funFacts']
  },
  youtube: {
    category: 'content',
    requiresProfession: false,
    defaultCharLimit: 1000,
    fields: ['name', 'content', 'interests', 'schedule']
  },
  twitch: {
    category: 'content',
    requiresProfession: false,
    defaultCharLimit: 300,
    fields: ['name', 'games', 'schedule', 'interests']
  },
  pinterest: {
    category: 'content',
    requiresProfession: false,
    defaultCharLimit: 160,
    fields: ['name', 'interests', 'niche', 'style']
  },
  reddit: {
    category: 'content',
    requiresProfession: false,
    defaultCharLimit: 200,
    fields: ['name', 'interests', 'communities']
  },
  tinder: {
    category: 'dating',
    requiresProfession: false,
    defaultCharLimit: 500,
    fields: ['name', 'interests', 'funFacts', 'lookingFor']
  },
  pof: {
    category: 'dating',
    requiresProfession: false,
    defaultCharLimit: 1000,
    fields: ['name', 'interests', 'funFacts', 'lookingFor']
  }
};

export const getPlatformConfig = (platform: PlatformType): PlatformConfig => {
  return platformConfigs[platform];
};

export const getPlatformCategory = (platform: PlatformType): PlatformCategory => {
  return platformConfigs[platform].category;
};

export const requiresProfession = (platform: PlatformType): boolean => {
  return platformConfigs[platform].requiresProfession;
};
