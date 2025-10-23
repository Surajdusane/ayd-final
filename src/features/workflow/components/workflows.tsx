"use client";

import { useSuspenseWorkflows } from "../hooks/use-workflows";

export const WorkflowsList = () => {
  const { data } = useSuspenseWorkflows();
  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};
