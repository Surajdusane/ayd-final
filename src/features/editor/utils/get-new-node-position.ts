import { tasks } from "../task";
import { AppNode } from "../types/appNode";
import { TaskType, ParentTaskType } from "../types/task";

export function getNewNodePosition(
  nodes: AppNode[],
  newNodeType: TaskType
): { x: number; y: number } {
  const X_GAP = 100;
  const Y_GAP = 30
  const DEFAULT_WIDTH = 420;
  const DEFAULT_HEIGHT = 100;

  const parentNodeType: ParentTaskType | undefined = tasks[newNodeType]?.parentTaskType;

  // === CASE 0: No nodes exist yet ===
  if (!nodes || nodes.length === 0) {
    return { x: 0, y: 0 };
  }

  // === CASE 1: No parent node type (this creates a new parent node type) ===
  if (!parentNodeType) {
    // Find rightmost node and place to its right
    const maxXNode = nodes.reduce((maxNode, node) =>
      node.position.x > maxNode.position.x ? node : maxNode
    );
    const nodeWidth = maxXNode.measured?.width ?? DEFAULT_WIDTH;
    return {
      x: maxXNode.position.x + nodeWidth + X_GAP,
      y: maxXNode.position.y,
    };
  }

  // === CASE 2: Parent node type exists (adding child to parent) ===
  // Find the actual parent node - parent nodes have type === parentTaskType
  const parentNode = nodes.find(
    (n) => (n.type as unknown as ParentTaskType) === parentNodeType
  );

  // Find all children with same parent type (children also have parentTaskType in data)
  const childrenOfParent = nodes.filter(
    (n) => n.data?.parentTaskType === parentNodeType 
  );

  // If parent node exists
  if (parentNode) {
    if (childrenOfParent.length === 0) {
      // First child: place below parent node
      const parentHeight = parentNode.measured?.height ?? DEFAULT_HEIGHT;
      return {
        x: parentNode.position.x,
        y: parentNode.position.y + parentHeight + Y_GAP,
      };
    } else {
      // More children exist: stack below the last child
      const lastChild = childrenOfParent.reduce((maxNode, node) =>
        node.position.y > maxNode.position.y ? node : maxNode
      );
      const childHeight = lastChild.measured?.height ?? DEFAULT_HEIGHT;

      return {
        x: lastChild.position.x,
        y: lastChild.position.y + childHeight + Y_GAP,
      };
    }
  }

  // Parent doesn't exist yet - place in new column to the right, aligned with FORM_NODE Y
  const formNode = nodes.find((n) => (n.data?.type as string) === "FORM_INPUTS");
  const maxXNode = nodes.reduce((maxNode, node) =>
    node.position.x > maxNode.position.x ? node : maxNode
  );
  const maxNodeWidth = maxXNode.measured?.width ?? DEFAULT_WIDTH;
  return {
    x: maxXNode.position.x + maxNodeWidth + X_GAP,
    y: formNode?.position.y ?? 0,
  };
}
