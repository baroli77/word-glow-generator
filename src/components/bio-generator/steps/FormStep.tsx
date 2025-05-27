
import React from 'react';
import { Button } from "@/components/ui/button";
import FormFieldsRenderer from '../FormFieldsRenderer';
import { BioFormData } from '../types';
import { ValidationError } from '../utils/validation';

interface FormStepProps {
  formData: BioFormData;
  onFieldChange: (field: string, value: string) => void;
  errors: ValidationError[];
  onBack: () => void;
  onNext: () => void;
}

const FormStep: React.FC<FormStepProps> = ({
  formData,
  onFieldChange,
  errors,
  onBack,
  onNext
}) => {
  return (
    <div>
      <FormFieldsRenderer
        formData={formData}
        onFieldChange={onFieldChange}
        errors={errors}
      />
      <div className="pt-6 flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext}>
          Continue
        </Button>
      </div>
    </div>
  );
};

export default FormStep;
