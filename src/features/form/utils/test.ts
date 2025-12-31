import { z } from "zod";

export function printZodSchema(schema: any, indent = 0): string {
  const spaces = " ".repeat(indent);

  if (schema instanceof z.ZodObject) {
    const shape = schema.shape;
    const fields = Object.entries(shape)
      .map(([key, value]) => `${spaces}  ${key}: ${printZodSchema(value, indent + 2).trim()}`)
      .join(",\n");

    return `z.object({\n${fields}\n${spaces}})`;
  }

  if (schema instanceof z.ZodString) return "z.string()";
  if (schema instanceof z.ZodNumber) return "z.number()";
  if (schema instanceof z.ZodBoolean) return "z.boolean()";
  if (schema instanceof z.ZodArray) return `z.array(${printZodSchema(schema.element)})`;
  if (schema instanceof z.ZodOptional) return `${printZodSchema(schema.unwrap())}.optional()`;
  if (schema instanceof z.ZodNullable) return `${printZodSchema(schema.unwrap())}.nullable()`;

  return "z.unknown()";
}

const s = z.object({
  name: z.string(),
  age: z.number().min(18, "Too young!").max(100, "Too old!"),
});

console.log(printZodSchema(s));
