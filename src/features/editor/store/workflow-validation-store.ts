// workflowValidationStore.ts
import { create } from "zustand";

type WorkflowValidationState = {
  invalidNodeIds: string[];
  setInvalidNodeIds: (ids: string[]) => void;
  clearInvalidNodeIds: () => void;
};

export const useWorkflowValidationStore = create<WorkflowValidationState>(
  (set) => ({
    invalidNodeIds: [],
    setInvalidNodeIds: (ids) => set({ invalidNodeIds: ids }),
    clearInvalidNodeIds: () => set({ invalidNodeIds: [] }),
  })
);
