import { LucideProps, Minus, Percent } from "lucide-react";

import { cn } from "@/lib/utils";

import { NodeStaticInputType, StaticInputConfigType } from "../types/input-types";
import { ParentTaskType, TaskType } from "../types/task";

export const PercentageOpreation = {
  type: TaskType.PERCENTAGE_OPREATION,
  label: "Percentage",
  icon: (props: LucideProps) => <Percent className={cn("stroke-muted-foreground", props.className)} {...props} />,
  parentTaskType: ParentTaskType.OPREATION_NODE,
  entryPoint: false,
  inputs: [
    {
      name: "Total",
      type: NodeStaticInputType.NUMBER,
      descriotion: "Enter your total number",
      required: true,
      hideHandle: false,
    },
    {
      name: "Percentage",
      type: NodeStaticInputType.NUMBER,
      descriotion: "Enter your percentage",
      required: true,
      hideHandle: false,
    },
  ],
  outputs: [
    {
      name: "Result",
      type: NodeStaticInputType.NUMBER,
    },
  ],
} satisfies StaticInputConfigType;
