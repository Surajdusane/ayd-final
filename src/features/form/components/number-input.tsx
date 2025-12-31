"use client";

import React from "react";

import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { FormFieldType } from "../../editor/types/input-types";

type NumberFormInputProps = {
  data: FormFieldType;
  onChange: (handleId: string, value: number) => void;
};

const NumberFormInput = ({ data, onChange }: NumberFormInputProps) => {
  const { label, description, value, name, placeholder, disabled, required, min, max, handleId } = data;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value === "" ? 0 : Number(e.target.value);
    onChange(handleId, newValue);
  };

  return (
    <Field>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      {description && <FieldDescription>{description}</FieldDescription>}
      <Input
        id={name}
        name={name}
        type="number"
        placeholder={placeholder}
        value={value as number}
        disabled={disabled}
        required={required}
        min={min}
        max={max}
        onChange={handleInputChange}
      />
    </Field>
  );
};

export default NumberFormInput;
