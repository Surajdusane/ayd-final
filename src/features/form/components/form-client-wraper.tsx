"use client";

import { useWorkflow } from "@/features/editor/hooks/use-workflow";
import { AppNode } from "@/features/editor/types/appNode";
import { FormFieldType } from "@/features/editor/types/input-types";

import DynamicFormPreviewClient from "./form-preview";
import { Button } from "@/components/ui/button";

const FormClient = ({ formId }: { formId: string }) => {
  const { data: workflow } = useWorkflow(formId);
  if (!workflow) return null;
  const formNode = workflow.nodes.find((node: AppNode) => node.type === "FORM_NODE");
  const dynamicInputs = formNode?.data?.dynamicInputs as FormFieldType[];
  
  if (dynamicInputs.length === 0) return (
    <div className="flex flex-col items-center justify-center gap-4">
      <h1>
        No inputs found for this form
      </h1>
      <Button variant="outline" asChild>
        Edit workflow
      </Button>
    </div>
  )
  return (
    <div>
      <DynamicFormPreviewClient initialFields={dynamicInputs} />
    </div>
  );
};

export default FormClient;
