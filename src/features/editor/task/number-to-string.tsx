import { cn } from "@/lib/utils";
import { LucideProps, Type } from "lucide-react";
import { NodeStaticInputType, StaticInputConfigType } from "../types/input-types";
import { ParentTaskType, TaskType } from "../types/task";

export const NumberToStringOpreation = {
    type: TaskType.NUMBER_TO_STRING_OPREATION,
    label: "Number to String",
    icon: (props: LucideProps) => <Type className={cn("stroke-muted-foreground", props.className)} {...props} />,
    parentTaskType: ParentTaskType.OPREATION_NODE,
    entryPoint: false,
    inputs: [
        {
            name: "Number",
            type: NodeStaticInputType.NUMBER,
            descriotion: "Enter your number",
            required: true,
            hideHandle: false,
        },
    ],
    outputs: [
        {
            name: "Converted Number to String",
            type: NodeStaticInputType.STRING,
        }
    ]
} satisfies StaticInputConfigType