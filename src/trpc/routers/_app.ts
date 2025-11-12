import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import { createTRPCRouter } from "../init";
import { documentsRouter } from "./documents";
import { userRouter } from "./user";
import { workflowRouter } from "./workflow";

export const appRouter = createTRPCRouter({
  user: userRouter,
  workflow: workflowRouter,
  documents: documentsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
export type RouterInputs = inferRouterInputs<AppRouter>;
