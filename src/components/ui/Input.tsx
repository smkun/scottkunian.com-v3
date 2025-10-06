import React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  label?: string;
  required?: boolean;
  helperText?: string;
  errorText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    type = 'text',
    error,
    label,
    required,
    helperText,
    errorText,
    id,
    ...props
  }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const helperId = helperText ? `${inputId}-helper` : undefined;
    const errorId = errorText ? `${inputId}-error` : undefined;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className={cn('label', required && 'label-required')}
          >
            {label}
            {required && <span className="text-error-600 ml-1" aria-label="required">*</span>}
          </label>
        )}

        <input
          type={type}
          id={inputId}
          className={cn(
            'input',
            error && 'input-error',
            className
          )}
          ref={ref}
          aria-invalid={error}
          aria-describedby={error ? errorId : helperId}
          aria-required={required}
          {...props}
        />

        {(helperText || errorText) && (
          <p
            id={error ? errorId : helperId}
            className={cn(
              'mt-1 text-sm',
              error ? 'text-error-600' : 'text-muted-foreground'
            )}
            role={error ? 'alert' : undefined}
          >
            {error ? errorText : helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };