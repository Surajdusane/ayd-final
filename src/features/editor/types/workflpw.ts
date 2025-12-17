import { AppNode } from "./appNode";

export type WorkflowExecutionPlanPhase = {
    phase: number;
    nodes: AppNode[]
}

export type WorkflowExecutionPlan = WorkflowExecutionPlanPhase[]