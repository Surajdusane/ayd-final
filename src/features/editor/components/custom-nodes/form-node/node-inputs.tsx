import React, { useCallback } from "react";
import { Reorder } from "motion/react";
import NodeInput from "./node-input";
import { useReactFlow, useUpdateNodeInternals } from "@xyflow/react";

const NodeInputs = ({
  list,
  setList,
  nodeId = "formId",
}: {
  list: Array<any>;
  setList: any;
  nodeId?: string;
}) => {
  const { updateNodeData } = useReactFlow();
  const updateNodeInternals = useUpdateNodeInternals();

  const handleReorder = useCallback(
    (newList: Array<any>) => {
      setList(newList);
      updateNodeData(nodeId, {
        dynamicInputs: newList,
      });

      // Force React Flow to recalculate handle positions
      // Use setTimeout to ensure DOM has updated first
      setTimeout(() => {
        updateNodeInternals(nodeId);
      }, 1000);
    },
    [setList, updateNodeData, nodeId, updateNodeInternals]
  );

  return (
    <Reorder.Group
      axis="y"
      values={list}
      onReorder={handleReorder}
      className="flex flex-col gap-2 bg-background/50 rounded-lg p-2"
    >
      {list.map((input) => (
        <NodeInput
          key={input.handleId}
          input={input}
        />
      ))}
    </Reorder.Group>
  );
};

export default NodeInputs;