'use client';

import {
  HTMLInputTypeAttribute,
  InputHTMLAttributes,
  ReactNode,
  forwardRef,
} from 'react';
import { Input } from "./input";
import { Label } from "./label";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  errorText: string;
  id: string;
  label: string;
  placeholder: string;
}

export const FormInput = forwardRef<HTMLInputElement, Props>(({
  errorText,
  id,
  label,
  placeholder,
  ...rest
}, ref) => {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input ref={ref} id={id} type="text" placeholder={placeholder} {...rest} />
      {errorText && (
        <p className="mt-2 text-sm text-red-500 text-left">{errorText}</p>
      )}
    </div>
  );
});

FormInput.displayName = 'FormInput';
