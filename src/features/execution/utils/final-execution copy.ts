import { Edge } from "@xyflow/react";

import { ParentTaskType } from "@/features/editor/types/task";

import { OPERATION_EXECUTORS } from "./operations";
import { executionPlan } from "@/features/editor/types/workflow";

export function generateFinalOutput(edges: Edge[], formData: { handleId: string; value: any }[], plan: executionPlan) {
  const runtime = new Map<string, any>();

  /* ---------------------------
     Seed FORM values
  ----------------------------*/
  for (const item of formData) {
    runtime.set(item.handleId, item.value);
  }

  /* ---------------------------
     Helper: resolve edge input
  ----------------------------*/
  const getInputValue = (nodeId: string, targetHandle: string) => {
    const edge = edges.find((e: any) => e.target === nodeId && e.targetHandle === targetHandle);
    return edge ? runtime.get(edge.sourceHandle as string) : undefined;
  };

  /* ---------------------------
     Phase-wise execution
  ----------------------------*/
  for (const phase of plan) {
    for (const node of phase.nodes) {
      if (node.type !== ParentTaskType.OPREATION_NODE) continue;

      const executor = OPERATION_EXECUTORS[node.data.type];
      if (!executor) {
        console.warn(`No executor for ${node.data.type}`);
        continue;
      }

      executor({
        node,
        runtime,
        getInput: (handle: string) => getInputValue(node.id, handle),
      });
    }
  }

  /* ---------------------------
     DOCUMENT output
  ----------------------------*/
  const documentNode = plan.flatMap((p: any) => p.nodes).find((n: any) => n.type === ParentTaskType.DOCUMENT_NODE);

  const output: Record<string, any> = {};

  for (const input of documentNode.data.dynamicInputs) {
    const edge = edges.find((e: any) => e.targetHandle === input.handleId);
    if (edge) {
      output[input.name] = runtime.get(edge.sourceHandle as string);
    }
  }

  return {
    documentName: documentNode.data.documentName,
    documentId: documentNode.data.documentId,
    values: output,
  };
}
