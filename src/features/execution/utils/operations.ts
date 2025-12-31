import { AppNode } from "@/features/editor/types/appNode";

type OperationContext = {
  node: AppNode;
  getInput: (inputHandle: string) => any;
  runtime: Map<string, any>;
};

type OperationExecutor = (ctx: OperationContext) => void;

// Helper: Get the output handle ID for a node
const getOutputHandle = (node: AppNode, defaultKey: string = "Result"): string => {
  return `${node.id}-${defaultKey}`;
};

/**
 * Enhanced input resolver that prioritizes connected inputs over static values
 * Falls back to node.data.inputs if no edge is connected
 */
const resolveInput = (
  ctx: OperationContext,
  inputHandleId: string,
  fallbackKey?: string
): any => {
  // First, try to get value from connected edge
  const connectedValue = ctx.getInput(inputHandleId);
  
  if (connectedValue !== undefined) {
    return connectedValue;
  }

  // Fall back to static value in node data
  // Use fallbackKey if provided, otherwise use inputHandleId
  const staticKey = fallbackKey || inputHandleId;
  const staticValue = ctx.node.data.inputs?.[staticKey];
  
  if (staticValue !== undefined) {
    return staticValue;
  }

  console.warn(
    `No value found for input "${inputHandleId}" on node ${ctx.node.id}. ` +
    `Neither connected edge nor static value exists.`
  );
  return undefined;
};

export const OPERATION_EXECUTORS: Record<string, OperationExecutor> = {
  ADDITION_OPERATION: ({ node, getInput, runtime }) => {
    const a = Number(resolveInput({ node, getInput, runtime }, "First number"));
    const b = Number(resolveInput({ node, getInput, runtime }, "Second number"));
    runtime.set(getOutputHandle(node, "Result"), a + b);
  },

  SUBTRACTION_OPERATION: ({ node, getInput, runtime }) => {
    const a = Number(resolveInput({ node, getInput, runtime }, "First number"));
    const b = Number(resolveInput({ node, getInput, runtime }, "Second number"));
    runtime.set(getOutputHandle(node, "Result"), a - b);
  },

  MULTIPLICATION_OPERATION: ({ node, getInput, runtime }) => {
    const a = Number(resolveInput({ node, getInput, runtime }, "First number"));
    const b = Number(resolveInput({ node, getInput, runtime }, "Second number"));
    runtime.set(getOutputHandle(node, "Result"), a * b);
  },

  DIVISION_OPERATION: ({ node, getInput, runtime }) => {
    const a = Number(resolveInput({ node, getInput, runtime }, "First number"));
    const b = Number(resolveInput({ node, getInput, runtime }, "Second number"));
    runtime.set(getOutputHandle(node, "Result"), b === 0 ? null : a / b);
  },

  PERCENTAGE_OPERATION: ({ node, getInput, runtime }) => {
    const value = Number(resolveInput({ node, getInput, runtime }, "Value"));
    const percent = Number(resolveInput({ node, getInput, runtime }, "Percentage"));
    runtime.set(getOutputHandle(node, "Result"), (value * percent) / 100);
  },

  NUMBER_TO_STRING_OPERATION: ({ node, getInput, runtime }) => {
    const num = resolveInput({ node, getInput, runtime }, "Number");
    runtime.set(getOutputHandle(node, "Converted Number"), String(num));
  },

  LETTERCASE_OPERATION: ({ node, getInput, runtime }) => {
    const text = String(resolveInput({ node, getInput, runtime }, "Text"));
    const mode = resolveInput({ node, getInput, runtime }, "Case"); // UPPER | LOWER
    runtime.set(
      getOutputHandle(node, "Result"),
      mode === "UPPER" ? text.toUpperCase() : text.toLowerCase()
    );
  },

  NUMBER_FORMAT_OPERATION: ({ node, getInput, runtime }) => {
    const num = Number(resolveInput({ node, getInput, runtime }, "Number"));
    const format = resolveInput({ node, getInput, runtime }, "Number Format") ?? "western_grouping";

    let formattedValue: string;

    if (format === "western_grouping") {
      formattedValue = num.toLocaleString("en-US");
    } else if (format === "indian_grouping") {
      formattedValue = num.toLocaleString("en-IN");
    } else {
      formattedValue = String(num);
    }

    runtime.set(getOutputHandle(node, "Converted Number"), formattedValue);
  },

  PREFIX_OPERATION: ({ node, getInput, runtime }) => {
    const value = String(resolveInput({ node, getInput, runtime }, "Text"));
    const prefix = String(resolveInput({ node, getInput, runtime }, "Prefix"));
    runtime.set(getOutputHandle(node, "Result"), `${prefix}${value}`);
  },

  SUFFIX_OPERATION: ({ node, getInput, runtime }) => {
    const value = String(resolveInput({ node, getInput, runtime }, "Text"));
    const suffix = String(resolveInput({ node, getInput, runtime }, "Suffix"));
    runtime.set(getOutputHandle(node, "Result"), `${value}${suffix}`);
  },
};