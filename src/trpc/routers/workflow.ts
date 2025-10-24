import { generateSlug } from "random-word-slugs";

import {
  createWorkflow,
  getAllWorkflows,
  getWorkflowByWorkflowId,
  removeWorkflow,
  updateWorkflowName,
} from "@/db/queries";

import { createTRPCRouter } from "../init";
import { authorizedProcedure } from "../procedures/authorizedProcedure";
import { getWorkflowByWorkflowIdSchema, removeWorkflowSchema, updateWorkflowNameSchema } from "../schemas/workflow";

export const workflowRouter = createTRPCRouter({
  create: authorizedProcedure.mutation(async ({ ctx: { db, userId } }) => {
    return await createWorkflow(db, {
      name: generateSlug(3),
      userId: userId,
    });
  }),
  remove: authorizedProcedure.input(removeWorkflowSchema).mutation(async ({ ctx: { db, userId }, input }) => {
    return await removeWorkflow(db, {
      workflowId: input.workflowId,
      userId: userId,
    });
  }),
  updateName: authorizedProcedure.input(updateWorkflowNameSchema).mutation(async ({ ctx: { db, userId }, input }) => {
    return await updateWorkflowName(db, {
      name: input.name,
      userId: userId,
      workflowId: input.workflowId,
    });
  }),
  getById: authorizedProcedure.input(getWorkflowByWorkflowIdSchema).query(async ({ ctx: { db, userId }, input }) => {
    return await getWorkflowByWorkflowId(db, {
      workflowId: input.workflowId,
      userId: userId,
    });
  }),
  getMany: authorizedProcedure.query(async ({ ctx: { db, userId } }) => {
    return await getAllWorkflows(db, userId);
  }),
});
