import { Divide, LucideProps, Minus } from "lucide-react";

import { cn } from "@/lib/utils";

import { NodeStaticInputType, StaticInputConfigType } from "../types/input-types";
import { ParentTaskType, TaskType } from "../types/task";

export const DivisionOpreation = {
  type: TaskType.DIVISION_OPREATION,
  label: "Division",
  icon: (props: LucideProps) => <Divide className={cn("stroke-muted-foreground", props.className)} {...props} />,
  parentTaskType: ParentTaskType.OPREATION_NODE,
  entryPoint: false,
  inputs: [
    {
      name: "Dividend",
      type: NodeStaticInputType.NUMBER,
      descriotion: "Enter Dividend",
      required: true,
      hideHandle: false,
    },
    {
      name: "Divisor",
      type: NodeStaticInputType.NUMBER,
      descriotion: "Enter Divisor",
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
