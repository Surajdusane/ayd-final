import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateFlowNode } from "../utils/create-flow-node"; 
import { TaskType } from "../types/task"; 

export const useWorkflow = (workflowId: string) =>
  useQuery({
    queryKey: ["workflow", workflowId],
    queryFn: () => {
      const stored = localStorage.getItem(workflowId);
      return stored
        ? JSON.parse(stored)
        : {
            nodes: [CreateFlowNode(TaskType.FORM_INPUTS)],
            edges: []
          };
    }
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
    }
  });
};
