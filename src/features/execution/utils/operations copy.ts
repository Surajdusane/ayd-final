import { AppNode } from "@/features/editor/types/appNode";

type OperationContext = {
  node: AppNode;
  getInput: (inputHandle: string) => any;
  runtime: Map<string, any>;
};

type OperationExecutor = (ctx: OperationContext) => void;

export const OPERATION_EXECUTORS: Record<string, OperationExecutor> = {
  ADDITION_OPREATION: ({ node, getInput, runtime }) => {
    const a = Number(getInput("First number"));
    const b = Number(node.data.inputs["Second number"]);
    runtime.set("Result", a + b);
  },

  SUBTRACTION_OPREATION: ({ node, getInput, runtime }) => {
    const a = Number(getInput("First number"));
    const b = Number(node.data.inputs["Second number"]);
    runtime.set("Result", a - b);
  },

  MULTIPLICATION_OPREATION: ({ node, getInput, runtime }) => {
    const a = Number(getInput("First number"));
    const b = Number(node.data.inputs["Second number"]);
    runtime.set("Result", a * b);
  },

  DIVISION_OPREATION: ({ node, getInput, runtime }) => {
    const a = Number(getInput("First number"));
    const b = Number(node.data.inputs["Second number"]);
    runtime.set("Result", b === 0 ? null : a / b);
  },

  PERCENTAGE_OPREATION: ({ node, getInput, runtime }) => {
    const value = Number(getInput("Value"));
    const percent = Number(node.data.inputs["Percentage"]);
    runtime.set("Result", (value * percent) / 100);
  },

  NUMBER_TO_STRING_OPREATION: ({ node, getInput, runtime }) => {
    const num = getInput("Number");
    runtime.set("Converted Number to String", String(num));
  },

  LETTERCASE_OPREATION: ({ node, getInput, runtime }) => {
    const text = String(getInput("Text"));
    const mode = node.data.inputs["Case"]; // UPPER | LOWER
    runtime.set("Result", mode === "UPPER" ? text.toUpperCase() : text.toLowerCase());
  },

  NUMBER_FORMAT_OPREATION: ({ node, getInput, runtime }) => {
    const num = Number(getInput("Number"));
    const decimals = Number(node.data.inputs["Decimals"] ?? 2);
    runtime.set("Formatted Number", num.toFixed(decimals));
  },

  PREFIX_OPREATION: ({ node, getInput, runtime }) => {
    const value = String(getInput("Text"));
    const prefix = node.data.inputs["Prefix"];
    runtime.set("Value with prefix", `${prefix}${value}`);
  },

  SUFFIX_OPREATION: ({ node, getInput, runtime }) => {
    const value = String(getInput("Text"));
    const suffix = node.data.inputs["Suffix"];
    runtime.set("Value with suffix", `${value}${suffix}`);
  },
};
