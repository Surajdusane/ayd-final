import {
  NodeStaticInputType
} from "@/features/editor/types/input-types";
import { ColorForHandle } from "@/features/editor/utils/task-color-type";
import { cn } from "@/lib/utils";
import { Handle, Position } from "@xyflow/react";

const DocumentInput = ({ input }: { input: any}) => {
  const handleColor = ColorForHandle[NodeStaticInputType.STRING] || "#CCCCCC";

  return (
    <div
      className="flex border-2 p-2 justify-between items-center relative"
    >
      <p className="text-sm font-mono text-center">{`{${input.name}}`}</p>
      <Handle
        id={input.handleId}
        type="target"
        position={Position.Left}
        className={cn("border-none! -left-5! w-3! h-3! rounded-none!")}
        style={{ backgroundColor: handleColor }}
      />
    </div>
  );
};

export default DocumentInput;
