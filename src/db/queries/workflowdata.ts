import { Database } from "@/db";
import { and, eq } from "drizzle-orm";

import { workflowData } from "../schema";

type CreateWorkflow = {
  userId: string;
  workFlowId: string;
  flowData: any;
};

type RemoveWorkflow = {
  workflowId: string;
  userId: string;
};

type UpdateWorkflowdata = {
  workflowId: string;
  userId: string;
  flowData: any;
};

type UpdateWorkflowPlan = {
  workflowId: string;
  userId: string;
  plan: any;
};

type GetWorkflowByWorkflowId = {
  workflowId: string;
  userId: string;
};

// ✅ FIXED: Returns the created record
export const createWorkflowData = async (db: Database, data: CreateWorkflow) => {
  const { userId, workFlowId, flowData } = data;
  const [result] = await db
    .insert(workflowData)
    .values({
      userId,
      workFlowId,
      flowData,
    })
    .returning();
  return result || null;
};

// ✅ FIXED: Return success indicator
export const removeWorkflowData = async (db: Database, data: RemoveWorkflow) => {
  const { workflowId, userId } = data;
  await db
    .delete(workflowData)
    .where(
      and(
        eq(workflowData.userId, userId),
        eq(workflowData.workFlowId, workflowId) // ✅ Use workFlowId, not id
      )
    );
  return { success: true, workflowId };
};

// ✅ FIXED: Added .returning() and use workFlowId
export const updateWorkflowData = async (
  db: Database,
  data: UpdateWorkflowdata
) => {
  const { workflowId, userId, flowData } = data;
  const [result] = await db
    .update(workflowData)
    .set({ flowData })
    .where(
      and(
        eq(workflowData.userId, userId),
        eq(workflowData.workFlowId, workflowId) // ✅ Use workFlowId, not id
      )
    )
    .returning(); // ✅ Added .returning()
  return result || null;
};

// ✅ FIXED: Added .returning() and use workFlowId
export const updateWorkflowPlan = async (
  db: Database,
  data: UpdateWorkflowPlan
) => {
  const { workflowId, userId, plan } = data;
  const [result] = await db
    .update(workflowData)
    .set({ plan })
    .where(
      and(
        eq(workflowData.userId, userId),
        eq(workflowData.workFlowId, workflowId) // ✅ Use workFlowId, not id
      )
    )
    .returning(); // ✅ Added .returning()
  return result || null;
};

// ✅ FIXED: Use workFlowId and add .limit(1) and .returning()
export const getWorkflowDataByWorkflowId = async (
  db: Database,
  data: GetWorkflowByWorkflowId
) => {
  const { workflowId, userId } = data;
  const result = await db
    .select()
    .from(workflowData)
    .where(
      and(
        eq(workflowData.workFlowId, workflowId), // ✅ Use workFlowId, not id
        eq(workflowData.userId, userId)
      )
    )
    .limit(1); // ✅ Added .limit(1)
  return result[0] || null; // ✅ Return null if not found
};