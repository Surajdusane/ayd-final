import { AppNode } from "@/features/editor/types/appNode";

type OperationContext = {
  node: AppNode;
  getInput: (inputHandle: string) => any;
  runtime: Map<string, any>;
};

type OperationExecutor = (ctx: OperationContext) => void;

// Helper: Get the output handle ID for a node (usually the first or specific output)
const getOutputHandle = (node: AppNode, defaultKey: string = "Result"): string => {
  // If node has defined output handles, use the first one
  // Otherwise fall back to a generated key based on node id
  return `${node.id}-${defaultKey}`;
};

export const OPERATION_EXECUTORS: Record<string, OperationExecutor> = {
  ADDITION_OPREATION: ({ node, getInput, runtime }) => {
    const a = Number(getInput("First number"));
    const b = Number(node.data.inputs["Second number"]);
    runtime.set(getOutputHandle(node, "Result"), a + b);
  },

  SUBTRACTION_OPREATION: ({ node, getInput, runtime }) => {
    const a = Number(getInput("First number"));
    const b = Number(node.data.inputs["Second number"]);
    runtime.set(getOutputHandle(node, "Result"), a - b);
  },

  MULTIPLICATION_OPREATION: ({ node, getInput, runtime }) => {
    const a = Number(getInput("First number"));
    const b = Number(node.data.inputs["Second number"]);
    runtime.set(getOutputHandle(node, "Result"), a * b);
  },

  DIVISION_OPREATION: ({ node, getInput, runtime }) => {
    const a = Number(getInput("First number"));
    const b = Number(node.data.inputs["Second number"]);
    runtime.set(getOutputHandle(node, "Result"), b === 0 ? null : a / b);
  },

  PERCENTAGE_OPREATION: ({ node, getInput, runtime }) => {
    const value = Number(getInput("Value"));
    const percent = Number(node.data.inputs["Percentage"]);
    runtime.set(getOutputHandle(node, "Result"), (value * percent) / 100);
  },

  NUMBER_TO_STRING_OPREATION: ({ node, getInput, runtime }) => {
    const num = getInput("Number");
    runtime.set(getOutputHandle(node, "Converted Number"), String(num));
  },

  LETTERCASE_OPREATION: ({ node, getInput, runtime }) => {
    const text = String(getInput("Text"));
    const mode = node.data.inputs["Case"]; // UPPER | LOWER
    runtime.set(getOutputHandle(node, "Result"), mode === "UPPER" ? text.toUpperCase() : text.toLowerCase());
  },

  NUMBER_FORMAT_OPREATION: ({ node, getInput, runtime }) => {
    const num = Number(getInput("Number"));
    const format = node.data.inputs["Number Format"] ?? "western_grouping";

    let formattedValue: string;

    if (format === "western_grouping") {
      // Format: 1,200,000
      formattedValue = num.toLocaleString("en-US");
    } else if (format === "indian_grouping") {
      // Format: 12,00,000
      formattedValue = num.toLocaleString("en-IN");
    } else {
      formattedValue = String(num);
    }

    runtime.set(getOutputHandle(node, "Converted Number"), formattedValue);
  },

  PREFIX_OPREATION: ({ node, getInput, runtime }) => {
    const value = String(getInput("Text"));
    const prefix = node.data.inputs["Prefix"];
    runtime.set(getOutputHandle(node, "Result"), `${prefix}${value}`);
  },

  SUFFIX_OPREATION: ({ node, getInput, runtime }) => {
    const value = String(getInput("Text"));
    const suffix = node.data.inputs["Suffix"];
    runtime.set(getOutputHandle(node, "Result"), `${value}${suffix}`);
  },
};
