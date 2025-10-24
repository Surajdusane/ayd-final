"use client";

import { inferOutput } from "@trpc/tanstack-react-query";

import { trpc } from "@/trpc/server";

import { useSuspenseWorkflows } from "../hooks/use-workflows";
import WorkflowCard from "./workflow-card";

type WorkflowCardsProps = inferOutput<typeof trpc.workflow.getMany>[number];

export const WorkflowsList = () => {
  const { data } = useSuspenseWorkflows();
  return (
    <div className="flex flex-col gap-y-4">
      {data?.map((workflow: WorkflowCardsProps) => {
        return <WorkflowCard key={workflow.id} {...workflow} />;
      })}
    </div>
  );
};
