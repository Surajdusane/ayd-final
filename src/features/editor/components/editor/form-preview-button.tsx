"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import DynamicFormFields from "@/features/form/components/dynamic-form";

import { useWorkflow } from "../../hooks/use-workflow";
import { AppNode } from "../../types/appNode";
import { FormFieldType } from "../../types/input-types";

const FormPreviewButton = ({ workflowId }: { workflowId: string }) => {
  const { data: workflow } = useWorkflow(workflowId);
  if (!workflow) return null;
  const formNode = workflow.nodes.find((node: AppNode) => node.type === "FORM_NODE");
  const dynamicInputs = formNode?.data?.dynamicInputs as FormFieldType[];

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button size={"sm"} className="font-semibold" variant={"outline"}>
            Preview
          </Button>
        </DialogTrigger>
        <DialogContent className="w-full max-w-lg h-full max-h-[90vh] overflow-auto flex flex-col justify-start">
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <DynamicFormFields fields={dynamicInputs} onFieldChange={(handleId, value) => {}} />
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default FormPreviewButton;
