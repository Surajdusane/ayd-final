import { LucideProps, Plus, TextCursorInput, X } from "lucide-react";
import { ParentTaskType, TaskType } from "../types/task";
import { cn } from "@/lib/utils";
import { InputType, NodeStaticInputType, StaticInputConfigType } from "../types/input-types";

export const MultiplicationOpreation = {
    type: TaskType.MULTIPLICATION_OPREATION,
    label: "Multiplication",
    icon: (props: LucideProps) => <X className={cn("stroke-muted-foreground", props.className)} {...props} />,
    parentTaskType: ParentTaskType.OPREATION_NODE,
    entryPoint: false,
    inputs: [
        {
            name: "First number",
            type: NodeStaticInputType.NUMBER,
            descriotion: "Enter your first number for multiplication",
            required: true,
            hideHandle: false,
        },
        {
            name: "Second number",
            type: NodeStaticInputType.NUMBER,
            descriotion: "Enter your second number for multiplication",
            required: true,
            hideHandle: false,
        }
    ],
    outputs: [
        {
            name: "Result",
            type: NodeStaticInputType.NUMBER,
        }
    ]
} satisfies StaticInputConfigType