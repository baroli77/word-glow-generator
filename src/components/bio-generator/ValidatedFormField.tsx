
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ValidatedFormFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'input' | 'textarea';
  rows?: number;
  maxLength?: number;
  error?: string;
  required?: boolean;
  helpText?: string;
}

const ValidatedFormField: React.FC<ValidatedFormFieldProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  placeholder,
  type = 'input',
  rows = 3,
  maxLength,
  error,
  required,
  helpText
}) => {
  const remainingChars = maxLength ? maxLength - value.length : null;
  const isOverLimit = remainingChars !== null && remainingChars < 0;

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className={`font-medium ${error ? 'text-red-600' : ''}`}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      {type === 'textarea' ? (
        <Textarea
          id={id}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          maxLength={maxLength}
          className={`${error ? 'border-red-500 focus:border-red-500' : ''}`}
          aria-describedby={`${id}-help ${id}-error`}
        />
      ) : (
        <Input
          id={id}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          className={`${error ? 'border-red-500 focus:border-red-500' : ''}`}
          aria-describedby={`${id}-help ${id}-error`}
        />
      )}
      
      <div className="flex justify-between items-start">
        <div className="flex-1">
          {helpText && (
            <p id={`${id}-help`} className="text-sm text-muted-foreground">
              {helpText}
            </p>
          )}
          {error && (
            <p id={`${id}-error`} className="text-sm text-red-600 font-medium">
              {error}
            </p>
          )}
        </div>
        
        {maxLength && (
          <div className={`text-xs ${isOverLimit ? 'text-red-500' : 'text-muted-foreground'}`}>
            {remainingChars} chars remaining
          </div>
        )}
      </div>
    </div>
  );
};

export default ValidatedFormField;
