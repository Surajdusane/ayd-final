import { NodeStaticInput, NodeStaticInputType } from '@/features/editor/types/input-types'
import React from 'react'
import { StaticInput } from '../../static-inputs'
import { Handle, Position, useEdges } from '@xyflow/react';
import { cn } from '@/lib/utils';
import { ColorForHandle } from '@/features/editor/utils/task-color-type';

const OpreationInput = ({ input, nodeId }: { input: NodeStaticInput, nodeId: string }) => {
  const edges = useEdges()
  const isConnected = edges.some((edge) => edge.target === nodeId && edge.targetHandle === input.name)
  const handleColor = ColorForHandle[input.type] || "#f78f"

  return (
    <div className="flex justify-start relative w-full ">
      <StaticInput input={input} nodeId={nodeId} disabled={isConnected} />
      {!input.hideHandle && (
        <Handle
          id={input.name}
          isConnectable={!isConnected}
          type="target"
          position={Position.Left}
          className={cn("border-none! -left-4! w-3! h-3! rounded-none!")}
          style={{ backgroundColor: handleColor }}
        />
      )}
    </div>
  )
}

export default OpreationInput