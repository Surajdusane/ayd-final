import z from "zod";

export const createWorkflowDataSchema = z.object({
    workFlowId: z.string(),
    flowData: z.any(),
});

export const removeWorkflowDataSchema = z.object({
    workflowId: z.string(),
});

export const updateWorkflowDataSchema = z.object({
    workflowId: z.string(),
    flowData: z.any(),
});

export const updateWorkflowPlanSchema = z.object({
    workflowId: z.string(),
    plan: z.any(),
});

export const getWorkflowDataByWorkflowIdSchema = z.object({
    workflowId: z.string(),
});