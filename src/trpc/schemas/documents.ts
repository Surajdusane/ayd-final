import z from "zod";

export const createDocumentSchema = z.object({
  id: z.string(),
  name: z.string(),
  metadata: z.object({
    variables: z.array(z.string()),
  }),
  path: z.string(),
});

export const getDocumentByIdSchema = z.object({
  id: z.string(),
});

export const updateDocumentSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const deleteDocumentSchema = z.object({
  path: z.string(),
});
