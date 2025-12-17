"use client";

import React, { useState, useEffect } from "react";
import { FormFieldType } from "@/features/editor/types/input-types";
import DynamicFormFields from "./dynamic-form"; 
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppNode } from "@/features/editor/types/appNode";
import { useWorkflow } from "@/features/editor/hooks/use-workflow";

type ExportFormat = "PDF" | "WORD";

type DynamicFormPreviewClientProps = {
  initialFields: FormFieldType[];
};

const DynamicFormPreviewClient: React.FC<DynamicFormPreviewClientProps> = ({
  initialFields,
}) => {
  const [fields, setFields] = useState<FormFieldType[]>(initialFields);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("PDF");
  
  const handleFieldChange = (
    handleId: string,
    value: string | number | boolean | Date | string[]
  ) => {
    setFields((prev) =>
      prev.map((field) =>
        field.handleId === handleId ? { ...field, value } : field
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finaldata = fields.map((field) => {
      return { handleId: field.handleId, value: field.value };
    });
    
    // Here you can send data to API, etc.
    console.log("Final Value:", finaldata);

  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <DynamicFormFields fields={fields} onFieldChange={handleFieldChange} />

      <div className="space-y-2">
        <label className="text-sm font-medium">Export format</label>
        <Select
          value={exportFormat}
          onValueChange={(val: ExportFormat) => setExportFormat(val)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PDF">PDF</SelectItem>
            <SelectItem value="WORD">Word</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit">Generate</Button>
    </form>
  );
};

export default DynamicFormPreviewClient;
