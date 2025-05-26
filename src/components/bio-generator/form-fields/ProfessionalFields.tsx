
import React from 'react';
import ValidatedFormField from '../ValidatedFormField';
import { ValidationError } from '../utils/validation';

interface ProfessionalFieldsProps {
  formData: any;
  onFieldChange: (field: string, value: string) => void;
  errors: ValidationError[];
  platform: string;
}

const ProfessionalFields: React.FC<ProfessionalFieldsProps> = ({
  formData,
  onFieldChange,
  errors,
  platform
}) => {
  const getFieldError = (fieldName: string): string | undefined => {
    return errors.find(error => error.field === fieldName)?.message;
  };

  if (platform === 'linkedin') {
    return (
      <>
        <ValidatedFormField
          id="experience"
          name="experience"
          label="Experience"
          value={formData.experience || ''}
          onChange={(value) => onFieldChange('experience', value)}
          placeholder="Briefly describe your professional experience..."
          type="textarea"
          rows={3}
          maxLength={500}
          error={getFieldError('experience')}
          helpText="Key experience, skills, or background relevant to your profession"
        />
        <ValidatedFormField
          id="achievements"
          name="achievements"
          label="Key Achievements"
          value={formData.achievements || ''}
          onChange={(value) => onFieldChange('achievements', value)}
          placeholder="Awards, recognitions, or notable projects..."
          type="textarea"
          rows={3}
          maxLength={300}
          error={getFieldError('achievements')}
          helpText="Notable accomplishments, awards, or standout projects"
        />
        <ValidatedFormField
          id="interests"
          name="interests"
          label="Personal Interests"
          value={formData.interests || ''}
          onChange={(value) => onFieldChange('interests', value)}
          placeholder="Hobbies, passions, or activities outside of work..."
          type="textarea"
          rows={3}
          maxLength={200}
          error={getFieldError('interests')}
          helpText="Personal interests that show your personality"
        />
      </>
    );
  }

  // Resume and Portfolio fields
  return (
    <>
      <ValidatedFormField
        id="experience"
        name="experience"
        label="Experience"
        value={formData.experience || ''}
        onChange={(value) => onFieldChange('experience', value)}
        placeholder="Briefly describe your professional experience..."
        type="textarea"
        rows={3}
        maxLength={500}
        error={getFieldError('experience')}
        helpText="Key experience, skills, or background relevant to your profession"
      />
      <ValidatedFormField
        id="achievements"
        name="achievements"
        label="Key Achievements"
        value={formData.achievements || ''}
        onChange={(value) => onFieldChange('achievements', value)}
        placeholder="Awards, recognitions, or notable projects..."
        type="textarea"
        rows={3}
        maxLength={300}
        error={getFieldError('achievements')}
        helpText="Notable accomplishments, awards, or standout projects"
      />
      {platform === 'portfolio' && (
        <ValidatedFormField
          id="interests"
          name="interests"
          label="Personal Interests"
          value={formData.interests || ''}
          onChange={(value) => onFieldChange('interests', value)}
          placeholder="Hobbies, passions, or activities outside of work..."
          type="textarea"
          rows={3}
          maxLength={200}
          error={getFieldError('interests')}
          helpText="Personal interests that show your personality"
        />
      )}
    </>
  );
};

export default ProfessionalFields;
