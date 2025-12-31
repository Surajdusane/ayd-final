import { useEffect } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
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
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import DocumentUploadButton from "@/features/document/components/document-upload-button";
import { useTRPC } from "@/trpc/client";

import { AppNode } from "../../types/appNode";
import { InputType } from "../../types/input-types";
import { TaskType } from "../../types/task";
import { getDefaultInputs } from "../../utils/add-form-fields";
import { CreateFlowNode } from "../../utils/create-flow-node";
import { getNewNodePosition } from "../../utils/get-new-node-position";
import { NavDocumentInput } from "./nav-document-input";
import { NavFormInput } from "./nav-form-input";
import { NavOpeation } from "./nav-opeation";

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
  const trpc = useTRPC();

  const { data: documents } = useSuspenseQuery(trpc.documents.getAllByUser.queryOptions());

  if (!documents) {
    return <div>Loading...</div>;
  }

  useEffect(() => console.log("component render"), []);

  const dynamicDocuments = documents.map((document) => {
    const metadata = typeof document.metadata === "string" ? JSON.parse(document.metadata) : document.metadata;

    const variables = metadata?.variables ?? [];
    return {
      id: document.id,
      name: document.name,
      dynamicInputs: variables.map((variable: string) => ({
        name: variable,
        handleId: crypto.randomUUID(),
      })),
    };
  });

  const formNodeOnClick = (type: InputType) => {
    const node = getNode("formId") as AppNode;
    updateNodeData("formId", {
      dynamicInputs: [
        ...(node.data.dynamicInputs ?? []),
        {
          ...getDefaultInputs(type),
        },
      ],
    });
  };

  const opeationNodeOnClick = (type: TaskType) => {
    const newNode = CreateFlowNode(type, getNewNodePosition(getNodes() as AppNode[], type));
    setNodes((nds) => nds.concat(newNode));
  };

  const documentNodeOnClick = (documentId: string) => {
    const newNode = CreateFlowNode(
      TaskType.DOCUMENT_NODE,
      getNewNodePosition(getNodes() as AppNode[], TaskType.DOCUMENT_NODE)
    );

    const newNodeWithDynamicInputs = {
      ...newNode,
      data: {
        documentName: dynamicDocuments.find((document) => document.id === documentId)?.name,
        ...newNode.data,
        documentId: dynamicDocuments.find((document) => document.id === documentId)?.id,
        dynamicInputs: [
          ...dynamicDocuments
            .filter((document) => document.id === documentId)
            .flatMap((document) => document.dynamicInputs),
        ],
      },
    };

    setNodes((nds) => nds.concat(newNodeWithDynamicInputs));
  };

  return (
    <Sidebar className="mt-[60px] max-h-[calc(100vh-60px)] overflow-y-auto">
      <SidebarContent className="scrollbar-hide">
        <NavFormInput items={sidebarFormElements} onClick={(type: InputType) => formNodeOnClick(type)} />
        <NavOpeation items={sidebarMathOperationsElements} onClick={(type: TaskType) => opeationNodeOnClick(type)} />
        <NavDocumentInput
          items={dynamicDocuments.map((item) => ({
            id: item.id,
            name: item.name ?? "Untitled Document", // fallback if name is null
          }))}
          onClick={(id: string) => documentNodeOnClick(id)}
        />
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <DocumentUploadButton textVisible={true} />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
