import * as z from "zod";

import { FormFieldType, InputValidationType, NodeStaticInputType } from "@/features/editor/types/input-types";

import { printZodSchema } from "./test";

// Helper function to safely create enum schema
function createSelectSchema(selectValue: string[], label: string, required: boolean): z.ZodTypeAny {
  if (selectValue.length === 0) {
    return required ? z.string().min(1, `${label} is required.`) : z.string().optional();
  }

  // Create the enum values array with type assertion
  const firstValue = selectValue[0];
  if (!firstValue) {
    return z.string().optional();
  }

  // Method 1: Use type assertion through unknown
  const enumValues = selectValue as unknown as readonly [string, ...string[]];

  // Method 2: Or create the tuple explicitly
  // const enumValues: readonly [string, ...string[]] = [firstValue, ...selectValue.slice(1)];

  let schema = z.enum(enumValues);

  if (required) {
    schema = schema.refine((val) => val != null && val !== "", `${label} is required.`);
  }

  return schema;
}

export function createZodSchema(fields: FormFieldType[]): z.ZodObject<any> {
  const schemaObj: Record<string, z.ZodTypeAny> = {};

  fields.forEach((field) => {
    const { name, label, required = false, validationType, min, max, outputType, selectValue = [] } = field;

    let fieldSchema: z.ZodTypeAny;

    // Determine the base schema type
    switch (outputType) {
      case NodeStaticInputType.NUMBER:
        let numberSchema = z.number();

        // Apply number validations
        if (min !== undefined) {
          numberSchema = numberSchema.min(min, `${label} must be at least ${min}.`);
        }
        if (max !== undefined && max < Number.MAX_SAFE_INTEGER) {
          numberSchema = numberSchema.max(max, `${label} must be at most ${max}.`);
        }

        if (required) {
          numberSchema = numberSchema.refine((val) => val !== undefined && val !== null, `${label} is required.`);
        }

        fieldSchema = numberSchema;
        break;

      case NodeStaticInputType.SELECT:
        fieldSchema = createSelectSchema(selectValue, label, required);
        break;

      case NodeStaticInputType.DATE:
        let dateSchema = z.string().refine((val) => !isNaN(Date.parse(val)), `${label} must be a valid date.`);

        if (required) {
          dateSchema = dateSchema.min(1, `${label} is required.`);
        }

        fieldSchema = dateSchema;
        break;

      case NodeStaticInputType.STRING:
      default:
        let stringSchema = z.string();

        // Apply string validations
        if (validationType === InputValidationType.EMAIL) {
          stringSchema = stringSchema.email(`${label} must be a valid email address.`);
        } else if (validationType === InputValidationType.PHONE) {
          stringSchema = stringSchema.regex(
            /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
            `${label} must be a valid phone number.`
          );
        }

        // Apply min/max length for strings
        if (min !== undefined) {
          stringSchema = stringSchema.min(min, `${label} must be at least ${min} characters.`);
        }
        if (max !== undefined && max < 1000000) {
          stringSchema = stringSchema.max(max, `${label} must be at most ${max} characters.`);
        }

        if (required) {
          stringSchema = stringSchema.min(1, `${label} is required.`);
        }

        fieldSchema = stringSchema;
        break;
    }

    schemaObj[name] = fieldSchema;
  });

  return z.object(schemaObj);
}

// Alternative approach without helper function:
export function createFormSchema(fields: FormFieldType[]): z.ZodObject<any> {
  return z.object(
    fields.reduce(
      (acc, field) => {
        const { name, label, required = false, validationType, min, max, outputType, selectValue = [] } = field;

        let fieldSchema: z.ZodTypeAny;

        if (outputType === NodeStaticInputType.NUMBER) {
          let schema = z.number();
          if (min !== undefined) schema = schema.min(min, `${label} must be at least ${min}.`);
          if (max !== undefined && max < 1000000000) schema = schema.max(max, `${label} must be at most ${max}.`);
          if (required) schema = schema.refine((val) => val != null, `${label} is required.`);
          fieldSchema = schema;
        } else if (outputType === NodeStaticInputType.SELECT) {
          if (selectValue.length > 0) {
            // FIX: Use type assertion through unknown
            const enumValues = selectValue as unknown as readonly [string, ...string[]];
            let schema = z.enum(enumValues);
            if (required) {
              schema = schema.refine((val) => val != null && val !== "", `${label} is required.`);
            }
            fieldSchema = schema;
          } else {
            fieldSchema = required ? z.string().min(1, `${label} is required.`) : z.string().optional();
          }
        } else if (outputType === NodeStaticInputType.DATE) {
          let schema = z.string().refine((val) => !isNaN(Date.parse(val)), `${label} must be a valid date.`);
          if (required) schema = schema.min(1, `${label} is required.`);
          fieldSchema = schema;
        } else {
          // STRING or default
          let schema = z.string();

          if (validationType === InputValidationType.EMAIL) {
            schema = schema.email(`${label} must be a valid email address.`);
          } else if (validationType === InputValidationType.PHONE) {
            schema = schema.regex(
              /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
              `${label} must be a valid phone number.`
            );
          }

          if (min !== undefined) schema = schema.min(min, `${label} must be at least ${min} characters.`);
          if (max !== undefined && max < 1000000)
            schema = schema.max(max, `${label} must be at most ${max} characters.`);
          if (required) schema = schema.min(1, `${label} is required.`);

          fieldSchema = schema;
        }

        acc[name] = fieldSchema;
        return acc;
      },
      {} as Record<string, z.ZodTypeAny>
    )
  );
}

