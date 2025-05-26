
import { useState, useCallback } from 'react';
import { BioFormData } from '../types';
import { getPlatformConfig } from '../config/platform-config';

const createInitialFormData = (): BioFormData => ({
  name: '',
  profession: '',
  tone: 'professional',
  platform: 'linkedin',
  charLimit: false,
  customCharCount: 150,
  experience: '',
  achievements: '',
  interests: ''
} as BioFormData);

export const useBioForm = () => {
  const [formData, setFormData] = useState<BioFormData>(createInitialFormData());

  const updateField = useCallback((field: string, value: string | boolean | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const updatePlatform = useCallback((platform: BioFormData['platform']) => {
    const config = getPlatformConfig(platform as any);
    
    const baseData: Partial<BioFormData> = {
      name: formData.name,
      profession: config.requiresProfession ? formData.profession : 'Content Creator',
      tone: formData.tone,
      charLimit: formData.charLimit,
      customCharCount: formData.customCharCount || config.defaultCharLimit,
      platform
    };

    // Preserve relevant fields when switching between similar platforms
    const preservedData: Record<string, any> = {};
    
    if ('interests' in formData && formData.interests) {
      preservedData.interests = formData.interests;
    }
    
    if (config.fields.includes('experience') && 'experience' in formData && formData.experience) {
      preservedData.experience = formData.experience;
    }
    
    if (config.fields.includes('achievements') && 'achievements' in formData && formData.achievements) {
      preservedData.achievements = formData.achievements;
    }

    if (config.fields.includes('funFacts') && 'funFacts' in formData && formData.funFacts) {
      preservedData.funFacts = formData.funFacts;
    }
    
    if (config.fields.includes('lookingFor') && 'lookingFor' in formData && formData.lookingFor) {
      preservedData.lookingFor = formData.lookingFor;
    }

    if (config.fields.includes('content') && 'content' in formData && formData.content) {
      preservedData.content = formData.content;
    }

    setFormData({ ...baseData, ...preservedData } as BioFormData);
  }, [formData]);

  const resetForm = useCallback(() => {
    setFormData(createInitialFormData());
  }, []);

  return {
    formData,
    updateField,
    updatePlatform,
    resetForm
  };
};
