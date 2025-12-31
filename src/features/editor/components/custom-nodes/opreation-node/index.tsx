"use client";

import { memo, useEffect, useState } from "react";
import { NodeProps } from "@xyflow/react";

import { Separator } from "@/components/ui/separator";
import { tasks } from "@/features/editor/task";
import { AppNodeData } from "@/features/editor/types/appNode";

import { NodeCard } from "../node-card";
import { NodeHeader } from "../node-header";
import OpreationInput from "./opreation-input";
import OpreationInputs from "./opreation-inputs";
import OpreationOutput from "./opreation-output";
import OpreationOutputs from "./opreation-outputs";

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
