import React from "react";
import { useAtomValue } from "jotai";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useSaveWorkflow } from "../../hooks/use-save-workflow";
import { editorAtom } from "../../store/atoms";

export const SaveButton = ({ workflowId }: { workflowId: string }) => {
  const editor = useAtomValue(editorAtom);
  const saveWorkflow = useSaveWorkflow({ id: workflowId });

  const handleSave = () => {
    if (!editor) return;
    const nodes = editor.getNodes();
    const edges = editor.getEdges();
    const flowData = {
      nodes,
      edges,
    };

    saveWorkflow.mutate({
      workflowId,
      flowData,
    });
  };

  return (
    <Button size={"sm"} variant={"outline"} onClick={handleSave} disabled={saveWorkflow.isPending}>
      {saveWorkflow.isPending ? (
        <>
          <Loader2 className={"mr-1 size-4 animate-spin"} />
          Saving
        </>
      ) : (
        "Save"
      )}
    </Button>
  );
};
