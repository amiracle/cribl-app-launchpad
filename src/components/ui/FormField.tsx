import type { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  description?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}

export function FormField({ label, description, error, required, children }: FormFieldProps) {
  return (
    <div className={`form-field ${error ? 'form-field-error' : ''}`}>
      <label className="form-label">
        {label}
        {required && <span className="form-required">*</span>}
      </label>
      {description && <p className="form-description">{description}</p>}
      {children}
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}
