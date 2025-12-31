import { Handle, Position } from "@xyflow/react";

import { NodeStaticInputType } from "@/features/editor/types/input-types";
import { ColorForHandle } from "@/features/editor/utils/task-color-type";
import { cn } from "@/lib/utils";

const DocumentInput = ({ input }: { input: any }) => {
  const handleColor = ColorForHandle[NodeStaticInputType.STRING] || "#CCCCCC";

  return (
    <div className="relative flex items-center justify-between border-2 p-2">
      <p className="text-center font-mono text-sm">{`{${input.name}}`}</p>
      <Handle
        id={input.handleId}
        type="target"
        position={Position.Left}
        className={cn("-left-5! h-3! w-3! rounded-none! border-none!")}
        style={{ backgroundColor: handleColor }}
      />
    </div>
  );
};

export default DocumentInput;
