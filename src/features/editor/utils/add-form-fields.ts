import {
  DateFormat,
  FormFieldType,
  InputType,
  InputValidationType,
  NodeStaticInputType,
} from "../types/input-types";

const defaultInputs: Record<InputType, FormFieldType> = {
  TEXT: {
    type: InputType.TEXT,
    name: "text",
    label: "Enter Text",
    placeholder: "Enter text...",
    description: "Enter your text",
    disabled: false,
    value: "",
    validationType: InputValidationType.NONE,
    required: true,
    min: 0,
    max: 1000,
    outputType: NodeStaticInputType.STRING,
    handleId: crypto.randomUUID(),
  },
  TEXTAREA: {
    type: InputType.TEXTAREA,
    name: "Textarea",
    label: "Textarea",
    placeholder: "Enter text...",
    description: "Enter your textarea",
    disabled: false,
    value: "",
    validationType: InputValidationType.NONE,
    required: true,
    min: 0,
    max: 1000,
    outputType: NodeStaticInputType.STRING,
    handleId: crypto.randomUUID(),
  },
  NUMBER: {
    type: InputType.NUMBER,
    name: "Number",
    label: "Number",
    placeholder: "Enter number...",
    description: "Enter your number",
    disabled: false,
    value: "",
    validationType: InputValidationType.NONE,
    required: true,
    min: 0,
    max: 1000,
    outputType: NodeStaticInputType.NUMBER,
    handleId: crypto.randomUUID(),
  },
  SELECT: {
    type: InputType.SELECT,
    name: "Select",
    label: "Select",
    placeholder: "Select option...",
    description: "Select your option",
    disabled: false,
    value: "",
    selectValue: ["Option 1", "Option 2", "Option 3"],
    validationType: InputValidationType.NONE,
    required: true,
    min: 0,
    max: 1000,
    outputType: NodeStaticInputType.STRING,
    handleId: crypto.randomUUID(),
  },
  DATE: {
    type: InputType.DATE,
    name: "Date",
    label: "Date",
    placeholder: "Pick a date",
    description: "Pick a date",
    disabled: false,
    value: "",
    validationType: InputValidationType.NONE,
    required: true,
    min: 0,
    max: 1000,
    dateFormat: DateFormat.EU,
    outputType: NodeStaticInputType.STRING,
    handleId: crypto.randomUUID(),
  },
};



export function getDefaultInputs(inputType: InputType): FormFieldType {
  const baseInput = defaultInputs[inputType];
  if (!baseInput) {
    throw new Error(`Unknown input type: ${inputType}`);
  }

  return {
    ...baseInput,
    handleId: crypto.randomUUID(), // generate fresh ID each time
  };
}

