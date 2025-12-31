"use client";

import {
  addEdge,
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  Edge,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";

import { RouterOutputs } from "@/trpc/routers/_app";

import "@xyflow/react/dist/style.css";

import { useCallback, useEffect, useMemo } from "react";
import { useSetAtom } from "jotai";
import { useTheme } from "next-themes";

import { useValidConnection } from "../../hooks/use-valid-connection";
import { useWorkflow } from "../../hooks/use-workflow";
import { editorAtom } from "../../store/atoms";
import { AppNode } from "../../types/appNode";
import { ParentTaskType } from "../../types/task";
import DeleteEdge from "../custom-edge/delete-edge";
import DocumentNode from "../custom-nodes/document-node";
import FormNode from "../custom-nodes/form-node";
import OpreationNode from "../custom-nodes/opreation-node";

// const nodeTypes = {
//   [ParentTaskType.FORM_NODE]: FormNode,
//   [ParentTaskType.OPREATION_NODE]: OpreationNode,
//   [ParentTaskType.DOCUMENT_NODE]: DocumentNode,
// };
// const edgeTypes = {
//   default: DeleteEdge,
// };

export type workflow = RouterOutputs["workflow"]["getById"];

const FlowEditor = ({ workflow }: { workflow: workflow }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { updateNodeData } = useReactFlow();
  const { theme } = useTheme();

  const setEditor = useSetAtom(editorAtom);
  const { data: workflowData } = useWorkflow(workflow.id);

  useEffect(() => {
    if (workflowData) {
      setNodes(workflowData.flowData.nodes);
      setEdges(workflowData.flowData.edges);
    }
    // only run when the data changes
  }, [workflowData, setEdges, setNodes]);

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((edges) => addEdge({ ...connection, animated: true }, edges));
      if (!connection.targetHandle) return;
      // remove input value if it present on connection
      const node = nodes.find((node) => node.id === connection.target);
      if (!node) return;
      const nodeInput = node.data.inputs;
      updateNodeData(node.id, {
        inputs: {
          ...nodeInput,
          [connection.targetHandle]: "",
        },
      });
    },
    [setEdges, updateNodeData]
  );

  const isValidConnection = useValidConnection(nodes, edges);

  // ✅ Memoize nodeTypes and edgeTypes
  const nodeTypes = useMemo(
    () => ({
      [ParentTaskType.FORM_NODE]: FormNode,
      [ParentTaskType.OPREATION_NODE]: OpreationNode,
      [ParentTaskType.DOCUMENT_NODE]: DocumentNode,
    }),
    []
  );

  const edgeTypes = useMemo(
    () => ({
      default: DeleteEdge,
    }),
    []
  );

  return (
    <main className="size-full h-screen">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        proOptions={{ hideAttribution: true }}
        className={theme === "dark" ? "dark" : "light"}
        fitView
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onConnect={onConnect}
        selectNodesOnDrag={false}
        connectionRadius={20}
        onlyRenderVisibleElements={false}
        isValidConnection={isValidConnection}
        onInit={setEditor}
      >
        <Controls position="bottom-right" />
        <Background
          variant={BackgroundVariant.Dots}
          gap={46}
          color={theme === "dark" ? "var(--secondary)" : "var(--ring)"}
          size={theme === "dark" ? 4 : 2}
          bgColor="var(--background)"
        />
      </ReactFlow>
    </main>
  );
};

export default FlowEditor;
