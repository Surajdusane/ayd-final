import { create } from "zustand";

type InputEditSheetState = {
  id?: string;
  isOpen: boolean;
  onOpen: (id: string) => void;
  onClose: () => void;
};

export const useEditInputSheet = create<InputEditSheetState>((set) => ({
  id: undefined,
  isOpen: false,
  onOpen: (id: string) => set({ id, isOpen: true }),
  onClose: () => set({ isOpen: false, id: undefined }),
}));
