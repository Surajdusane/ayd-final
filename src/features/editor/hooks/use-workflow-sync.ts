// hooks/use-workflow-sync.ts
import { useEffect, useRef, useState } from "react";
import { Edge, Node } from "@xyflow/react";
import { useDebounce } from "use-debounce";

import { AppNode } from "../types/appNode";
import { useWorkflow, useWorkflowMutation } from "./use-workflow";

interface UseWorkflowSyncProps {
  workflowId: string;
  nodes: AppNode[];
  edges: Edge[];
  enabled?: boolean;
}

interface LocalStorageData {
  nodes: AppNode[];
  edges: Edge[];
  updatedAt?: string;
  syncError?: boolean;
  lastSyncAttempt?: string;
}

export const useWorkflowSync = ({ workflowId, nodes, edges, enabled = true }: UseWorkflowSyncProps) => {
  const { data: workflowData, isLoading, dbData } = useWorkflow(workflowId);
  const { mutate: saveToDatabase } = useWorkflowMutation(workflowId);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [hasUnsyncedChanges, setHasUnsyncedChanges] = useState(false);

  // Get localStorage data
  const getLocalStorageData = (): LocalStorageData | null => {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem(workflowId);
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  };

  // Save to localStorage with timestamp
  const saveToLocalStorage = (data: { nodes: Node[]; edges: Edge[] }, timestamp?: string) => {
    if (typeof window !== "undefined") {
      const currentTime = timestamp || new Date().toISOString();
      const storedData: LocalStorageData = {
        nodes: data.nodes as AppNode[],
        edges: data.edges,
        updatedAt: currentTime,
        syncError: false,
      };
      localStorage.setItem(workflowId, JSON.stringify(storedData));
      return currentTime;
    }
  };

  // Check if localStorage needs to be synced to database
  const checkSyncNeeded = () => {
    const localData = getLocalStorageData();
    if (!localData || !localData.updatedAt) return false;

    const dbUpdatedAt = dbData?.updatedAt ? new Date(dbData.updatedAt).getTime() : 0;
    const localUpdatedAt = new Date(localData.updatedAt).getTime();

    // If localStorage is newer, sync is needed
    return localUpdatedAt > dbUpdatedAt;
  };

  // Sync to database with debounce
  const [debouncedNodes] = useDebounce(nodes, 1000);
  const [debouncedEdges] = useDebounce(edges, 1000);

  const initialLoadRef = useRef(false);
  const lastSaveRef = useRef<string | null>(null);

  // Auto-save when changes are detected
  useEffect(() => {
    if (!enabled || isLoading || !initialLoadRef.current) return;

    // Create a unique signature for current state to avoid unnecessary saves
    const currentStateSignature = JSON.stringify({
      nodes: debouncedNodes.map((n) => ({
        id: n.id,
        position: n.position,
        data: n.data,
      })),
      edges: debouncedEdges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
      })),
    });

    // Only save if state has actually changed
    if (lastSaveRef.current === currentStateSignature) return;

    const data = { nodes: debouncedNodes, edges: debouncedEdges };
    const timestamp = saveToLocalStorage(data);
    lastSaveRef.current = currentStateSignature;

    // Mark that we have unsynced changes
    setHasUnsyncedChanges(true);
    setLastSyncTime(timestamp || null);

    // Save to database (this will also update localStorage with server timestamp)
    saveToDatabase(data);
  }, [debouncedNodes, debouncedEdges, enabled, isLoading, saveToDatabase]);

  // Initial load: Sync localStorage with database if needed
  useEffect(() => {
    if (!isLoading && !initialLoadRef.current) {
      initialLoadRef.current = true;

      const localData = getLocalStorageData();

      // If we have local data and either:
      // 1. No database data exists, OR
      // 2. Local data is newer than database
      if (localData && (!dbData || checkSyncNeeded())) {
        saveToDatabase({
          nodes: localData.nodes,
          edges: localData.edges,
        });
      }

      // If database has newer data, update localStorage
      if (dbData && dbData.updatedAt) {
        const localTime = localData?.updatedAt ? new Date(localData.updatedAt).getTime() : 0;
        const dbTime = new Date(dbData.updatedAt).getTime();

        if (dbTime > localTime) {
          saveToLocalStorage(
            {
              nodes: dbData.flowData?.nodes || [],
              edges: dbData.flowData?.edges || [],
            },
            dbData.updatedAt as string
          );
        }
      }
    }
  }, [isLoading, dbData, saveToDatabase, workflowId]);

  // Retry failed syncs
  useEffect(() => {
    const retryFailedSyncs = () => {
      const localData = getLocalStorageData();
      if (localData?.syncError && localData.lastSyncAttempt) {
        const lastAttempt = new Date(localData.lastSyncAttempt).getTime();
        const now = Date.now();
        // Retry after 30 seconds
        if (now - lastAttempt > 30000) {
          saveToDatabase({
            nodes: localData.nodes,
            edges: localData.edges,
          });
        }
      }
    };

    const interval = setInterval(retryFailedSyncs, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [saveToDatabase]);

  return {
    workflowData,
    isLoading,
    hasUnsyncedChanges,
    lastSyncTime,
    saveToLocalStorage: (data: { nodes: Node[]; edges: Edge[] }) => saveToLocalStorage(data),
    retrySync: () => {
      const localData = getLocalStorageData();
      if (localData) {
        saveToDatabase({
          nodes: localData.nodes,
          edges: localData.edges,
        });
      }
    },
  };
};
