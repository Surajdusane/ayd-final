import React from "react";
import { Handle, Position, useEdges } from "@xyflow/react";

import { NodeStaticInput, NodeStaticInputType } from "@/features/editor/types/input-types";
import { ColorForHandle } from "@/features/editor/utils/task-color-type";
import { cn } from "@/lib/utils";

import { StaticInput } from "../../static-inputs";

const OpreationOutput = ({ output, nodeId }: { output: NodeStaticInput; nodeId: string }) => {
  const edges = useEdges();
  const isConnected = edges.some((edge) => edge.target === nodeId && edge.targetHandle === output.name);
  const handleColor = ColorForHandle[output.type] || "#CCCCCC";

  return (
    <div className="bg-input/30 relative flex w-full items-center justify-end border p-2">
      <p className="text-sm">{output.name}</p>
      {!output.hideHandle && (
        <Handle
          id={output.name}
          isConnectable={!isConnected}
          type="source"
          position={Position.Right}
          className={cn("-right-5! h-3! w-3! rounded-none! border-none!")}
          style={{ backgroundColor: handleColor }}
        />
      )}
    </div>
  );
};

export default OpreationOutput;
