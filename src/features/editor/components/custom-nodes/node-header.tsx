"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreateFlowNode } from "../../utils/create-flow-node";
import { tasks } from "../../task";
import { AppNode } from "../../types/appNode";
import { TaskType } from "../../types/task";
import { useReactFlow } from "@xyflow/react";
import { CopyIcon, GripVerticalIcon, TrashIcon } from "lucide-react";
import { useConfirm } from "@/hooks/use-confirm";

export const NodeHeader = ({
  taskType,
  nodeId,
  title
}: {
  taskType: TaskType;
  nodeId: string;
  title?: string;
}) => {
  const task = tasks[taskType];
  const { deleteElements, getNode, addNodes } = useReactFlow();
  const [ConfirmationDialog, confirm] = useConfirm(
    "Are you sure you want to delete this node?",
    "This action cannot be undone."
  );
  return (
    <div className="flex items-center gap-2 p-1">
      <ConfirmationDialog />
      <div className="bg-muted p-2 rounded-xl">
        <task.icon size={20} className="text-" />
      </div>
      <div className="flex justify-between items-center w-full">
        <p className="text-xs font-bold uppercase text-muted-foreground">
          {title ?? task.label}
        </p>
        <div className="flex gap-1 items-center">
          {task.entryPoint && (
            <Badge variant={"secondary"} className="rounded-none">
              Entry Point
            </Badge>
          )}
          <Button
            variant="ghost"
            size="icon"
            disabled={task.entryPoint}
            onClick={async () => {
              const ok = await confirm();
              if (ok) {
                deleteElements({
                  nodes: [{ id: nodeId }],
                });
              }
            }}
          >
            <TrashIcon size={16}/>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            disabled={task.entryPoint}
            onClick={() => {
              const node = getNode(nodeId) as AppNode;
              const newX = node.position.x;
              const calvalue = node.measured?.height
                ? node.measured?.height
                : 100;
              const newY = node.position.y + calvalue + 20;
              const newNode = CreateFlowNode(node.data.type, {
                x: newX,
                y: newY,
              });
              addNodes([newNode]);
            }}
          >
            <CopyIcon size={16}/>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="drag-handle cursor-grab"
          >
            <GripVerticalIcon size={16}/>
          </Button>
        </div>
      </div>
    </div>
  );
};
