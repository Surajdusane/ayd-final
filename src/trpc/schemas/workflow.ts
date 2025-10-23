import z from "zod";

export const removeWorkflowSchema = z.object({
  workflowId: z.string(),
});

export const getWorkflowByWorkflowIdSchema = z.object({
  workflowId: z.string(),
});

export const updateWorkflowNameSchema = z.object({
  workflowId: z.string(),
  name: z.string().min(1),
});