import { LucideProps, TextCursorInput } from "lucide-react";

import { cn } from "@/lib/utils";

import { InputType, StaticInputConfigType } from "../types/input-types";
import { ParentTaskType, TaskType } from "../types/task";

export const FormInput = {
  type: TaskType.FORM_INPUTS,
  label: "Form Inputs",
  icon: (props: LucideProps) => (
    <TextCursorInput className={cn("stroke-muted-foreground", props.className)} {...props} />
  ),
  parentTaskType: ParentTaskType.FORM_NODE,
  entryPoint: true,
  inputs: [],
  outputs: [],
} satisfies StaticInputConfigType;
