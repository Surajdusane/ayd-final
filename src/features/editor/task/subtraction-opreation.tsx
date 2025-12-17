import { cn } from "@/lib/utils";
import { LucideProps, Minus } from "lucide-react";
import { NodeStaticInputType, StaticInputConfigType } from "../types/input-types";
import { ParentTaskType, TaskType } from "../types/task";

export const SubtractionOpreation = {
    type: TaskType.SUBTRACTION_OPREATION,
    label: "Subtraction",
    icon: (props: LucideProps) => <Minus className={cn("stroke-muted-foreground", props.className)} {...props} />,
    parentTaskType: ParentTaskType.OPREATION_NODE,
    entryPoint: false,
    inputs: [
        {
            name: "First number",
            type: NodeStaticInputType.NUMBER,
            descriotion: "Enter your first number for subtraction",
            required: true,
            hideHandle: false,
        },
        {
            name: "Second number",
            type: NodeStaticInputType.NUMBER,
            descriotion: "Enter your second number for subtraction",
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