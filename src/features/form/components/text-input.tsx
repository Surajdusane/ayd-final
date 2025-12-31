"use client";

import React from "react";

import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { FormFieldType, InputValidationType } from "../../editor/types/input-types";

type TextFormInputProps = {
  data: FormFieldType;
  onChange: (handleId: string, value: string) => void;
};

const TextFormInput = ({ data, onChange }: TextFormInputProps) => {
  const {
    label,
    description,
    value,
    name,
    placeholder,
    disabled,
    validationType = InputValidationType.NONE,
    required,
    min,
    max,
    handleId,
  } = data;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(handleId, e.target.value);
  };

  if (validationType === InputValidationType.NONE) {
    return (
      <Field>
        <FieldLabel htmlFor={name}>{label}</FieldLabel>
        {description && <FieldDescription>{description}</FieldDescription>}
        <Input
          id={name}
          name={name}
          type="text"
          autoComplete="off"
          placeholder={placeholder}
          value={value as string}
          disabled={disabled}
          required={required}
          min={min}
          max={max}
          onChange={handleInputChange}
        />
      </Field>
    );
  }

  if (validationType === InputValidationType.EMAIL) {
    return (
      <Field>
        <FieldLabel htmlFor={name}>{label}</FieldLabel>
        {description && <FieldDescription>{description}</FieldDescription>}
        <Input
          id={name}
          name={name}
          type="email"
          placeholder={placeholder}
          value={value as string}
          disabled={disabled}
          required={required}
          onChange={handleInputChange}
        />
      </Field>
    );
  }

  if (validationType === InputValidationType.PHONE) {
    return (
      <Field>
        <FieldLabel htmlFor={name}>{label}</FieldLabel>
        {description && <FieldDescription>{description}</FieldDescription>}
        <Input
          id={name}
          name={name}
          type="tel"
          placeholder={placeholder}
          value={value as string}
          disabled={disabled}
          required={required}
          onChange={handleInputChange}
        />
      </Field>
    );
  }

  // Fallback
  return (
    <Field>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      {description && <FieldDescription>{description}</FieldDescription>}
      <Input
        id={name}
        name={name}
        type="text"
        autoComplete="off"
        placeholder={placeholder}
        value={value as string}
        disabled={disabled}
        required={required}
        min={min}
        max={max}
        onChange={handleInputChange}
      />
    </Field>
  );
};

export default TextFormInput;
