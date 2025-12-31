"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWorkflow } from "@/features/editor/hooks/use-workflow";
import { AppNode } from "@/features/editor/types/appNode";
import { FormFieldType } from "@/features/editor/types/input-types";
import { executionPlan, reactflowData } from "@/features/editor/types/workflow";
import { useDocumentGenerator } from "@/features/execution/hooks/use-document-generator";
import { useGetDocumentsLink } from "@/features/execution/hooks/use-get-documents-link";
import { generateFinalOutput } from "@/features/execution/utils/final-execution";

import DynamicFormFields from "./dynamic-form";

type ExportFormat = "PDF" | "WORD";

type DynamicFormPreviewClientProps = {
  initialFields: FormFieldType[];
  workflowData: reactflowData;
  workflowPlan: executionPlan;
};

const DynamicFormPreviewClient: React.FC<DynamicFormPreviewClientProps> = ({
  initialFields,
  workflowData,
  workflowPlan,
}) => {
  const [fields, setFields] = useState<FormFieldType[]>(initialFields);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("PDF");
  const [genLoading, setGenLoading] = useState(false);
  const {
    isLoading,
    progress,
    progressPercentage,
    lastResult,
    generateSingleDocument,
    generateFromExecutionData,
    reset,
  } = useDocumentGenerator({
    onSuccess: (result) => {
      console.log("Document generated successfully:", result);
      // You could trigger a download or show a success message here
    },
    onError: (error) => {
      console.error("Document generation error:", error);
      toast.error(error.message);
    },
    onProgress: (progress) => {
      console.log("Generation progress:", progress);
    },
  });
  const { getDocumentLink } = useGetDocumentsLink();

  const handleFieldChange = (handleId: string, value: string | number | boolean | Date | string[]) => {
    setFields((prev) => prev.map((field) => (field.handleId === handleId ? { ...field, value } : field)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenLoading(true);

    const finaldata = fields.map((field) => {
      return { handleId: field.handleId, value: field.value };
    });
    // console.log("edge", workflowData.edges);
    // console.log("finaldata", finaldata);
    // console.log("workflowPlan", workflowPlan);

    const executionData = generateFinalOutput(workflowData.edges, finaldata, workflowPlan);

    console.log("Final exection plan:", executionData);

    const documentLink = await getDocumentLink(executionData?.documentId);

    const documentConfig = {
      template: documentLink as string,
      data: executionData?.values as Record<string, string | number | boolean>,
      filename: "document.docx",
    };

    await generateSingleDocument(documentConfig);
    setGenLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <DynamicFormFields fields={fields} onFieldChange={handleFieldChange} />

      <div className="space-y-2">
        <label className="text-sm font-medium">Export format</label>
        <Select value={exportFormat} onValueChange={(val: ExportFormat) => setExportFormat(val)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PDF">PDF</SelectItem>
            <SelectItem value="WORD">Word</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" disabled={isLoading || genLoading}>
        {isLoading || genLoading ? (
          <>
            <Loader2 className={"mr-1 size-4 animate-spin"} />
            Generating...
          </>
        ) : (
          "Generate"
        )}
      </Button>
    </form>
  );
};

export default DynamicFormPreviewClient;
