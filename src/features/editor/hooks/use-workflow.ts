import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

export const useWorkflow = (workflowId: string) => {
  const trpc = useTRPC();
  return useSuspenseQuery(
    trpc.workflowData.getDataByWorkflowId.queryOptions({ workflowId }, { refetchOnWindowFocus: false })
  );
};
