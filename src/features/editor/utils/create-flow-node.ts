import { tasks } from "../task";
import { AppNode } from "../types/appNode";
import { TaskType } from "../types/task";

export function CreateFlowNode(nodeType: TaskType, position?: { x: number; y: number }): AppNode {
  return {
    id: nodeType === "FORM_INPUTS" ? "formId" : crypto.randomUUID(),
    type: tasks[nodeType].parentTaskType,
    dragHandle: ".drag-handle",
    data: {
      type: nodeType,
      inputs: {},
      parentTaskType: tasks[nodeType].parentTaskType,
    },
    position: position || { x: 0, y: 0 },
  };
}
