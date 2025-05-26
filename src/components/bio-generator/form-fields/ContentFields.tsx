
import React from 'react';
import ValidatedFormField from '../ValidatedFormField';
import { ValidationError } from '../utils/validation';

interface ContentFieldsProps {
  formData: any;
  onFieldChange: (field: string, value: string) => void;
  errors: ValidationError[];
  platform: string;
}

const ContentFields: React.FC<ContentFieldsProps> = ({
  formData,
  onFieldChange,
  errors,
  platform
}) => {
  const getFieldError = (fieldName: string): string | undefined => {
    return errors.find(error => error.field === fieldName)?.message;
  };

  if (['youtube', 'tiktok'].includes(platform)) {
    return (
      <>
        <ValidatedFormField
          id="content"
          name="content"
          label="Content Type"
          value={formData.content || ''}
          onChange={(value) => onFieldChange('content', value)}
          placeholder="gaming, tutorials, comedy, lifestyle, etc."
          maxLength={100}
          error={getFieldError('content')}
          helpText="What type of content do you create?"
        />
        <ValidatedFormField
          id="interests"
          name="interests"
          label="Topics/Niche"
          value={formData.interests || ''}
          onChange={(value) => onFieldChange('interests', value)}
          placeholder="Your main topics or niche areas..."
          type="textarea"
          rows={2}
          maxLength={150}
          error={getFieldError('interests')}
          helpText="What themes or topics do you focus on?"
        />
      </>
    );
  }

  // Default content fields for other platforms
  return (
    <ValidatedFormField
      id="interests"
      name="interests"
      label="Interests/About"
      value={formData.interests || ''}
      onChange={(value) => onFieldChange('interests', value)}
      placeholder="Tell us about yourself..."
      type="textarea"
      rows={3}
      maxLength={200}
      error={getFieldError('interests')}
      helpText="Share what makes you unique"
    />
  );
};

export default ContentFields;
