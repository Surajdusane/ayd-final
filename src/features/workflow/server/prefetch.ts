import { prefetch, trpc } from "@/trpc/server";

export const prefetchWorkflows = () => {
  return prefetch(trpc.workflow.getMany.queryOptions());
};
