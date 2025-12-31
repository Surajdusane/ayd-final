import { Edge } from "@xyflow/react";

import { ParentTaskType } from "@/features/editor/types/task";
import { executionPlan } from "@/features/editor/types/workflow";

import { OPERATION_EXECUTORS } from "./operations";

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
    if (!edge) {
      console.warn(`No edge found for node ${nodeId} with targetHandle ${targetHandle}`);
      return undefined;
    }

    const value = runtime.get(edge.sourceHandle as string);
    if (value === undefined) {
      console.warn(`No value found in runtime for sourceHandle ${edge.sourceHandle}`);
    }
    return value;
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

      // Execute the operation and store results in runtime
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

  if (!documentNode) {
    console.error("No document node found in execution plan");
    return null;
  }

  const output: Record<string, any> = {};

  for (const input of documentNode.data.dynamicInputs) {
    const edge = edges.find((e: any) => e.targetHandle === input.handleId);
    if (edge) {
      const value = runtime.get(edge.sourceHandle as string);
      if (value !== undefined) {
        output[input.name] = value;
      } else {
        console.warn(`No value found for document input ${input.name} (handle: ${input.handleId})`);
      }
    } else {
      console.warn(`No edge connected to document input ${input.name} (handle: ${input.handleId})`);
    }
  }

  return {
    documentName: documentNode.data.documentName,
    documentId: documentNode.data.documentId,
    values: output,
  };
}
