import { useCallback, useMemo, useRef } from "react";
import { Connection, Edge, getOutgoers } from "@xyflow/react";
import { toast } from "sonner";

import { tasks } from "../task";
import { AppNode } from "../types/appNode";
import { NodeStaticInputType } from "../types/input-types";
import { TaskType } from "../types/task";

export const useValidConnection = (nodes: AppNode[], edges: Edge[]) => {
  // Store latest nodes and edges in refs to prevent callback recreation on each render
  const nodesRef = useRef(nodes);
  const edgesRef = useRef(edges);
  nodesRef.current = nodes;
  edgesRef.current = edges;

  // ✅ Memoize quick task access (reduces repeated .find lookups)
  const taskMap = useMemo(() => {
    const map: Record<string, any> = {};
    nodes.forEach((node) => {
      map[node.id] = tasks[node.data.type];
    });
    return map;
  }, [nodes]);

  // ✅ Stable callback reference, keeps toasts intact
  return useCallback(
    (connection: Edge | Connection) => {
      const { source, target, sourceHandle, targetHandle } = connection;
      const nodes = nodesRef.current;
      const edges = edgesRef.current;

      // 🛑 No Self Connection allowed
      if (source === target) {
        toast.error("No Self Connection Allowed", {
          duration: 3000,
          id: "self-connection",
        });
        return false;
      }

      // 🧩 Find source & target nodes
      const sourceNode = nodes.find((node) => node.id === source);
      const targetNode = nodes.find((node) => node.id === target);

      if (!sourceNode || !targetNode) {
        toast.error("source or target not found", {
          duration: 3000,
          id: "source-target-not-found",
        });
        return false;
      }

      const sourceTask = taskMap[sourceNode.id];
      const targetTask = taskMap[targetNode.id];

      // 🧠 Get source output
      let output: any;

      if (sourceNode.data.type === TaskType.FORM_INPUTS) {
        const outputNode = nodes.find((n) => n.id === "formId");
        const getoutput = outputNode?.data?.dynamicInputs?.find((output: any) => output.handleId === sourceHandle);
        output = { type: getoutput?.outputType };
      } else {
        output = sourceTask.outputs.find((output: any) => output.name === sourceHandle);
      }

      // 🧠 Get target input
      let input: any;
      if (targetNode.data.type === TaskType.DOCUMENT_NODE) {
        input = {
          type: NodeStaticInputType.STRING,
        };
      } else {
        input = targetTask.inputs.find((input: any) => input.name === targetHandle);
      }

      // const input = targetTask.inputs.find(
      //   (input: any) => input.name === targetHandle
      // );

      // 🔥 Type mismatch check
      if (input?.type !== output?.type) {
        toast.error(`Source and Target Type Mismatch. Source type is ${output?.type}, Target type is ${input?.type}`, {
          duration: 3000,
          id: "source-target-type-mismatch",
        });
        return false;
      }

      // 🔁 Detect cycles efficiently
      const hasCycle = (node: AppNode, visited = new Set<string>()): boolean => {
        if (visited.has(node.id)) return false;
        visited.add(node.id);

        for (const outgoer of getOutgoers(node, nodes, edges)) {
          if (outgoer.id === source) return true;
          if (hasCycle(outgoer, visited)) return true;
        }
        return false;
      };

      const detectedCycle = hasCycle(targetNode);
      if (detectedCycle) {
        toast.error("Cycle detected in workflow", {
          duration: 3000,
          id: "cycle-detected",
        });
        return false;
      }

      return true;
    },
    [taskMap]
  );
};
