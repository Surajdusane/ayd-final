import { prefetch, trpc } from "@/trpc/server";

export const prefetchWorkflowData = (id: string) => {
  return prefetch(trpc.workflowData.getDataByWorkflowId.queryOptions({ workflowId: id }));
};

export const prefetchWorkflow = (id: string) => {
  return prefetch(trpc.workflow.getById.queryOptions({ workflowId: id }));
};

export const prefetchDocuments = () => {
  return prefetch(trpc.documents.getAllByUser.queryOptions());
};
