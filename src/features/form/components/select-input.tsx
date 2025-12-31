"use client";

import React from "react";

import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { FormFieldType } from "../../editor/types/input-types";

type SelectFormInputProps = {
  data: FormFieldType;
  onChange: (handleId: string, value: string) => void;
};

const SelectFormInput = ({ data, onChange }: SelectFormInputProps) => {
  const { label, description, name, placeholder, disabled, value, selectValue = [], handleId } = data;

  const handleValueChange = (newValue: string) => {
    onChange(handleId, newValue);
  };

  return (
    <Field>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      {description && <FieldDescription>{description}</FieldDescription>}
      <Select value={value as string} onValueChange={handleValueChange} disabled={disabled}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder || "Select option"} />
        </SelectTrigger>
        <SelectContent>
          {selectValue.map((option, idx) => (
            <SelectItem key={idx} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
};

export default SelectFormInput;
