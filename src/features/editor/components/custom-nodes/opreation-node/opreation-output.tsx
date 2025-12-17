import { NodeStaticInput, NodeStaticInputType } from '@/features/editor/types/input-types'
import React from 'react'
import { StaticInput } from '../../static-inputs'
import { Handle, Position, useEdges } from '@xyflow/react';
import { cn } from '@/lib/utils';
import { ColorForHandle } from '@/features/editor/utils/task-color-type';

const OpreationOutput = ({ output, nodeId }: { output: NodeStaticInput, nodeId: string }) => {
  const edges = useEdges()
  const isConnected = edges.some((edge) => edge.target === nodeId && edge.targetHandle === output.name)
  const handleColor = ColorForHandle[output.type] || "#CCCCCC"

  return (
    <div className="flex justify-end w-full border p-2 items-center relative bg-input/30">
      <p className="text-sm ">{output.name}</p>
      {!output.hideHandle && (
        <Handle
          id={output.name}
          isConnectable={!isConnected}
          type="source"
          position={Position.Right}
          className={cn("border-none! -right-5! w-3! h-3! rounded-none!")}
          style={{ backgroundColor: handleColor }}
        />
      )}
    </div>
  )
}

export default OpreationOutput