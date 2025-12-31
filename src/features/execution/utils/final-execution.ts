import { Edge } from "@xyflow/react";
import { AppNode } from "@/features/editor/types/appNode";
import { executionPlan } from "@/features/editor/types/workflow";
import { ParentTaskType } from "@/features/editor/types/task";

type OperationContext = {
  node: AppNode;
  getInput: (inputHandle: string) => any;
  runtime: Map<string, any>;
};

type OperationExecutor = (ctx: OperationContext) => void;

const getOutputHandle = (nodeId: string, outputKey: string = "Result"): string => {
  return `${nodeId}-${outputKey}`;
};

/**
 * Enhanced input resolver that prioritizes connected inputs over static values
 */
const resolveInput = (
  ctx: OperationContext,
  inputHandleId: string,
  fallbackKey?: string
): any => {
  // First, try to get value from connected edge
  const connectedValue = ctx.getInput(inputHandleId);
  
  if (connectedValue !== undefined && connectedValue !== null) {
    console.log(`✓ Input "${inputHandleId}" resolved from edge`);
    return connectedValue;
  }

  // Fall back to static value in node data
  const staticKey = fallbackKey || inputHandleId;
  const staticValue = ctx.node.data.inputs?.[staticKey];
  
  if (staticValue !== undefined && staticValue !== null) {
    console.log(`✓ Input "${inputHandleId}" resolved from static value: ${staticValue}`);
    return staticValue;
  }

  console.warn(
    `⚠ No value found for input "${inputHandleId}" on node ${ctx.node.id}. ` +
    `Static inputs available: ${Object.keys(ctx.node.data.inputs || {}).join(", ") || "none"}`
  );
  return undefined;
};

export const OPERATION_EXECUTORS: Record<string, OperationExecutor> = {
  ADDITION_OPREATION: ({ node, getInput, runtime }) => {
    const a = Number(resolveInput({ node, getInput, runtime }, "First number"));
    const b = Number(resolveInput({ node, getInput, runtime }, "Second number"));
    runtime.set(getOutputHandle(node.id, "Result"), a + b);
  },

  SUBTRACTION_OPREATION: ({ node, getInput, runtime }) => {
    const a = Number(resolveInput({ node, getInput, runtime }, "First number"));
    const b = Number(resolveInput({ node, getInput, runtime }, "Second number"));
    runtime.set(getOutputHandle(node.id, "Result"), a - b);
  },

  MULTIPLICATION_OPREATION: ({ node, getInput, runtime }) => {
    const a = Number(resolveInput({ node, getInput, runtime }, "First number"));
    const b = Number(resolveInput({ node, getInput, runtime }, "Second number"));
    runtime.set(getOutputHandle(node.id, "Result"), a * b);
  },

  DIVISION_OPREATION: ({ node, getInput, runtime }) => {
    const a = Number(resolveInput({ node, getInput, runtime }, "Dividend"));
    const b = Number(resolveInput({ node, getInput, runtime }, "Divisor"));
    runtime.set(getOutputHandle(node.id, "Result"), b === 0 ? null : a / b);
  },

  PERCENTAGE_OPREATION: ({ node, getInput, runtime }) => {
    const total = Number(resolveInput({ node, getInput, runtime }, "Total"));
    const percent = Number(resolveInput({ node, getInput, runtime }, "Percentage"));
    runtime.set(getOutputHandle(node.id, "Result"), (total * percent) / 100);
  },

  NUMBER_TO_STRING_OPREATION: ({ node, getInput, runtime }) => {
    const num = resolveInput({ node, getInput, runtime }, "Number");
    runtime.set(getOutputHandle(node.id, "Converted Number to String"), String(num));
  },

  LETTERCASE_OPREATION: ({ node, getInput, runtime }) => {
    const text = String(resolveInput({ node, getInput, runtime }, "Letter"));
    const mode = resolveInput({ node, getInput, runtime }, "Case", "Case") || "uppercase";
    
    let result: string;
    if (mode === "uppercase" || mode === "UPPER") {
      result = text.toUpperCase();
    } else if (mode === "lowercase" || mode === "LOWER") {
      result = text.toLowerCase();
    } else {
      result = text;
    }
    
    runtime.set(getOutputHandle(node.id, "Converted Letter"), result);
  },

  NUMBER_FORMAT_OPREATION: ({ node, getInput, runtime }) => {
    const num = Number(resolveInput({ node, getInput, runtime }, "Number"));
    const format = resolveInput({ node, getInput, runtime }, "Number Format", "Number Format") ?? "western_grouping";
    const decimalPlaces = parseInt(resolveInput({ node, getInput, runtime }, "Decimal Places", "Decimal Places") ?? "0");

    let formattedValue: string;

    if (format === "ungrouped") {
      formattedValue = num.toFixed(decimalPlaces);
    } else if (format === "compact_short") {
      formattedValue = Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: decimalPlaces }).format(num);
    } else if (format === "compact_long") {
      formattedValue = Intl.NumberFormat("en-US", { notation: "compact", compactDisplay: "long", maximumFractionDigits: decimalPlaces }).format(num);
    } else if (format === "western_grouping") {
      formattedValue = num.toLocaleString("en-US", { maximumFractionDigits: decimalPlaces });
    } else if (format === "indian_grouping") {
      formattedValue = num.toLocaleString("en-IN", { maximumFractionDigits: decimalPlaces });
    } else {
      formattedValue = String(num);
    }

    runtime.set(getOutputHandle(node.id, "Converted Number"), formattedValue);
  },

  PREFIX_OPREATION: ({ node, getInput, runtime }) => {
    const value = String(resolveInput({ node, getInput, runtime }, "Text"));
    const prefix = String(resolveInput({ node, getInput, runtime }, "Prefix", "Prefix"));
    runtime.set(getOutputHandle(node.id, "Value with prefix"), `${prefix}${value}`);
  },

  SUFFIX_OPREATION: ({ node, getInput, runtime }) => {
    const value = String(resolveInput({ node, getInput, runtime }, "Text"));
    const suffix = String(resolveInput({ node, getInput, runtime }, "Suffix", "Suffix"));
    runtime.set(getOutputHandle(node.id, "Value with suffix"), `${value}${suffix}`);
  },
};

