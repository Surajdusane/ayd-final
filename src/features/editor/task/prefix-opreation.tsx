import { ArrowLeft, ArrowRight, LucideProps, Plus, TextCursorInput } from "lucide-react";

import { cn } from "@/lib/utils";

import { InputType, NodeStaticInputType, StaticInputConfigType } from "../types/input-types";
import { ParentTaskType, TaskType } from "../types/task";

export const PrefixOpreation = {
  type: TaskType.PREFIX_OPREATION,
  label: "Prefix",
  icon: (props: LucideProps) => <ArrowRight className={cn("stroke-muted-foreground", props.className)} {...props} />,
  parentTaskType: ParentTaskType.OPREATION_NODE,
  entryPoint: false,
  inputs: [
    {
      name: "Text",
      type: NodeStaticInputType.STRING,
      descriotion: "Enter your text",
      required: true,
      hideHandle: false,
    },
    {
      name: "Prefix",
      type: NodeStaticInputType.STRING,
      descriotion: "Enter your prefix value",
      required: true,
      hideHandle: true,
    },
  ],
  outputs: [
    {
      name: "Value with prefix",
      type: NodeStaticInputType.STRING,
    },
  ],
} satisfies StaticInputConfigType;
