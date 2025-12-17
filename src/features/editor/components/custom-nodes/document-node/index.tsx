"use client";
import { AppNodeData } from "@/features/editor/types/appNode";
import { NodeProps } from "@xyflow/react";
import { memo, useEffect, useState } from "react";
import { NodeCard } from "../node-card";
import { NodeHeader } from "../node-header";
import DocumentInputs from "./document-inputs";
import DocumentInput from "./document-input";
import { NodeStaticInputType } from "@/features/editor/types/input-types";
import { tasks } from "@/features/editor/task";

const DocumentNode = memo((props: NodeProps) => {
  const nodeData = props.data as AppNodeData;
  const task = tasks[nodeData.type];

  if (!nodeData.dynamicInputs) return null;

  return (
    <NodeCard nodeId={props.id}>
      <NodeHeader taskType={nodeData.type} nodeId={props.id} title={nodeData.documentName} />
      <DocumentInputs>
        { 
            nodeData.dynamicInputs.map((input, index) => (
              <DocumentInput
                key={input.name}
                input={input}
              />
            ))
        }
      </DocumentInputs>
    </NodeCard>
  );
});

export default DocumentNode;
DocumentNode.displayName = "DocumentNode";
