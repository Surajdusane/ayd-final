"use client";

import { useReactFlow } from "@xyflow/react";
import { ReactNode, useCallback, memo } from "react";
import { useWorkflowValidationStore } from "../../store/workflow-validation-store";
import { cn } from "@/lib/utils";

const NodeCardComponent = ({
  nodeId,
  children,
}: {
  nodeId: string;
  children: ReactNode;
}) => {
  const { getNode, setCenter } = useReactFlow();

  const handleDoubleClick = useCallback(() => {
    const node = getNode(nodeId);
    if (!node) return;
    const { position, measured } = node;
    if (!position || !measured) return;
    const { width, height } = measured;
    const x = position.x + width! / 2;
    const y = position.y + height! / 2;
    if (x === undefined || y === undefined) return;
    setCenter(x, y, {
      zoom: 1,
      duration: 500,
    });
  }, [nodeId, getNode, setCenter]);

  const hasError = useWorkflowValidationStore(
    useCallback((state) => state.invalidNodeIds.includes(nodeId), [nodeId])
  );

  return (
    <div
      id="base-node"
      className={cn("rounded-none px-2 py-4 cursor-pointer bg-background border-2 border-separate w-[420px] text-xs flex flex-col gap-y-4 overflow-visible transition-all duration-300", hasError && "border-destructive")}
      onDoubleClick={handleDoubleClick}
    >
      {children}
    </div>
  );
};

export const NodeCard = memo(NodeCardComponent);