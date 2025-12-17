// use-workflow.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateFlowNode } from "../utils/create-flow-node";
import { TaskType } from "../types/task";
import { Edge, Node } from "@xyflow/react";
import { useTRPC } from "@/trpc/client";

interface WorkflowData {
  nodes: Node[];
  edges: Edge[];
}

export const useWorkflow = (workflowId: string) => {
  const trpc = useTRPC();
  const { data, isLoading, error } = useQuery(trpc.workflowData.getDataByWorkflowId.queryOptions({ workflowId }))

  return {
    data: data?.flowData as WorkflowData ?? {
      nodes: [CreateFlowNode(TaskType.FORM_INPUTS)],
      edges: [],
    },
    isLoading,
    error,
  };
};

export const useWorkflowMutation = (workflowId: string) => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const createMutation =  useMutation(trpc.workflowData.create.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.workflowData.getDataByWorkflowId.queryOptions({ workflowId }))
    }
  }))

  const updateMutation = useMutation(trpc.workflowData.updateData.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.workflowData.getDataByWorkflowId.queryOptions({ workflowId }))
    } 
  }))

  return useMutation({
    mutationFn: async (data: WorkflowData) => {
      // Check if workflow data exists
      const existingData = await queryClient.fetchQuery({
        queryKey: ["workflow", workflowId],
      });

      if (existingData) {
        // Update existing
        return updateMutation.mutateAsync({
          workflowId,
          flowData: data,
        });
      } else {
        // Create new
        return createMutation.mutateAsync({
          workFlowId: workflowId,
          flowData: data,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workflow", workflowId] });
    },
  });
};