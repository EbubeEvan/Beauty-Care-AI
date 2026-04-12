'use client';

import { forwardRef,InputHTMLAttributes } from 'react';

import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  errorText: string;
  id: string;
  label: string;
  placeholder: string;
}

export const FormInput = forwardRef<HTMLInputElement, Props>(
  ({ errorText, id, label, placeholder, ...rest }, ref) => {
    const formattedLabel = label ? `${label.charAt(0).toUpperCase()}${label.slice(1)}` : '';

    return (
      <div className='grid gap-2'>
        <Label htmlFor={id}>{formattedLabel}</Label>
        <Input ref={ref} id={id} type='text' placeholder={placeholder} {...rest} />
        {errorText && <p className='mt-2 text-left text-sm text-red-500'>{errorText}</p>}
      </div>
    );
  },
);

FormInput.displayName = 'FormInput';
