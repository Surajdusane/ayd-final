import { ALargeSmall, LucideProps, Type } from "lucide-react";

import { cn } from "@/lib/utils";

import { LetterCase, NodeStaticInputType, StaticInputConfigType } from "../types/input-types";
import { ParentTaskType, TaskType } from "../types/task";

export const LetterCaseOpreation = {
  type: TaskType.LETTERCASE_OPREATION,
  label: "Letter Case",
  icon: (props: LucideProps) => <ALargeSmall className={cn("stroke-muted-foreground", props.className)} {...props} />,
  parentTaskType: ParentTaskType.OPREATION_NODE,
  entryPoint: false,
  inputs: [
    {
      name: "Letter",
      type: NodeStaticInputType.STRING,
      descriotion: "Enter your letter",
      required: true,
      hideHandle: false,
    },
    {
      name: "Case",
      type: NodeStaticInputType.SELECT,
      descriotion: "Enter your case",
      required: true,
      hideHandle: true,
      options: Array.from(Object.values(LetterCase)).map((letterCase) => ({ value: letterCase, label: letterCase })),
    },
  ],
  outputs: [
    {
      name: "Converted Letter",
      type: NodeStaticInputType.STRING,
    },
  ],
} satisfies StaticInputConfigType;
