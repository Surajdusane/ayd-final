import { Edge, getIncomers } from "@xyflow/react";

import data from "../../../../data.json" with { type: "json" };
import { tasks } from "../task";
import { AppNode } from "../types/appNode";
import { WorkflowExecutionPlan, WorkflowExecutionPlanPhase } from "../types/workflpw";
import { toast } from "sonner";

const nodes = data.nodes as AppNode[];
const edges = data.edges as Edge[];

function getConnectedTargets(nodeId: string, handleId: string, edges: Edge[]) {
  return edges.filter((e) => e.source === nodeId && e.sourceHandle === handleId).map((e) => e.target); // returns array of target nodeIds
}

function getInvalidInputs(node: AppNode, edges: Edge[], planned: Set<string>) {
  const invalidInputs: string[] = [];
  const inputs = tasks[node.data.type]?.inputs ?? [];

  const incomingEdges = edges.filter((edge) => edge.target === node.id);

  for (const input of inputs) {
    const rawValue = node.data.inputs?.[input.name];

    const hasLiteralValue =
      rawValue !== undefined &&
      rawValue !== null &&
      String(rawValue).length > 0;

    const inputLinkedToOutput = incomingEdges.find(
      (edge) => edge.targetHandle === input.name
    );

    const providedByPlannedNode =
      !!inputLinkedToOutput && planned.has(inputLinkedToOutput.source);

    if (input.required && !hasLiteralValue && !providedByPlannedNode) {
      invalidInputs.push(input.name);
      continue;
    }

    if (!input.required && inputLinkedToOutput && !planned.has(inputLinkedToOutput.source)) {
      invalidInputs.push(input.name);
      continue;
    }
  }

  return invalidInputs;
}

export function createExecutionPlan(nodes: AppNode[], edges: Edge[]) : WorkflowExecutionPlan {
  const entryPoint = nodes.find((node) => tasks[node.data.type].entryPoint);

  if (!entryPoint) {
    throw new Error("No entry node found");
  }

  if (entryPoint.data.dynamicInputs?.length === 0) {
    throw new Error("Add form inputs");
  }

  const planned = new Set<string>();
  const nodePhase = new Map<string, number>();

  // Phase 1: entry node
  planned.add(entryPoint.id);
  nodePhase.set(entryPoint.id, 1);

  const executionPlan: WorkflowExecutionPlan = [
    {
      phase: 1,
      nodes: [entryPoint],
    },
  ];

  let phase = 2;

  // Keep going until all nodes are planned
  while (planned.size < nodes.length) {
    const currentPhaseNodes: AppNode[] = [];

    for (const node of nodes) {
      if (planned.has(node.id)) continue;
      if (node.id === entryPoint.id) continue;

      const invalidInputs = getInvalidInputs(node, edges, planned);

      if (invalidInputs.length > 0) {
        // If all incomers are already planned but still invalid -> workflow is invalid
        const incomers = getIncomers(node, nodes, edges);
        if (incomers.every((i) => planned.has(i.id))) {
          toast.error(
            "Invalid workflow because of missing inputs" + " " +
            invalidInputs
          );
        }
        // otherwise, wait for dependencies to be planned in later phases
        continue;
      }

      const incomers = getIncomers(node, nodes, edges);

      if (incomers.length === 0) {
        // Node with no incoming edges (other than entry)
        // Put it in phase 2 by convention (directly after entry)
        if (phase === 2) {
          currentPhaseNodes.push(node);
          planned.add(node.id);
          nodePhase.set(node.id, phase);
        }
        continue;
      }

      // All incomers must already be planned
      if (!incomers.every((i) => planned.has(i.id))) {
        continue;
      }

      // Phase rule: nodePhase = 1 + max(depPhase)
      const maxIncomingPhase = Math.max(
        ...incomers.map((i) => nodePhase.get(i.id) ?? 1)
      );

      if (maxIncomingPhase === phase - 1) {
        currentPhaseNodes.push(node);
        planned.add(node.id);
        nodePhase.set(node.id, phase);
      }
    }

    if (currentPhaseNodes.length === 0) {
      // We still have unplanned nodes but couldn't place any in this phase
      const remaining = nodes.filter((n) => !planned.has(n.id)).map((n) => n.id);
      throw new Error(
        "Invalid workflow. Could not schedule nodes: " + remaining.join(", ")
      );
    }

    executionPlan.push({ phase, nodes: currentPhaseNodes });
    phase++;
  }

  return executionPlan;
}

const executionPlan = createExecutionPlan(nodes, edges);
console.log(JSON.stringify(executionPlan, null, 2));
