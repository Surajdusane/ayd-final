import { useReactFlow } from "@xyflow/react";

import {
  ALargeSmall,
  AlignLeft,
  ArrowLeft,
  ArrowRight,
  Calendar,
  DecimalsArrowRight,
  Divide,
  Hash,
  List,
  LucideIcon,
  Minus,
  Percent,
  Plus,
  TextCursorInput,
  Type,
  X,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import { AppNode } from "../../types/appNode";
import { InputType } from "../../types/input-types";
import { TaskType } from "../../types/task";
import { getDefaultInputs } from "../../utils/add-form-fields";
import { CreateFlowNode } from "../../utils/create-flow-node";
import { getNewNodePosition } from "../../utils/get-new-node-position";

// Centralized icon map
const Icons: Record<string, LucideIcon> = {
  text: TextCursorInput,
  textarea: AlignLeft,
  number: Hash,
  select: List,
};

const sidebarFormElements = [
  {
    name: "Text",
    icon: TextCursorInput,
    type: InputType.TEXT,
    description: "Enter your text",
  },
  {
    name: "Textarea",
    icon: AlignLeft,
    type: InputType.TEXTAREA,
    description: "Enter your textarea",
  },
  {
    name: "Number",
    icon: Hash,
    type: InputType.NUMBER,
    description: "Enter your number",
  },
  {
    name: "Select",
    icon: List,
    type: InputType.SELECT,
    description: "Select your option",
  },
  {
    name: "Date",
    icon: Calendar,
    type: InputType.DATE,
    description: "Pick a date",
  },
];

const sidebarMathOperationsElements = [
  {
    name: "Addition",
    icon: Plus,
    type: TaskType.ADDITION_OPREATION,
    description: "Addition two numbers",
  },
  {
    name: "Subtraction",
    icon: Minus,
    type: TaskType.SUBTRACTION_OPREATION,
    description: "Subtraction two numbers",
  },
  {
    name: "Multiplication",
    icon: X,
    type: TaskType.MULTIPLICATION_OPREATION,
    description: "Multiplication two numbers",
  },
  {
    name: "Division",
    icon: Divide,
    type: TaskType.DIVISION_OPREATION,
    description: "Division two numbers",
  },
  {
    name: "Percentage",
    icon: Percent,
    type: TaskType.PERCENTAGE_OPREATION,
    description: "Percentage two numbers",
  },
  {
    name: "Number to String",
    icon: Type,
    type: TaskType.NUMBER_TO_STRING_OPREATION,
    description: "Convert number to string",
  },
  {
    name: "Letter Case",
    icon: ALargeSmall,
    type: TaskType.LETTERCASE_OPREATION,
    description: "Convert letter case",
  },
  {
    name: "Number Format",
    icon: DecimalsArrowRight,
    type: TaskType.NUMBER_FORMAT_OPREATION,
    description: "Convert number format",
  },
  {
    name: "Suffix",
    icon: ArrowLeft,
    type: TaskType.SUFFIX_OPREATION,
    description: "Add suffix to string",
  },
  {
    name: "Prefix",
    icon: ArrowRight,
    type: TaskType.PREFIX_OPREATION,
    description: "Add prefix to string",
  },
];

export function EditorSidebar() {
  const { updateNodeData, getNode, setNodes, getNodes } = useReactFlow();

  return (
    <Sidebar className="mt-[60px]">
      <SidebarHeader />
      <SidebarContent className="overflow-y-auto">
        <SidebarGroup>
          <SidebarGroupLabel>Form Elements</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarFormElements.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarCustomMenuButton
                    icon={item.icon}
                    title={item.name}
                    description={item.description}
                    onClick={() => {
                      const node = getNode("formId") as AppNode;
                      updateNodeData("formId", {
                        dynamicInputs: [
                          ...(node.data.dynamicInputs ?? []),
                          {
                            ...getDefaultInputs(item.type),
                            handleId: crypto.randomUUID(),
                          },
                        ],
                      });
                    }}
                  />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Operations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarMathOperationsElements.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarCustomMenuButton
                    icon={item.icon}
                    title={item.name}
                    description={item.description}
                    onClick={() => {
                      const newNode = CreateFlowNode(
                        item.type as TaskType,
                        getNewNodePosition(getNodes() as AppNode[], item.type)
                      );
                      setNodes((nds) => nds.concat(newNode));
                    }}
                  />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter />
    </Sidebar>
  );
}

// Custom Menu Button Type
type SidebarCustomMenuButtonProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
};

// Reusable Custom Button Component
export const SidebarCustomMenuButton = ({ icon: Icon, title, description, onClick }: SidebarCustomMenuButtonProps) => (
  <Tooltip>
    <TooltipTrigger className="w-full">
      <div
        onClick={onClick}
        className={cn(
          "group hover:bg-accent/40 flex cursor-pointer items-center justify-between rounded-md px-2 py-1 transition-all duration-200"
        )}
      >
        {/* Left side: icon + text */}
        <div className="flex items-center gap-2">
          <Icon className="stroke-muted-foreground size-5 transition-transform duration-200" />

          <div className="space-y-2 text-left">
            <h4 className="text-sm leading-none font-medium">{title}</h4>
          </div>
        </div>

        {/* Right side: Plus icon (only visible on hover) */}
        <div className="shrink-0 rounded-lg p-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <Plus className="stroke-muted-foreground h-5 w-5" />
        </div>
      </div>
    </TooltipTrigger>
    <TooltipContent side="right">
      <p>{description}</p>
    </TooltipContent>
  </Tooltip>
);
