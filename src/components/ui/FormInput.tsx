import React from "react";
import { Input } from "./input";
import { Label } from "./label";

export default function FormInput({
  errorText,
  id,
  label,
  placeholder,
}: {
  errorText: string;
  id: string;
  label: string;
  placeholder: string;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type="text" placeholder={placeholder} />
      {errorText && (
        <p className="text-red-700 text-sm text-left">{errorText}</p>
      )}
    </div>
  );
}
