import { Node } from "@xyflow/react";

import { ParentTaskType, TaskType } from "./task";

export interface AppNodeData {
  type: TaskType;
  inputs: Record<string, string>;
  parentTaskType: ParentTaskType;
  dynamicInputs?: Array<Record<string, any>>;
  documentName?: string;
  [key: string]: any;
}

export interface AppNode extends Node {
  data: AppNodeData;
}
