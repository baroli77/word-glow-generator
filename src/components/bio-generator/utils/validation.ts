
import { BioFormData } from '../types';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export const validateBioForm = (formData: BioFormData): ValidationResult => {
  const errors: ValidationError[] = [];

  // Required fields validation
  if (!formData.name.trim()) {
    errors.push({ field: 'name', message: 'Name is required' });
  }

  if (!formData.profession.trim()) {
    errors.push({ field: 'profession', message: 'Profession is required' });
  }

  // Platform-specific validation
  switch (formData.platform) {
    case 'linkedin':
    case 'resume':
    case 'portfolio':
      const professionalData = formData as any;
      if (!professionalData.experience?.trim()) {
        errors.push({ 
          field: 'experience', 
          message: `Experience is recommended for ${formData.platform} bios` 
        });
      }
      break;
  }

  // Character limit validation for individual fields
  if (formData.name.length > 100) {
    errors.push({ field: 'name', message: 'Name should be under 100 characters' });
  }

  if (formData.profession.length > 150) {
    errors.push({ field: 'profession', message: 'Profession should be under 150 characters' });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const getFieldError = (errors: ValidationError[], fieldName: string): string | undefined => {
  return errors.find(error => error.field === fieldName)?.message;
};
