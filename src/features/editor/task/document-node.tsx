import { LucideProps, Newspaper } from "lucide-react";

import { cn } from "@/lib/utils";

import { NodeStaticInputType, StaticInputConfigType } from "../types/input-types";
import { ParentTaskType, TaskType } from "../types/task";

export const DocumentNode = {
  type: TaskType.DOCUMENT_NODE,
  label: "Document Input",
  icon: (props: LucideProps) => <Newspaper className={cn("stroke-muted-foreground", props.className)} {...props} />,
  parentTaskType: ParentTaskType.DOCUMENT_NODE,
  entryPoint: false,
  inputs: [
    {
      name: "Name",
      type: NodeStaticInputType.STRING,
      required: false,
      hideHandle: false,
    },
    {
      name: "Email",
      type: NodeStaticInputType.STRING,
      required: false,
      hideHandle: false,
    },
    {
      name: "Number",
      type: NodeStaticInputType.STRING,
      required: false,
      hideHandle: false,
    },
    {
      name: "Address",
      type: NodeStaticInputType.STRING,
      required: false,
      hideHandle: false,
    },
  ],
  outputs: [],
} satisfies StaticInputConfigType;
