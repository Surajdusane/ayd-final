"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useWorkflow } from "@/features/editor/hooks/use-workflow";
import { AppNode } from "@/features/editor/types/appNode";
import { FormFieldType } from "@/features/editor/types/input-types";

import DynamicFormPreviewClient from "./form-preview";

const FormClient = ({ formId }: { formId: string }) => {
  const { data: workflow } = useWorkflow(formId);
  if (!workflow) return null;
  const formNode = workflow.flowData.nodes.find((node: AppNode) => node.type === "FORM_NODE");
  const dynamicInputs = formNode?.data?.dynamicInputs as FormFieldType[];

  if (!dynamicInputs || !workflow.plan)
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-4">
        <h1>No inputs found for this form</h1>
        <Button variant="outline" asChild>
          <Link href={`/workflow/edit/${formId}`}>Edit workflow</Link>
        </Button>
      </div>
    );
  return (
    <div>
      <DynamicFormPreviewClient
        initialFields={dynamicInputs}
        workflowData={workflow.flowData}
        workflowPlan={workflow.plan}
      />
    </div>
  );
};

export default FormClient;
