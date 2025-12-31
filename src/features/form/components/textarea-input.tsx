"use client";

import React from "react";

import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

import { FormFieldType } from "../../editor/types/input-types";

type TextareaFormInputProps = {
  data: FormFieldType;
  onChange: (handleId: string, value: string) => void;
};

const TextareaFormInput = ({ data, onChange }: TextareaFormInputProps) => {
  const { label, description, value, name, placeholder, disabled, required, min, max, handleId } = data;

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(handleId, e.target.value);
  };

  return (
    <Field>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      {description && <FieldDescription>{description}</FieldDescription>}
      <Textarea
        id={name}
        name={name}
        placeholder={placeholder}
        value={value as string}
        disabled={disabled}
        required={required}
        minLength={min}
        maxLength={max}
        className="min-h-[100px]"
        onChange={handleInputChange}
      />
    </Field>
  );
};

export default TextareaFormInput;
