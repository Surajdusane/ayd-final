"use client";
import { AppNodeData } from "@/features/editor/types/appNode";
import { NodeProps } from "@xyflow/react";
import { memo, useEffect, useState } from "react";
import { NodeCard } from "../node-card";
import { NodeHeader } from "../node-header";
import NodeInputs from "./node-inputs";

const FormNode = memo((props: NodeProps) => {
  const nodeData = props.data as AppNodeData;

  const [internalList, setInternalList] = useState<Array<any>>(
    nodeData.dynamicInputs || []
  );
  useEffect(() => {
    setInternalList(nodeData.dynamicInputs || []);
  }, [nodeData.dynamicInputs]);
  return (
    <NodeCard nodeId={props.id}>
      <NodeHeader taskType={nodeData.type} nodeId={props.id} />
      <NodeInputs list={internalList} setList={setInternalList} />
    </NodeCard>
  );
});

export default FormNode;
FormNode.displayName = "FormNode";
