import { createTRPCRouter } from "../init";
import { userRouter } from "./user";
import { workflowRouter } from "./workflow";

export const appRouter = createTRPCRouter({
  user: userRouter,
  workflow: workflowRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
