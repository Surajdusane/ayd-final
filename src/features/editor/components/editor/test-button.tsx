import React from "react";

import { Button } from "@/components/ui/button";

import useTestExecutionPlan from "../../hooks/use-test-workflow";

export const TestButton = ({ workflowId }: { workflowId: string }) => {
  const generate = useTestExecutionPlan();
  // console.log(workflowId)
  return (
    <Button
      variant={"outline"}
      size={"sm"}
      onClick={() => {
        const plan = generate();
        console.log("------plan------");
        console.table(plan);
      }}
    >
      Test
    </Button>
  );
};
