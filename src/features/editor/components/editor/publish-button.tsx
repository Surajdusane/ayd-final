import React from "react";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";

import { usePublishWorkflow } from "../../hooks/use-publish-workflow";
import useTestExecutionPlan from "../../hooks/use-test-workflow";

const PublishButton = ({ workflowId }: { workflowId: string }) => {
  const generate = useTestExecutionPlan();
  const updatePlan = usePublishWorkflow();

  const handlePublish = () => {
    const plan = generate();
    if (!plan) return;
    updatePlan.mutate({
      workflowId: workflowId,
      plan: plan,
    });
  };
  return (
    <Button
      size={"sm"}
      className="font-semibold"
      onClick={handlePublish}
      disabled={updatePlan.isPending}
    >
      Publish
    </Button>
  );
};

export default PublishButton;
