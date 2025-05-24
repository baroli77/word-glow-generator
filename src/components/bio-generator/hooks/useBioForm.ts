
import { useState, useCallback } from 'react';
import { BioFormData } from '../types';

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

  const updatePlatform = useCallback((platform: string) => {
    const baseData = {
      name: formData.name,
      profession: formData.profession,
      tone: formData.tone,
      charLimit: formData.charLimit,
      customCharCount: formData.customCharCount,
      platform
    };

    // Preserve relevant fields when switching between similar platforms
    const preservedData: Record<string, any> = {};
    
    // Type-safe property access using 'in' operator
    if ('interests' in formData && formData.interests) {
      preservedData.interests = formData.interests;
    }
    
    if (['linkedin', 'resume', 'portfolio'].includes(platform)) {
      if ('experience' in formData && formData.experience) {
        preservedData.experience = formData.experience;
      }
      if ('achievements' in formData && formData.achievements) {
        preservedData.achievements = formData.achievements;
      }
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
