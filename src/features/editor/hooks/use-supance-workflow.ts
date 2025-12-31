import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query"

export const useSupanceWorkflow = (id: string) => {
    const trpc = useTRPC()
    return useSuspenseQuery(trpc.workflowData.getDataByWorkflowId.queryOptions({ workflowId: id }))
}