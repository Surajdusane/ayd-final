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
import "@xyflow/react/dist/style.css";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useMemo } from "react";
import { useWorkflow, useWorkflowMutation } from "../../hooks/use-workflow";
import { AppNode } from "../../types/appNode";
import { ParentTaskType } from "../../types/task";
import FormNode from "../custom-nodes/form-node";
import OpreationNode from "../custom-nodes/opreation-node";
import DeleteEdge from "../custom-edge/delete-edge";
import { useValidConnection } from "../../hooks/use-valid-connection";
import DocumentNode from "../custom-nodes/document-node";
import { RouterOutputs } from "@/trpc/routers/_app";

// const nodeTypes = {
//   [ParentTaskType.FORM_NODE]: FormNode,
//   [ParentTaskType.OPREATION_NODE]: OpreationNode,
//   [ParentTaskType.DOCUMENT_NODE]: DocumentNode,
// };
// const edgeTypes = {
//   default: DeleteEdge,
// };

export type workflow = RouterOutputs["workflow"]["getById"]

const FlowEditor = ({ workflow }: { workflow: workflow }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { updateNodeData } = useReactFlow();

  const { theme } = useTheme();

  // useEffect(() => console.log(nodes), [nodes]);

  const { data: workflowData } = useWorkflow(workflow.id);
  const { mutate } = useWorkflowMutation(workflow.id);

  useEffect(() => {
    if (workflowData) {
      setNodes(workflowData.nodes);
      setEdges(workflowData.edges);
    }
    // only run when the data changes
  }, [workflowData, setEdges, setNodes]);

  // Save to localStorage whenever nodes/edges change (debounced)
  useEffect(() => {
    const timeout = setTimeout(() => {
      mutate({ nodes, edges });
    }, 500); // debounce 500ms

    return () => clearTimeout(timeout);
  }, [nodes, edges, mutate]);

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

  const isValidConnection = useValidConnection(nodes, edges)

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
