import React from "react";
import { inferOutput } from "@trpc/tanstack-react-query";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { trpc } from "@/trpc/server";

type WorkflowCardProps = inferOutput<typeof trpc.workflow.getMany>[number];

const WorkflowCard = (props: WorkflowCardProps) => {
  return (
    <Card >
      <CardContent className="flex items-center justify-between">
        <div className="flex flex-col max-w-1/2">
          <h3 className="capitalize truncate line-clamp-1">{props.name}</h3>
          <p className="line-clamp-1 truncate">{props.description}</p>
        </div>
        <div className="flex items-center justify-center gap-4 flex-col sm:flex-row">
          <Button variant="outline" size="icon">
            <Icons.Edit size={20}/>
          </Button>
          <Button variant="outline" size="icon">
            <Icons.Delete size={20}/>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkflowCard;
