import { ArrowLeft, LucideProps, Plus, TextCursorInput } from "lucide-react";
import { ParentTaskType, TaskType } from "../types/task";
import { cn } from "@/lib/utils";
import { InputType, NodeStaticInputType, StaticInputConfigType } from "../types/input-types";

export const SuffixOpreation = {
    type: TaskType.SUFFIX_OPREATION,
    label: "Suffix",
    icon: (props: LucideProps) => <ArrowLeft className={cn("stroke-muted-foreground", props.className)} {...props} />,
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
            name: "Suffix",
            type: NodeStaticInputType.STRING,
            descriotion: "Enter your suffix value",
            required: true,
            hideHandle: true,
        }
    ],
    outputs: [
        {
            name: "Value with suffix",
            type: NodeStaticInputType.STRING,
        }
    ]
} satisfies StaticInputConfigType