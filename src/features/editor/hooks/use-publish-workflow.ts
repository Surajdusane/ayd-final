import { useTRPC } from "@/trpc/client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export const usePublishWorkflow = () => {
    const trpc = useTRPC()
    const queryclient = useQueryClient()
    return useMutation(trpc.workflowData.updatePlan.mutationOptions({
        onSuccess: () => {
            toast.success("Workflow published successfully")
        }
    }))
} 