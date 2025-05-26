
import React from 'react';
import { BioFormData, platformOptions } from './types';
import { ValidationError } from './utils/validation';
import { getPlatformCategory } from './config/platform-config';
import CommonFields from './form-fields/CommonFields';
import ProfessionalFields from './form-fields/ProfessionalFields';
import SocialFields from './form-fields/SocialFields';
import ContentFields from './form-fields/ContentFields';
import DatingFields from './form-fields/DatingFields';

interface FormFieldsRendererProps {
  formData: BioFormData;
  onFieldChange: (field: string, value: string) => void;
  errors?: ValidationError[];
}

const FormFieldsRenderer: React.FC<FormFieldsRendererProps> = ({
  formData,
  onFieldChange,
  errors = []
}) => {
  const platformLabel = platformOptions.find(p => p.value === formData.platform)?.label;
  const category = getPlatformCategory(formData.platform as any);

  const renderPlatformSpecificFields = () => {
    switch(category) {
      case 'professional':
        return (
          <ProfessionalFields
            formData={formData}
            onFieldChange={onFieldChange}
            errors={errors}
            platform={formData.platform}
          />
        );
      
      case 'social':
        return (
          <SocialFields
            formData={formData}
            onFieldChange={onFieldChange}
            errors={errors}
          />
        );
      
      case 'content':
        return (
          <ContentFields
            formData={formData}
            onFieldChange={onFieldChange}
            errors={errors}
            platform={formData.platform}
          />
        );
      
      case 'dating':
        return (
          <DatingFields
            formData={formData}
            onFieldChange={onFieldChange}
            errors={errors}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="animate-fade-in">
      <h3 className="text-lg font-medium mb-4">
        Tell us about yourself for your {platformLabel} bio
      </h3>
      <div className="space-y-6">
        <CommonFields
          formData={formData}
          onFieldChange={onFieldChange}
          errors={errors}
        />
        {renderPlatformSpecificFields()}
      </div>
    </div>
  );
};

export default FormFieldsRenderer;
