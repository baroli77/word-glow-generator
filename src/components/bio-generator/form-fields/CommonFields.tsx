
import React from 'react';
import ValidatedFormField from '../ValidatedFormField';
import { BioFormData } from '../types';
import { ValidationError } from '../utils/validation';
import { requiresProfession } from '../config/platform-config';

interface CommonFieldsProps {
  formData: BioFormData;
  onFieldChange: (field: string, value: string) => void;
  errors: ValidationError[];
}

const CommonFields: React.FC<CommonFieldsProps> = ({
  formData,
  onFieldChange,
  errors
}) => {
  const getFieldError = (fieldName: string): string | undefined => {
    return errors.find(error => error.field === fieldName)?.message;
  };

  const professionRequired = requiresProfession(formData.platform as any);

  return (
    <>
      <ValidatedFormField
        id="name"
        name="name"
        label="Your Name"
        value={formData.name}
        onChange={(value) => onFieldChange('name', value)}
        placeholder="John Doe"
        maxLength={100}
        required
        error={getFieldError('name')}
        helpText="Your full name as you want it to appear"
      />
      
      <ValidatedFormField
        id="profession"
        name="profession"
        label="Profession/Title"
        value={formData.profession}
        onChange={(value) => onFieldChange('profession', value)}
        placeholder="What you do professionally"
        maxLength={150}
        required={professionRequired}
        error={getFieldError('profession')}
        helpText="Your current role, title, or what you do professionally"
      />
    </>
  );
};

export default CommonFields;