// Even more specific solution:
export function createZodSchemaV2(fields: FormFieldType[]): z.ZodObject<any> {
  const schemaObj: Record<string, z.ZodTypeAny> = {};

  for (const field of fields) {
    const { name, label, required = false, validationType, min, max, outputType, selectValue = [] } = field;

    let fieldSchema: z.ZodTypeAny;

    if (outputType === NodeStaticInputType.SELECT && selectValue.length > 0) {
      // FIX 1: Create tuple manually
      const first = selectValue[0];
      if (first) {
        const rest = selectValue.slice(1);
        const tuple: [string, ...string[]] = [first, ...rest];
        let schema = z.enum(tuple);

        if (required) {
          schema = schema.refine((val) => val != null && val !== "", `${label} is required.`);
        }
        fieldSchema = schema;
      } else {
        fieldSchema = z.string().optional();
      }
    } else if (outputType === NodeStaticInputType.NUMBER) {
      let schema = z.number();
      if (min !== undefined) schema = schema.min(min, `${label} must be at least ${min}.`);
      if (max !== undefined && max < Number.MAX_SAFE_INTEGER)
        schema = schema.max(max, `${label} must be at most ${max}.`);
      if (required) schema = schema.refine((val) => val != null, `${label} is required.`);
      fieldSchema = schema;
    } else if (outputType === NodeStaticInputType.DATE) {
      let schema = z.string().refine((val) => !isNaN(Date.parse(val)), `${label} must be a valid date.`);
      if (required) schema = schema.min(1, `${label} is required.`);
      fieldSchema = schema;
    } else {
      let schema = z.string();

      if (validationType === InputValidationType.EMAIL) {
        schema = schema.email(`${label} must be a valid email address.`);
      } else if (validationType === InputValidationType.PHONE) {
        schema = schema.regex(
          /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
          `${label} must be a valid phone number.`
        );
      }

      if (min !== undefined) schema = schema.min(min, `${label} must be at least ${min} characters.`);
      if (max !== undefined && max < 1000000) schema = schema.max(max, `${label} must be at most ${max} characters.`);
      if (required) schema = schema.min(1, `${label} is required.`);

      fieldSchema = schema;
    }

    schemaObj[name] = fieldSchema;
  }

  return z.object(schemaObj);
}

const dynamicInputs = [
  {
    type: "TEXT",
    name: "text",
    label: "Enter Text",
    placeholder: "Enter text...",
    description: "Enter your text",
    disabled: false,
    value: "",
    validationType: "NONE",
    required: true,
    min: 0,
    max: 1000,
    outputType: "STRING",
    handleId: "598b18ef-8a36-42d4-aa73-0549ba25f9c4",
  },
  {
    type: "TEXTAREA",
    name: "Textarea",
    label: "Textarea",
    placeholder: "Enter text...",
    description: "Enter your textarea",
    disabled: false,
    value: "",
    validationType: "NONE",
    required: true,
    min: 0,
    max: 1000,
    outputType: "STRING",
    handleId: "d40daa84-9037-40fb-81ca-18124dac36e6",
  },
  {
    type: "NUMBER",
    name: "Number",
    label: "Number",
    placeholder: "Enter number...",
    description: "Enter your number",
    disabled: false,
    value: "",
    validationType: "NONE",
    required: true,
    min: 0,
    max: 11111111111111111111111111111,
    outputType: "NUMBER",
    handleId: "df990309-8e37-4cfe-b3bd-1d600ae74ef7",
  },
  {
    type: "NUMBER",
    name: "Number",
    label: "Number",
    placeholder: "Enter number...",
    description: "Enter your number",
    disabled: false,
    value: "",
    validationType: "NONE",
    required: true,
    min: 0,
    max: 11111111111111111111111111111,
    outputType: "NUMBER",
    handleId: "bbd03b53-868d-4fb7-87ff-839d88116013",
  },
  {
    type: "SELECT",
    name: "Select",
    label: "Select",
    placeholder: "Select option",
    description: "Select your option",
    disabled: false,
    value: "",
    selectValue: ["Option 1", "Option 2", "Option 3"],
    outputType: "SELECT",
    handleId: "bbd03b587ff-839d88116013",
  },
  {
    type: "DATE",
    name: "Date",
    label: "Date",
    placeholder: "Select date",
    description: "Select your date",
    disabled: false,
    value: "",
    outputType: "DATE",
    handleId: "bbd03b53-868d-4fb7-39d88116013",
  },
] as FormFieldType[];

// Usage:
const formSchema = createZodSchema(dynamicInputs);
// or
const formSchema2 = createFormSchema(dynamicInputs);
// or
const formSchema3 = createZodSchemaV2(dynamicInputs);

// console.log("formSchema:", JSON.stringify(formSchema, null, 2));
// console.log("formSchema2:", JSON.stringify(formSchema2, null, 2));
// console.log("formSchema3:", JSON.stringify(formSchema3, null, 2));

console.log(formSchema3);
