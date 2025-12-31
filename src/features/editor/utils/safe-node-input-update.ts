import { AppNode } from "../types/appNode";

export function safeUpdateNodeInput(nodeId: string, newInput: any, getNode: any, updateNodeData: any, setNodes: any) {
  const node = getNode(nodeId) as AppNode;
  if (!node) return;

  const updatedInputs = [...(node.data.dynamicInputs ?? []), newInput];

  // ✅ Immediate React Flow update
  updateNodeData(nodeId, { dynamicInputs: updatedInputs });

  // ✅ Force immediate React re-render of that node
  setNodes((nds: AppNode[]) =>
    nds.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, dynamicInputs: updatedInputs } } : n))
  );
}