export function generateFinalOutput(
  edges: Edge[],
  formData: { handleId: string; value: any }[],
  plan: executionPlan
) {
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
    const edge = edges.find((e: any) => {
      return e.target === nodeId && e.targetHandle === targetHandle;
    });

    if (!edge) {
      console.warn(
        `No edge found for node ${nodeId} with targetHandle ${targetHandle}`
      );
      return undefined;
    }

    // Try both key formats in runtime
    let value = runtime.get(edge.sourceHandle as string);
    
    if (value === undefined) {
      const constructedKey = `${edge.source}-${edge.sourceHandle}`;
      value = runtime.get(constructedKey);
    }

    if (value === undefined) {
      console.warn(
        `No value found in runtime for sourceHandle "${edge.sourceHandle}" ` +
        `(from node ${edge.source})`
      );
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
        console.warn(`No executor for operation type "${node.data.type}"`);
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
  const documentNode = plan
    .flatMap((p: any) => p.nodes)
    .find((n: any) => n.type === ParentTaskType.DOCUMENT_NODE);

  if (!documentNode) {
    console.error("No document node found in execution plan");
    return null;
  }

  const output: Record<string, any> = {};

  for (const input of documentNode.data.dynamicInputs) {
    const edge = edges.find((e: any) => {
      return e.target === documentNode.id && e.targetHandle === input.handleId;
    });

    if (edge) {
      // Try to find the value in runtime
      // First try: sourceHandle might be stored directly
      let value = runtime.get(edge.sourceHandle as string);
      
      // If not found, try: construct the key from source node + sourceHandle
      if (value === undefined) {
        const constructedKey = `${edge.source}-${edge.sourceHandle}`;
        value = runtime.get(constructedKey);
        console.log(
          `Looking for "${input.name}": tried "${edge.sourceHandle}", then "${constructedKey}"`
        );
      }
      
      if (value !== undefined && value !== null) {
        output[input.name] = value;
        console.log(`✓ Document input "${input.name}" = ${JSON.stringify(value)}`);
      } else {
        console.warn(
          `No value found for document input "${input.name}" ` +
          `(tried: "${edge.sourceHandle}" and "${edge.source}-${edge.sourceHandle}")`
        );
      }
    } else {
      console.warn(
        `No edge connected to document input "${input.name}" (handle: ${input.handleId})`
      );
    }
  }

  return {
    documentName: documentNode.data.documentName,
    documentId: documentNode.data.documentId,
    values: output,
  };
}