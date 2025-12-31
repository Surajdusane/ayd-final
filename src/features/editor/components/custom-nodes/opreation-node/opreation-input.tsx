import React from "react";
import { Handle, Position, useEdges } from "@xyflow/react";

import { NodeStaticInput, NodeStaticInputType } from "@/features/editor/types/input-types";
import { ColorForHandle } from "@/features/editor/utils/task-color-type";
import { cn } from "@/lib/utils";

import { StaticInput } from "../../static-inputs";

const OpreationInput = ({ input, nodeId }: { input: NodeStaticInput; nodeId: string }) => {
  const edges = useEdges();
  const isConnected = edges.some((edge) => edge.target === nodeId && edge.targetHandle === input.name);
  const handleColor = ColorForHandle[input.type] || "#f78f";

  return (
    <div className="relative flex w-full justify-start">
      <StaticInput input={input} nodeId={nodeId} disabled={isConnected} />
      {!input.hideHandle && (
        <Handle
          id={input.name}
          isConnectable={!isConnected}
          type="target"
          position={Position.Left}
          className={cn("-left-4! h-3! w-3! rounded-none! border-none!")}
          style={{ backgroundColor: handleColor }}
        />
      )}
    </div>
  );
};

export default OpreationInput;
