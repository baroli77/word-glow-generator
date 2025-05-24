
import React from 'react';
import { BioFormData, platformOptions } from './types';
import { ValidationError } from './utils/validation';
import ValidatedFormField from './ValidatedFormField';

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

  const getFieldError = (fieldName: string): string | undefined => {
    return errors.find(error => error.field === fieldName)?.message;
  };

  const renderCommonFields = () => (
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
        placeholder="What you do"
        maxLength={150}
        required
        error={getFieldError('profession')}
        helpText="Your current role, title, or what you do professionally"
      />
    </>
  );

  const renderPlatformSpecificFields = () => {
    switch(formData.platform) {
      case 'linkedin':
        const linkedInData = formData as any;
        return (
          <>
            <ValidatedFormField
              id="experience"
              name="experience"
              label="Experience"
              value={linkedInData.experience || ''}
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
              value={linkedInData.achievements || ''}
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
              value={linkedInData.interests || ''}
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
      
      case 'twitter':
      case 'instagram':
      case 'threads':
        const socialData = formData as any;
        return (
          <>
            <ValidatedFormField
              id="interests"
              name="interests"
              label="Interests/Topics"
              value={socialData.interests || ''}
              onChange={(value) => onFieldChange('interests', value)}
              placeholder="design, travel, food, technology, etc."
              maxLength={100}
              error={getFieldError('interests')}
              helpText="Topics you're passionate about or frequently discuss"
            />
            <ValidatedFormField
              id="funFacts"
              name="funFacts"
              label="Fun Facts/Hashtags"
              value={socialData.funFacts || ''}
              onChange={(value) => onFieldChange('funFacts', value)}
              placeholder="Additional facts or hashtags you want to include..."
              type="textarea"
              rows={3}
              maxLength={150}
              error={getFieldError('funFacts')}
              helpText="Quirky facts, emojis, or hashtags that represent you"
            />
          </>
        );
      
      case 'tinder':
      case 'pof':
        const datingData = formData as any;
        return (
          <>
            <ValidatedFormField
              id="interests"
              name="interests"
              label="Interests/Hobbies"
              value={datingData.interests || ''}
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
              value={datingData.funFacts || ''}
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
              value={datingData.lookingFor || ''}
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
        {renderCommonFields()}
        {renderPlatformSpecificFields()}
      </div>
    </div>
  );
};

export default FormFieldsRenderer;
