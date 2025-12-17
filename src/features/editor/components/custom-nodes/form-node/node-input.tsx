import { Button } from "@/components/ui/button";
import { useEditInputSheet } from "@/features/editor/hooks/use-edit-input-sheet";
import { AppNode } from "@/features/editor/types/appNode";
import { FormFieldType } from "@/features/editor/types/input-types";
import { deleteDynamicInput } from "@/features/editor/utils/delete-dynamic-input";
import { ColorForHandle } from "@/features/editor/utils/task-color-type";
import { useConfirm } from "@/hooks/use-confirm";
import { cn } from "@/lib/utils";
import {
  Handle,
  Position,
  useReactFlow,
  useUpdateNodeInternals,
} from "@xyflow/react";
import { GripVerticalIcon, Pen, TrashIcon } from "lucide-react";
import { Reorder, useDragControls } from "motion/react";

const NodeInput = ({ input }: { input: FormFieldType }) => {
  const { onOpen } = useEditInputSheet();
  const dragControls = useDragControls();
  const { updateNodeData, getNode, setEdges } = useReactFlow();
  const updateNodeInternals = useUpdateNodeInternals();
  const handleColor = ColorForHandle[input.outputType] || "#CCCCCC";

  const [ConfirmationDialog, confirm] = useConfirm(
    "Are you sure you want to delete this input?",
    "This action cannot be undone."
  );

  const onDelete = async () => {
    const ok = await confirm();
    if (ok) {
      const node = getNode("formId") as AppNode;
      updateNodeData("formId", {
        dynamicInputs: deleteDynamicInput(node, input.handleId),
      });
      setEdges((edges) => edges.filter(edge => edge.sourceHandle !== input.handleId))
      setTimeout(() => {
        updateNodeInternals("formId");
      }, 1000);
      
    }
  };

  return (
    <Reorder.Item
      className="flex border-2 p-2 justify-between items-center relative"
      key={input.handleId}
      value={input}
      dragListener={false}
      dragControls={dragControls}
    >
      <ConfirmationDialog />
      <p className="text-sm font-semibold">{input.label}</p>
      <div className="flex justify-center items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onOpen(input.handleId)}
        >
          <Pen size={16} />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onDelete()}>
          <TrashIcon size={16} />
        </Button>
        <div
          onPointerDown={(e) => dragControls.start(e)}
          className="cursor-grab active:cursor-grabbing"
        >
          <Button
            variant="ghost"
            size="icon"
            className="cursor-grab active:cursor-grabbing pointer-events-none"
          >
            <GripVerticalIcon size={16} /> 
          </Button>
        </div>
      </div>
      <Handle
        id={input.handleId}
        type="source"
        position={Position.Right}
        className={cn("border-none! -right-5! w-3! h-3! rounded-none!")}
        style={{ backgroundColor: handleColor }}
      />
    </Reorder.Item>
  );
};

export default NodeInput;
