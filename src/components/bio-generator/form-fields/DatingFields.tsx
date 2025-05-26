
import React from 'react';
import ValidatedFormField from '../ValidatedFormField';
import { ValidationError } from '../utils/validation';

interface DatingFieldsProps {
  formData: any;
  onFieldChange: (field: string, value: string) => void;
  errors: ValidationError[];
}

const DatingFields: React.FC<DatingFieldsProps> = ({
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
        label="Interests/Hobbies"
        value={formData.interests || ''}
        onChange={(value) => onFieldChange('interests', value)}
        placeholder="hiking, movies, cooking, etc."
        maxLength={100}
        error={getFieldError('interests')}
        helpText="Activities and hobbies you enjoy"
      />
      <ValidatedFormField
        id="funFacts"
        name="funFacts"
        label="Fun Facts About You"
        value={formData.funFacts || ''}
        onChange={(value) => onFieldChange('funFacts', value)}
        placeholder="Something unique or interesting about you..."
        type="textarea"
        rows={2}
        maxLength={150}
        error={getFieldError('funFacts')}
        helpText="What makes you unique or interesting?"
      />
      <ValidatedFormField
        id="lookingFor"
        name="lookingFor"
        label="What You're Looking For"
        value={formData.lookingFor || ''}
        onChange={(value) => onFieldChange('lookingFor', value)}
        placeholder="Describe what kind of relationship you're seeking..."
        type="textarea"
        rows={2}
        maxLength={200}
        error={getFieldError('lookingFor')}
        helpText="What type of connection or relationship are you hoping to find?"
      />
    </>
  );
};

export default DatingFields;
