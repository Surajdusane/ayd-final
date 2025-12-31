import {
  createWorkflowData,
  getWorkflowDataByWorkflowId,
  removeWorkflowData,
  updateWorkflowData,
  updateWorkflowPlan,
} from "@/db/queries/workflowdata";
import { TaskType } from "@/features/editor/types/task"; 
import { CreateFlowNode } from "@/features/editor/utils/create-flow-node"; 
import { AppNode } from "@/features/editor/types/appNode";
import { Edge } from "@xyflow/react";

import { createTRPCRouter } from "../init";
import { authorizedProcedure } from "../procedures/authorizedProcedure";
import {
  createWorkflowDataSchema,
  getWorkflowDataByWorkflowIdSchema,
  removeWorkflowDataSchema,
  updateWorkflowDataSchema,
  updateWorkflowPlanSchema,
} from "../schemas/workflowdata";
import z from "zod";
import { and, eq } from "drizzle-orm";
import { workflowData } from "@/db/schema";

export interface FlowData {
  nodes: AppNode[];
  edges: Edge[];
}

export const workflowDataRouter = createTRPCRouter({
  create: authorizedProcedure
    .input(createWorkflowDataSchema)
    .mutation(async ({ ctx: { db, userId }, input }) => {
      try {
        const result = await createWorkflowData(db, {
          userId: userId,
          workFlowId: input.workFlowId,
          flowData: input.flowData,
        });
        return result;
      } catch (error) {
        console.error("Error creating workflow data:", error);
        throw error;
      }
    }),

  remove: authorizedProcedure
    .input(removeWorkflowDataSchema)
    .mutation(async ({ ctx: { db, userId }, input }) => {
      try {
        return await removeWorkflowData(db, {
          workflowId: input.workflowId,
          userId: userId,
        });
      } catch (error) {
        console.error("Error removing workflow data:", error);
        throw error;
      }
    }),

  updateData: authorizedProcedure
    .input(updateWorkflowDataSchema)
    .mutation(async ({ ctx: { db, userId }, input }) => {
      try {
        const result = await updateWorkflowData(db, {
          workflowId: input.workflowId,
          userId: userId,
          flowData: input.flowData,
        });
        return result;
      } catch (error) {
        console.error("Error updating workflow data:", error);
        throw error;
      }
    }),

  updatePlan: authorizedProcedure
    .input(updateWorkflowPlanSchema)
    .mutation(async ({ ctx: { db, userId }, input }) => {
      try {
        const result = await updateWorkflowPlan(db, {
          workflowId: input.workflowId,
          userId: userId,
          plan: input.plan,
        });
        return result;
      } catch (error) {
        console.error("Error updating workflow plan:", error);
        throw error;
      }
    }),

  getDataByWorkflowId: authorizedProcedure
    .input(getWorkflowDataByWorkflowIdSchema)
    .query(async ({ ctx: { db, userId }, input }) => {
      try {
        // Try to fetch existing workflow data
        const result = await getWorkflowDataByWorkflowId(db, {
          workflowId: input.workflowId,
          userId: userId,
        });

        // If data exists, return it with typed flowData
        if (result) {
          return {
            ...result,
            flowData: result.flowData as FlowData,
          };
        }

        // If no data exists, create initial workflow
        const initialFlowData: FlowData = {
          nodes: [CreateFlowNode(TaskType.FORM_INPUTS)],
          edges: [],
        };

        const newResult = await createWorkflowData(db, {
          userId: userId,
          workFlowId: input.workflowId,
          flowData: initialFlowData,
        });

        return {
          ...newResult,
          flowData: newResult.flowData as FlowData,
        };
      } catch (error) {
        console.error("Error fetching/creating workflow data:", error);
        throw error;
      }
    }),
});