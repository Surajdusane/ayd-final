import { Database } from "@/db";
import { and, eq } from "drizzle-orm";

import { users, workFlows } from "../schema";

type CreateWorkflow = {
  name: string;
  userId: string;
};

type RemoveWorkflow = {
  workflowId: string;
  userId: string;
};

type UpdateWorkflowName = {
  workflowId: string;
  name: string;
  userId: string;
};

type GetWorkflowsByWorkflowId = {
    workflowId: string;
    userId: string;
}

export const createWorkflow = async (db: Database, data: CreateWorkflow) => {
  return await db.insert(workFlows).values(data).returning();
};

export const removeWorkflow = async (db: Database, data: RemoveWorkflow) => {
  const { workflowId, userId } = data;
  await db.delete(workFlows).where(and(eq(workFlows.userId, userId), eq(workFlows.id, workflowId)));
  return { workflowId };
};

export const updateWorkflowName = async (db: Database, data: UpdateWorkflowName) => {
  const { workflowId, name, userId } = data;
  const [result] = await db
    .update(workFlows)
    .set({ name })
    .where(and(eq(workFlows.userId, userId), eq(workFlows.id, workflowId)));
  return result;
};

export const getWorkflowByWorkflowId = async (db: Database, data: GetWorkflowsByWorkflowId) => {
  const { workflowId, userId } = data;
  const [result] = await db.select().from(workFlows).where(and(eq(workFlows.id, workflowId), eq(workFlows.userId, userId)));
  return result;
};

export const getAllWorkflows = async (db: Database, userId: string) => {
  const result = await db.select().from(workFlows).where(eq(workFlows.userId, userId));
  return result;
};