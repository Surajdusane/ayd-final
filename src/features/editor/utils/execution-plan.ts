import { Edge, getIncomers } from "@xyflow/react";
import { tasks } from "../task";
import { AppNode } from "../types/appNode";
import { useWorkflowValidationStore } from "../store/workflow-validation-store";
import { toast } from "sonner";
import { WorkflowExecutionPlan } from "../types/workflpw";

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

    // Required: must have value or be wired from a planned node
    if (input.required && !hasLiteralValue && !providedByPlannedNode) {
      invalidInputs.push(input.name);
      continue;
    }

    // Optional: if wired from unplanned node, it's still invalid for now
    if (!input.required && inputLinkedToOutput && !planned.has(inputLinkedToOutput.source)) {
      invalidInputs.push(input.name);
      continue;
    }
  }

  return invalidInputs;
}


export function createExecutionPlan(nodes: AppNode[], edges: Edge[]) {
  const entryPoint = nodes.find((node) => tasks[node.data.type].entryPoint);

  if (!entryPoint) {
    toast.error("No entry node found in workflow");
    useWorkflowValidationStore.getState().setInvalidNodeIds(
      nodes.map((n) => n.id)
    );
    return null;
  }

  if (entryPoint.data.dynamicInputs?.length === 0) {
    toast.error("Add at least one form input");
    useWorkflowValidationStore.getState().setInvalidNodeIds([entryPoint.id]);
    return null;
  }

  // always clear previous errors when rerunning
  const { clearInvalidNodeIds, setInvalidNodeIds } =
    useWorkflowValidationStore.getState();
  clearInvalidNodeIds();

  const planned = new Set<string>();
  const nodePhase = new Map<string, number>();
  const invalidNodeIds = new Set<string>();

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

  // Keep going until all nodes are planned or we get stuck
  while (planned.size < nodes.length) {
    const currentPhaseNodes: AppNode[] = [];

    for (const node of nodes) {
      if (planned.has(node.id)) continue;
      if (node.id === entryPoint.id) continue;

      const invalidInputs = getInvalidInputs(node, edges, planned);

      if (invalidInputs.length > 0) {
        const incomers = getIncomers(node, nodes, edges);

        // If all incomers are already planned and still invalid => this node is invalid
        if (incomers.every((i) => planned.has(i.id))) {
          invalidNodeIds.add(node.id);
        }

        // wait for dependencies or mark invalid later
        continue;
      }

      const incomers = getIncomers(node, nodes, edges);

      if (incomers.length === 0) {
        // no incoming deps: place right after entry (phase 2)
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

      // layer rule: nodePhase = 1 + max(depPhase)
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
      // couldn't place any more nodes in this phase
      const remainingUnplanned = nodes
        .filter((n) => !planned.has(n.id))
        .map((n) => n.id);

      remainingUnplanned.forEach((id) => invalidNodeIds.add(id));

      break;
    }

    executionPlan.push({ phase, nodes: currentPhaseNodes });
    phase++;
  }

  if (invalidNodeIds.size > 0) {
    const idsArray = Array.from(invalidNodeIds);
    setInvalidNodeIds(idsArray);

    toast.error("Invalid workflow: some nodes have missing or incorrect inputs");

    // You can either return null or still return partial plan
    return null;
  }

  // No errors: make sure store is clean
  clearInvalidNodeIds();

  return executionPlan;
}
