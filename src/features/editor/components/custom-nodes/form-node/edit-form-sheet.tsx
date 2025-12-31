import { useEffect, useState } from "react";
import { useReactFlow } from "@xyflow/react";
import { toast } from "sonner";
import { z } from "zod";

import { Loader2 } from "lucide-react";

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useEditInputSheet } from "@/features/editor/hooks/use-edit-input-sheet";
import { AppNode } from "@/features/editor/types/appNode";
import { FormFieldType } from "@/features/editor/types/input-types";
import { getDynamicInputData } from "@/features/editor/utils/get-dynamic-input-data";
import { useConfirm } from "@/hooks/use-confirm";

import { EditInput } from "../../edit-input";

export const EditFormSheet = () => {
  const { isOpen, onClose, id } = useEditInputSheet();
  const { getNode, updateNodeData } = useReactFlow();
  const [inputData, setInputData] = useState<FormFieldType | null>(null);

  const [ConfirmationDialog, confirm] = useConfirm(
    "Are you sure you want to delete this account?",
    "This action cannot be undone."
  );

  useEffect(() => {
    if (isOpen && id) {
      const node = getNode("formId");
      if (node) {
        const data = getDynamicInputData(node.data.dynamicInputs as FormFieldType[], id);
        setInputData(data || null);
      }
    }
  }, [isOpen, id, getNode]);

  // You can safely branch here — AFTER all hooks
  if (!id || !inputData) return null;

  const onDelete = async () => {};

  const onSubmit = (data: any) => {
    const node = getNode("formId") as AppNode;
    if (!node) return;

    const updatedInputs = (node.data.dynamicInputs ?? []).map((input: any) =>
      input.handleId === data.handleId
        ? { ...input, ...data } // merge updated form data
        : input
    );

    updateNodeData("formId", {
      ...node.data,
      dynamicInputs: updatedInputs,
    });
    toast.success(`${data.label} - Input updated successfully`);
    console.log(data);
    onClose();
  };

  const disabled = false;

  return (
    <>
      <ConfirmationDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4 overflow-y-scroll">
          <SheetHeader>
            <SheetTitle>Edit {inputData.label}</SheetTitle>
            <SheetDescription>Edit an existing {inputData.label}</SheetDescription>
          </SheetHeader>
          <EditInput defaultValues={inputData} disabled={disabled} onSubmit={onSubmit} onDelete={onDelete} />
        </SheetContent>
      </Sheet>
    </>
  );
};
