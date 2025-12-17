import { NodeStaticInputType } from "../types/input-types";

const colors = [
  "#EB144C",
  "#00D084",
  "#9900EF",
  "#ABB8C3",
  "#FF6900",
  "#FCB900",
  "#8ED1FC",
  "#0693E3",
  "#F78DA7",
  "#0079BF",
  "#B6BBBF",
  "#FF5A5F",
];

export const ColorForHandle: Record<NodeStaticInputType, string> = (
  Object.keys(NodeStaticInputType) as Array<keyof typeof NodeStaticInputType>
).reduce((acc, key, index) => {
  acc[NodeStaticInputType[key as keyof typeof NodeStaticInputType]] =
    colors[index];
  return acc;
}, {} as Record<NodeStaticInputType, string>);
