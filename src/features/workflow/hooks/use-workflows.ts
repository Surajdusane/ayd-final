"use client";
// Hook to featch all workfolws using suspese

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { useTRPC } from "@/trpc/client";

export const useSuspenseWorkflows = () => {
  const trpc = useTRPC();

  return useSuspenseQuery(trpc.workflow.getMany.queryOptions());
};

export const useCreateWorkflow = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation(
    trpc.workflow.create.mutationOptions({
      onSuccess: ([data]) => {
        toast.success(`Workflow ${data.name} created successfully`);
        // router.push(`/workflows/${data.id}`);
        queryClient.invalidateQueries(trpc.workflow.getMany.queryOptions());
      },
      onError: (err) => {
        toast.error(`Failed to create workflow: ${err.message}`);
      },
    })
  );
};
