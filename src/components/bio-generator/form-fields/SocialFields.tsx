
import React from 'react';
import ValidatedFormField from '../ValidatedFormField';
import { ValidationError } from '../utils/validation';

interface SocialFieldsProps {
  formData: any;
  onFieldChange: (field: string, value: string) => void;
  errors: ValidationError[];
}

const SocialFields: React.FC<SocialFieldsProps> = ({
  formData,
  onFieldChange,
  errors
}) => {
  const getFieldError = (fieldName: string): string | undefined => {
    return errors.find(error => error.field === fieldName)?.message;
  };

  return (
    <>
      <ValidatedFormField
        id="interests"
        name="interests"
        label="Interests/Topics"
        value={formData.interests || ''}
        onChange={(value) => onFieldChange('interests', value)}
        placeholder="design, travel, food, technology, etc."
        maxLength={100}
        error={getFieldError('interests')}
        helpText="Topics you're passionate about or frequently discuss"
      />
      <ValidatedFormField
        id="funFacts"
        name="funFacts"
        label="Fun Facts/Quirks"
        value={formData.funFacts || ''}
        onChange={(value) => onFieldChange('funFacts', value)}
        placeholder="Something unique or interesting about you..."
        type="textarea"
        rows={3}
        maxLength={150}
        error={getFieldError('funFacts')}
        helpText="Quirky facts, emojis, or personal details that make you memorable"
      />
    </>
  );
};

export default SocialFields;
