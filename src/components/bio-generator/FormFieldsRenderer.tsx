
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { BioFormData, platformOptions } from './types';

interface FormFieldsRendererProps {
  formData: BioFormData;
  onFieldChange: (field: string, value: string) => void;
}

const FormFieldsRenderer: React.FC<FormFieldsRendererProps> = ({
  formData,
  onFieldChange
}) => {
  const platformLabel = platformOptions.find(p => p.value === formData.platform)?.label;

  const renderCommonFields = () => (
    <>
      <div>
        <Label htmlFor="name">Your Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={(e) => onFieldChange('name', e.target.value)}
          placeholder="John Doe"
          aria-describedby="name-help"
        />
      </div>
      
      <div>
        <Label htmlFor="profession">Profession/Title</Label>
        <Input
          id="profession"
          name="profession"
          value={formData.profession}
          onChange={(e) => onFieldChange('profession', e.target.value)}
          placeholder="What you do"
          aria-describedby="profession-help"
        />
      </div>
    </>
  );

  const renderPlatformSpecificFields = () => {
    switch(formData.platform) {
      case 'linkedin':
        const linkedInData = formData as any;
        return (
          <>
            <div>
              <Label htmlFor="experience">Experience</Label>
              <Textarea
                id="experience"
                name="experience"
                value={linkedInData.experience || ''}
                onChange={(e) => onFieldChange('experience', e.target.value)}
                placeholder="Briefly describe your professional experience..."
                rows={3}
                aria-describedby="experience-help"
              />
            </div>
            <div>
              <Label htmlFor="achievements">Key Achievements</Label>
              <Textarea
                id="achievements"
                name="achievements"
                value={linkedInData.achievements || ''}
                onChange={(e) => onFieldChange('achievements', e.target.value)}
                placeholder="Awards, recognitions, or notable projects..."
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="interests">Personal Interests</Label>
              <Textarea
                id="interests"
                name="interests"
                value={linkedInData.interests || ''}
                onChange={(e) => onFieldChange('interests', e.target.value)}
                placeholder="Hobbies, passions, or activities outside of work..."
                rows={3}
              />
            </div>
          </>
        );
      
      case 'twitter':
      case 'instagram':
      case 'threads':
        const socialData = formData as any;
        return (
          <>
            <div>
              <Label htmlFor="interests">Interests/Topics</Label>
              <Input
                id="interests"
                name="interests"
                value={socialData.interests || ''}
                onChange={(e) => onFieldChange('interests', e.target.value)}
                placeholder="design, travel, food, technology, etc."
              />
            </div>
            <div>
              <Label htmlFor="funFacts">Fun Facts/Hashtags</Label>
              <Textarea
                id="funFacts"
                name="funFacts"
                value={socialData.funFacts || ''}
                onChange={(e) => onFieldChange('funFacts', e.target.value)}
                placeholder="Additional facts or hashtags you want to include..."
                rows={3}
              />
            </div>
          </>
        );
      
      case 'tinder':
      case 'pof':
        const datingData = formData as any;
        return (
          <>
            <div>
              <Label htmlFor="interests">Interests/Hobbies</Label>
              <Input
                id="interests"
                name="interests"
                value={datingData.interests || ''}
                onChange={(e) => onFieldChange('interests', e.target.value)}
                placeholder="hiking, movies, cooking, etc."
              />
            </div>
            <div>
              <Label htmlFor="funFacts">Fun Facts About You</Label>
              <Textarea
                id="funFacts"
                name="funFacts"
                value={datingData.funFacts || ''}
                onChange={(e) => onFieldChange('funFacts', e.target.value)}
                placeholder="Something unique or interesting about you..."
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="lookingFor">What You're Looking For</Label>
              <Textarea
                id="lookingFor"
                name="lookingFor"
                value={datingData.lookingFor || ''}
                onChange={(e) => onFieldChange('lookingFor', e.target.value)}
                placeholder="Describe what kind of relationship you're seeking..."
                rows={2}
              />
            </div>
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
      <div className="space-y-4">
        {renderCommonFields()}
        {renderPlatformSpecificFields()}
      </div>
    </div>
  );
};

export default FormFieldsRenderer;
