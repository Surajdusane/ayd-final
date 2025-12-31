import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useTRPC } from "@/trpc/client";

export const useSaveWorkflow = ({ id }: { id: string }) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.workflowData.updateData.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.workflowData.getDataByWorkflowId.queryOptions({ workflowId: id }));
        toast.success("Workflow saved successfully");
      },
    })
  );
};
