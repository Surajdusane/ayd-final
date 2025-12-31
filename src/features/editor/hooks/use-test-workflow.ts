import { useCallback } from "react";
import { useReactFlow } from "@xyflow/react";

import { AppNode } from "../types/appNode";
import { createExecutionPlan } from "../utils/execution-plan";

const useTestExecutionPlan = () => {
  const { toObject } = useReactFlow();

  const generateExecutionPlan = useCallback(() => {
    const { nodes, edges } = toObject();
    const executionPlan = createExecutionPlan(nodes as AppNode[], edges);
    return executionPlan;
  }, [toObject]);

  return generateExecutionPlan;
};

export default useTestExecutionPlan;
