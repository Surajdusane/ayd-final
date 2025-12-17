import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Clipboard, Plus } from "lucide-react";
import { TaskType } from "../../types/task";

const sidebarDocumentElements = [
  {
    name: "Offer letter",
    icon: Clipboard,
    type: TaskType.DOCUMENT_NODE,
    description: "Offer letter",
  },
  {
    name: "Resignation letter",
    icon: Clipboard,
    type: TaskType.DOCUMENT_NODE,
    description: "Resignation letter",
  },
  {
    name: "Letter of recommendation",
    icon: Clipboard,
    type: TaskType.DOCUMENT_NODE,
    description: "Letter of recommendation",
  },
  {
    name: "Salary slip",
    icon: Clipboard,
    type: TaskType.DOCUMENT_NODE,
    description: "Salary slip",
  },
];

export function AddDocumentNodeButton({onclick} : {onclick : () => void}) {
  return (
    <Dialog>
      <DialogTrigger asChild className="">
        <Button variant="outline">Add Document Node</Button>
      </DialogTrigger>
      <DialogContent className="min-h-[90%] min-w-[70%] transition-all duration-300">
        <DialogTitle className="absolute hidden"/>
        <div className="flex items-start gap-x-4">
          <div className="h-full min-w-1/4 flex flex-col gap-y-2">
            <h3 className="text-xl font-semibold mb-3">Available Documents</h3>
            {sidebarDocumentElements.map((elementitem, index) => (
              <Item
                key={index}
                variant="outline"
                size="sm"
                className="group border"
                onClick={onclick}
              >
                <ItemMedia>
                  <elementitem.icon className="size-4" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{elementitem.name}</ItemTitle>
                </ItemContent>
                <ItemActions className="hidden group-hover:block ">
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
