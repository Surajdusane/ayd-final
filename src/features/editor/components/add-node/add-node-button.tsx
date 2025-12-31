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
  Minus,
  Percent,
  Plus,
  TextCursorInput,
  Type,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";

import { InputType } from "../../types/input-types";
import { TaskType } from "../../types/task";

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

export function AddNodeButton() {
  return (
    <Dialog>
      <DialogTrigger asChild className="">
        <Button variant="outline">Add node</Button>
      </DialogTrigger>
      <DialogContent className="min-h-[90%] min-w-[70%]">
        <DialogTitle />
        <div className="flex items-start gap-x-4">
          <div className="flex h-full min-w-1/4 flex-col gap-y-2">
            <h3 className="mb-3 text-xl font-semibold">Form Elements</h3>
            {sidebarFormElements.map((elementitem, index) => (
              <Item key={index} variant="outline" size="sm" className="group border">
                <ItemMedia>
                  <elementitem.icon className="size-4" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{elementitem.name}</ItemTitle>
                  {/* <ItemDescription>{elementitem.description}</ItemDescription> */}
                </ItemContent>
                <ItemActions className="hidden group-hover:block">
                  <Plus className="size-4" />
                </ItemActions>
              </Item>
            ))}
          </div>
          <div className="flex h-full min-w-1/4 flex-col gap-y-2">
            <h3 className="mb-3 text-xl font-semibold">Opeation Nodes</h3>
            {sidebarMathOperationsElements.map((elementitem, index) => (
              <Item key={index} variant="outline" size="sm" className="group border">
                <ItemMedia>
                  <elementitem.icon className="size-4" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{elementitem.name}</ItemTitle>
                  {/* <ItemDescription>{elementitem.description}</ItemDescription> */}
                </ItemContent>
                <ItemActions className="hidden group-hover:block">
                  <Plus className="size-4" />
                </ItemActions>
              </Item>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
