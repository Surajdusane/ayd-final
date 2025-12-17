// hooks/use-workflow-sync.ts
import { useEffect, useRef } from "react";
import { useWorkflow, useWorkflowMutation } from "./use-workflow";
import { Node, Edge } from "@xyflow/react";
import { useDebounce } from "use-debounce";
import { AppNode } from "../types/appNode";

interface UseWorkflowSyncProps {
  workflowId: string;
  nodes: AppNode[];
  edges: Edge[];
  enabled?: boolean;
}

type WorkFlowDataType = {
    nodes: AppNode[];
    edges: Edge[];
}

export const useWorkflowSync = ({
  workflowId,
  nodes,
  edges,
  enabled = true,
}: UseWorkflowSyncProps) => {
  const { data: workflowData, isLoading } = useWorkflow(workflowId)
  const { mutate: saveToDatabase } = useWorkflowMutation(workflowId);
  
  // For localStorage fallback and offline support
  const saveToLocalStorage = (data: { nodes: Node[]; edges: Edge[] }) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(workflowId, JSON.stringify(data));
    }
  };

  // Load from localStorage as initial fallback while fetching from DB
  const getInitialData = () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(workflowId);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return null;
        }
      }
    }
    return null;
  };

  // Sync to database with debounce
  const [debouncedNodes] = useDebounce(nodes, 1000);
  const [debouncedEdges] = useDebounce(edges, 1000);
  
  const initialLoadRef = useRef(false);

  useEffect(() => {
    if (!enabled || !initialLoadRef.current) return;
    
    const data = { nodes: debouncedNodes, edges: debouncedEdges };
    
    // Save to localStorage as backup
    saveToLocalStorage(data);
    
    // Save to database
    saveToDatabase(data);
  }, [debouncedNodes, debouncedEdges, enabled, saveToDatabase]);

  // Initialize: Check for localStorage data while DB loads
  useEffect(() => {
    if (!isLoading && !initialLoadRef.current) {
      initialLoadRef.current = true;
      
      // If no DB data but localStorage has data, sync it to DB
      if (!workflowData?.nodes?.length && !workflowData?.edges?.length) {
        const localData = getInitialData();
        if (localData) {
          saveToDatabase(localData);
        }
      }
    }
  }, [isLoading, workflowData, saveToDatabase]);

  return {
    workflowData,
    isLoading,
    saveToLocalStorage,
  };
};