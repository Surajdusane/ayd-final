import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { TaskType } from "../types/task";
import { CreateFlowNode } from "../utils/create-flow-node";

export const useWorkflow = (workflowId: string) =>
  useQuery({
    queryKey: ["workflow", workflowId],
    queryFn: () => {
      const stored = localStorage.getItem(workflowId);
      return stored
        ? JSON.parse(stored)
        : {
            nodes: [CreateFlowNode(TaskType.FORM_INPUTS)],
            edges: [],
          };
    },
  });

export const useWorkflowMutation = (workflowId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => {
      localStorage.setItem(workflowId, JSON.stringify(data));
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workflow", workflowId] });
    },
  });
};
