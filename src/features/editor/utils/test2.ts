import { AppNode } from "../types/appNode";
import { Edge } from "@xyflow/react";

type ExecutionContext = Record<string, Record<string, any>>; 
// context[nodeId][outputHandle] = value

type OperationRunner = (args: {
  node: AppNode;
  getInput: (inputName: string) => any;
}) => Record<string, any>; // outputHandle -> value

const operationRunners: Record<string, OperationRunner> = {
  ADDITION_OPREATION: ({ getInput }) => {
    const a = Number(getInput("First number") ?? 0);
    const b = Number(getInput("Second number") ?? 0);
    return {
      Result: a + b,
    };
  },

  NUMBER_TO_STRING_OPREATION: ({ getInput }) => {
    const n = getInput("Number");
    return {
      "Converted Number to String": String(n ?? ""),
    };
  },

  SUFFIX_OPREATION: ({ getInput }) => {
    const text = String(getInput("Text") ?? "");
    const suffix = String(getInput("Suffix") ?? "");
    return {
      "Value with suffix": text + suffix,
    };
  },

  // ...other ops (subtraction, percentage, etc)
};


function getIncomingEdges(nodeId: string, edges: Edge[]) {
  return edges.filter((e) => e.target === nodeId);
}

function resolveInputFromEdges(
  node: AppNode,
  inputNameOrHandle: string, // for operations = input name; for document = handleId
  edges: Edge[],
  context: ExecutionContext
) {
  const incomingEdges = getIncomingEdges(node.id, edges);
  const edge = incomingEdges.find((e) => e.targetHandle === inputNameOrHandle);
  if (!edge) return undefined;

  const sourceOutputs = context[edge.source];
  if (!sourceOutputs) return undefined;

  return sourceOutputs[edge.sourceHandle!];
}


import { WorkflowExecutionPlan } from "../types/workflpw";

type RunWorkflowResult = {
  context: ExecutionContext;
  documents: Array<{
    nodeId: string;
    inputs: Record<string, any>;
  }>;
};

export function runWorkflow(
  plan: WorkflowExecutionPlan,
  edges: Edge[],
  formNode: AppNode,
  formValues: Record<string, any>
): RunWorkflowResult {
  const context: ExecutionContext = {};
  const documents: RunWorkflowResult["documents"] = [];

  // ---- Phase 1: Form node ----
  // Map form inputs to outputs using handleId so edges can use them
  const dynamicInputs = formNode.data.dynamicInputs ?? [];
  const formOutputs: Record<string, any> = {};

  for (const input of dynamicInputs) {
    const value = formValues[input.name];
    // Use handleId as output handle
    formOutputs[input.handleId] = value;
  }

  context[formNode.id] = formOutputs;

  // ---- Other phases ----
  for (const phase of plan) {
    // we already handled phase 1 explicitly
    if (phase.phase === 1) continue;

    for (const node of phase.nodes) {
      if (node.id === formNode.id) continue;

      const nodeType = node.data.type as string;

      // Operation nodes
      if (nodeType in operationRunners) {
        const runner = operationRunners[nodeType];

        const getInput = (inputName: string) => {
          // 1. literal input
          const literal = node.data.inputs?.[inputName];
          if (literal !== undefined && literal !== null && literal !== "") {
            return literal;
          }

          // 2. from an incoming edge
          return resolveInputFromEdges(node, inputName, edges, context);
        };

        const outputs = runner({ node, getInput });
        context[node.id] = outputs;
        continue;
      }

      // Document node
      if (nodeType === "DOCUMENT_NODE") {
        const dynInputs = node.data.dynamicInputs ?? [];
        const docInputValues: Record<string, any> = {};

        for (const input of dynInputs) {
          // here targetHandle in edge is handleId, so we resolve by handleId
          const value =
            resolveInputFromEdges(node, input.handleId, edges, context) ??
            node.data.inputs?.[input.name]; // fallback to literal if any
          docInputValues[input.name] = value;
        }

        context[node.id] = docInputValues;

        // You can now call your real DocumentNode generator here
        // e.g. generateDocument(node.data.documentName, docInputValues);
        documents.push({
          nodeId: node.id,
          inputs: docInputValues,
        });

        continue;
      }

      // If you add other node types later, handle them here.
    }
  }

  return { context, documents };
}


import data from "../../../../data.json" with { type: "json" };
import { createExecutionPlan } from "./execution-plan";

const nodes = data.nodes as AppNode[];
const edges = data.edges as Edge[];
const executionPlan = createExecutionPlan(nodes, edges);
const formValues = {
  "598b18ef-8a36-42d4-aa73-0549ba25f9c4": "John Doe",          // text
  "d40daa84-9037-40fb-81ca-18124dac36e6": "Software Engineer", // textarea
  "df990309-8e37-4cfe-b3bd-1d600ae74ef7": 50000,               // number
  "bbd03b53-868d-4fb7-87ff-839d88116013": 5,                   // number 2 (if needed)
};

console.log(JSON.stringify(executionPlan, null, 2));

// after you have plan, edges, formNode, and formValues from the UI
const result = runWorkflow(executionPlan as WorkflowExecutionPlan, edges, nodes[0], formValues);

// // All outputs by node + handleId:
// console.log(result.context);

// // Document node resolved inputs:
// console.log(result.documents);
