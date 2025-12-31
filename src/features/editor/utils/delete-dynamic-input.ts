import { AppNode } from "../types/appNode";

export function deleteDynamicInput(data: AppNode, id: string) {
  return data.data.dynamicInputs?.filter((input) => input.handleId !== id);
}
