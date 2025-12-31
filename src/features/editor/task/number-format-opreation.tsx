import { DecimalsArrowRight, LucideProps } from "lucide-react";

import { cn } from "@/lib/utils";

import { NodeStaticInputType, NumberFormat, StaticInputConfigType } from "../types/input-types";
import { ParentTaskType, TaskType } from "../types/task";

export const NumberFormatOpreation = {
  type: TaskType.NUMBER_FORMAT_OPREATION,
  label: "Number Format",
  icon: (props: LucideProps) => (
    <DecimalsArrowRight className={cn("stroke-muted-foreground", props.className)} {...props} />
  ),
  parentTaskType: ParentTaskType.OPREATION_NODE,
  entryPoint: false,
  inputs: [
    {
      name: "Number",
      type: NodeStaticInputType.NUMBER,
      descriotion: "Enter your Number",
      required: true,
      hideHandle: false,
    },
    {
      name: "Decimal Places",
      type: NodeStaticInputType.SELECT,
      descriotion: "Enter number of decimal places",
      required: false,
      hideHandle: true,
      options: [
        { value: "0", label: "0" },
        { value: "1", label: "1" },
        { value: "2", label: "2" },
        { value: "3", label: "3" },
        { value: "4", label: "4" },
        { value: "5", label: "5" },
        { value: "6", label: "6" },
      ],
    },
    {
      name: "Number Format",
      type: NodeStaticInputType.SELECT,
      descriotion: "Enter number format",
      required: true,
      hideHandle: true,
      options: [
        { value: NumberFormat.UNGROUPED, label: "Ungrouped (482812)" },
        { value: NumberFormat.COMPACT_SHORT, label: "Compact Short (4M)" },
        { value: NumberFormat.COMPACT_LONG, label: "Compact Long (4.28 million)" },
        { value: NumberFormat.WESTERN_GROUPING, label: "Western Grouping(482,812)" },
        { value: NumberFormat.INDIAN_GROUPING, label: "Indian Grouping (4,828,120)" },
      ],
    },
  ],
  outputs: [
    {
      name: "Converted Number",
      type: NodeStaticInputType.STRING,
    },
  ],
} satisfies StaticInputConfigType;
