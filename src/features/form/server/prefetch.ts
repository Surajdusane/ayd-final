import { prefetch, trpc } from "@/trpc/server";

export const prefetchFormData = (id : string) => {
    return prefetch(trpc.workflowData.getDataByWorkflowId.queryOptions({ workflowId: id }))
}