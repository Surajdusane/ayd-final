"use client";
import { NodeProps } from "@xyflow/react";
import { memo, useEffect, useState } from "react";
import { NodeCard } from "../node-card";
import { NodeHeader } from "../node-header";
import { AppNodeData } from "@/features/editor/types/appNode";
import { tasks } from "@/features/editor/task";
import OpreationInputs from "./opreation-inputs";
import OpreationInput from "./opreation-input";
import OpreationOutputs from "./opreation-outputs";
import OpreationOutput from "./opreation-output";
import { Separator } from "@/components/ui/separator";

const OpreationNode = memo((props: NodeProps) => {
  const nodeData = props.data as AppNodeData;
  const task = tasks[nodeData.type];


  return (
    <NodeCard nodeId={props.id}>
      <NodeHeader taskType={nodeData.type} nodeId={props.id} />
      <OpreationInputs>
        {task.inputs.map((input, index) => (
          <OpreationInput key={index} input={input} nodeId={props.id} />
        ))}
      </OpreationInputs>
      <Separator />
      <OpreationOutputs>
        {task.outputs.map((input, index) => (
          <OpreationOutput key={index} output={input} nodeId={props.id} />
        ))}
      </OpreationOutputs>
    </NodeCard>
  );
});

export default OpreationNode;
OpreationNode.displayName = "OpreationNode";
