import type { ReactFlowInstance } from "@xyflow/react";
import { atom } from "jotai";
import { AppNode } from "../types/appNode";

export const editorAtom = atom<ReactFlowInstance<AppNode> | null>(null);
