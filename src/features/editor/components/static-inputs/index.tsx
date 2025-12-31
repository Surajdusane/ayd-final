"use client";

import { useCallback } from "react";
import { useReactFlow } from "@xyflow/react";

import { AppNode } from "../../types/appNode";
import { NodeStaticInput, NodeStaticInputType } from "../../types/input-types";
import SelectInput from "./select-input";
import StringInput from "./string-input";

export const StaticInput = ({
  input,
  nodeId,
  disabled,
}: {
  input: NodeStaticInput;
  nodeId: string;
  disabled?: boolean;
}) => {
  const { updateNodeData, getNode } = useReactFlow();
  const node = getNode(nodeId) as AppNode;
  const value = node?.data?.inputs[input.name] || "";

  const updateNodeParamValue = useCallback(
    (newValue: string) => {
      updateNodeData(nodeId, {
        inputs: {
          ...node.data.inputs,
          [input.name]: newValue,
        },
      });
    },
    [updateNodeData, nodeId, node.data.inputs, input.name]
  );

  switch (input.type) {
    default:
      return (
        <div className="w-full">
          <p className="text-muted-foreground text-xs font-medium">Not Implimented</p>
        </div>
      );
    case NodeStaticInputType.STRING:
      return (
        <StringInput input={input} value={value} updateNodeParamValue={updateNodeParamValue} disabled={disabled} />
      );
    case NodeStaticInputType.SELECT:
      return (
        <SelectInput input={input} value={value} updateNodeParamValue={updateNodeParamValue} disabled={disabled} />
      );
    case NodeStaticInputType.NUMBER:
      return (
        <StringInput input={input} value={value} updateNodeParamValue={updateNodeParamValue} disabled={disabled} />
      );
  }
};
