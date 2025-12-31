// dynamic-form-preview.tsx
"use client";

import React from "react";

import { FieldGroup, FieldSet } from "@/components/ui/field";
import { FormFieldType, InputType } from "@/features/editor/types/input-types";

import DateFormInput from "./date-input";
import NumberFormInput from "./number-input";
import SelectFormInput from "./select-input";
import TextFormInput from "./text-input";

type DynamicFormFieldsProps = {
  fields: FormFieldType[];
  onFieldChange: (handleId: string, value: string | number | boolean | Date | string[]) => void;
};

const DynamicFormFields: React.FC<DynamicFormFieldsProps> = ({ fields, onFieldChange }) => {
  const renderField = (field: FormFieldType) => {
    switch (field.type) {
      case InputType.TEXT:
        return <TextFormInput data={field} onChange={onFieldChange} />;

      case InputType.TEXTAREA:
        return <TextFormInput data={field} onChange={onFieldChange} />;

      case InputType.NUMBER:
        return <NumberFormInput data={field} onChange={onFieldChange} />;

      case InputType.SELECT:
        return <SelectFormInput data={field} onChange={onFieldChange} />;

      case InputType.DATE:
        return <DateFormInput data={field} onChange={onFieldChange} />;

      default:
        return <TextFormInput data={field} onChange={onFieldChange} />;
    }
  };

  return (
    <FieldGroup>
      {fields.map((field) => (
        <div key={field.handleId || field.name}>{renderField(field)}</div>
      ))}
    </FieldGroup>
  );
};

export default DynamicFormFields;
