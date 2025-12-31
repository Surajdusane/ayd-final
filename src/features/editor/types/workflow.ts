import { Edge } from "@xyflow/react";
import { AppNode } from "./appNode";

export type WorkflowExecutionPlanPhase = {
  phase: number;
  nodes: AppNode[];
};

export type WorkflowExecutionPlan = WorkflowExecutionPlanPhase[];

export type reactflowData = {
  nodes: AppNode[];
  edges: Edge[];
}

export type executionPlan = {
  phase: number;
  nodes: AppNode[];
}[]