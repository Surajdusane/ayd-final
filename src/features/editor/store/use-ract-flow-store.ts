"use client";

import { create } from "zustand";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Connection,
  Edge,
  EdgeChange,
  NodeChange,
  ReactFlowInstance,
} from "@xyflow/react";
import { AppNode } from "../types/appNode";

type FlowState = {
  nodes: AppNode[];
  edges: Edge[];
  reactFlowInstance: ReactFlowInstance | null;

  setNodes: (nodes: AppNode[]) => void;
  setEdges: (edges: Edge[]) => void;
  setReactFlowInstance: (instance: ReactFlowInstance) => void;

  onNodesChange: (changes: NodeChange<AppNode>[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;

  updateNodeData: (id: string, data: Partial<AppNode["data"]>) => void;
};

export const useFlowStore = create<FlowState>((set, get) => ({
  nodes: [],
  edges: [],
  reactFlowInstance: null,

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  setReactFlowInstance: (instance) => set({ reactFlowInstance: instance }),

  onNodesChange: (changes) =>
    set({
      nodes: applyNodeChanges<AppNode>(changes, get().nodes),
    }),

  onEdgesChange: (changes) =>
    set({
      edges: applyEdgeChanges(changes, get().edges),
    }),

  onConnect: (connection) => {
    const { nodes } = get();
    const newEdges = addEdge({ ...connection, animated: true }, get().edges);
    set({ edges: newEdges });

    if (!connection.targetHandle) return;
    const node = nodes.find((n) => n.id === connection.target);
    if (!node) return;

    const nodeInput = node.data.inputs;
    get().updateNodeData(node.id, {
      inputs: {
        ...nodeInput,
        [connection.targetHandle]: "",
      },
    });
  },

  updateNodeData: (id, data) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, ...data } } : node
      ),
    });
  },
}));
