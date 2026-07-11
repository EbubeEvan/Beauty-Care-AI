'use client';

import { Eye, EyeOff } from 'lucide-react';
import { forwardRef, InputHTMLAttributes, useState } from 'react';

import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  errorText: string;
  id: string;
  label: string;
  placeholder: string;
}

export const FormInput = forwardRef<HTMLInputElement, Props>(
  ({ errorText, id, label, placeholder, type, ...rest }, ref) => {
    const formattedLabel = label ? `${label.charAt(0).toUpperCase()}${label.slice(1)}` : '';
    const isPassword = type === 'password';
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className='grid gap-2'>
        <Label htmlFor={id}>{formattedLabel}</Label>
        <div className='relative w-full'>
          <Input
            ref={ref}
            id={id}
            type={isPassword && showPassword ? 'text' : type}
            placeholder={placeholder}
            className={isPassword ? 'pr-10' : undefined}
            {...rest}
          />
          {isPassword && (
            <button
              type='button'
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className='text-text-muted hover:text-text-main absolute inset-y-0 right-3 -mt-4'
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
            </button>
          )}
        </div>
        {errorText && <p className='mt-2 text-left text-sm text-red-500'>{errorText}</p>}
      </div>
    );
  },
);

FormInput.displayName = 'FormInput';
