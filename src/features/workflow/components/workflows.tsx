"use client";

import { inferOutput } from "@trpc/tanstack-react-query";
import { useSuspenseWorkflows } from "../hooks/use-workflows";
import WorkflowHeader from "./header";
import WorkflowCard from "./workflow-card";
import { trpc } from "@/trpc/server";

type WorkflowCardsProps = inferOutput<typeof trpc.workflow.getMany>[number]

export const WorkflowsList = () => {
  const { data } = useSuspenseWorkflows();
  return (
    <div className="flex flex-col gap-y-4 w-full">
      <WorkflowHeader/>
      <div className="flex flex-col gap-y-4">
        {
          data?.map((workflow: WorkflowCardsProps) => {
            return <WorkflowCard key={workflow.id} {...workflow} />
          })
        }
      </div>
    </div>
  );
};
