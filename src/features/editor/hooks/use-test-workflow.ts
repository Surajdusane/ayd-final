import { useReactFlow } from "@xyflow/react";
import { useCallback } from "react";
import { createExecutionPlan } from "../utils/execution-plan";
import { AppNode } from "../types/appNode";

const useTestExecutionPlan = () => {
  const { toObject } = useReactFlow();
  
  const generateExecutionPlan = useCallback(() => {
    const { nodes, edges } = toObject();
    const executionPlan = createExecutionPlan(nodes as AppNode[], edges);
    return executionPlan;
  }, [toObject])

  return generateExecutionPlan
};

export default useTestExecutionPlan;
