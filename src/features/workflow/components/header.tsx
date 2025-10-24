"use client";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

import { useCreateWorkflow } from "../hooks/use-workflows";

const WorkflowHeader = () => {
  const createWorkflow = useCreateWorkflow();

  const handleCreate = () => {
    createWorkflow.mutate(undefined, {
      onError: (err) => {
        // TODO: handle upgrade
        console.log(err);
      },
    });
  };

  return (
    <div className="flex w-full items-center justify-between">
      <InputGroup className="w-[200px] sm:w-[350px]">
        <InputGroupInput placeholder="Search workflows" />
        <InputGroupAddon>
          <Icons.Search />
        </InputGroupAddon>
      </InputGroup>
      <Button size={"icon"} variant={"outline"} onClick={() => handleCreate()} disabled={createWorkflow.isPending}>
        <Icons.Add />
      </Button>
    </div>
  );
};

export default WorkflowHeader;
