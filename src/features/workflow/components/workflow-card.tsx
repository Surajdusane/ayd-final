import React from "react";
import Link from "next/link";
import { inferOutput } from "@trpc/tanstack-react-query";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { trpc } from "@/trpc/server";

type WorkflowCardProps = inferOutput<typeof trpc.workflow.getMany>[number];

const WorkflowCard = (props: WorkflowCardProps) => {
  return (
    <Card>
      <CardContent className="flex items-center justify-between">
        <div className="flex max-w-1/2 flex-col">
          <h3 className="line-clamp-1 truncate capitalize">{props.name}</h3>
          <p className="line-clamp-1 truncate">{props.description}</p>
        </div>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button variant="outline" size="icon" asChild>
            <Link href={"/workflow/edit/" + props.id} target="_blank">
              <Icons.Edit size={20} />
            </Link>
          </Button>
          <Button variant="outline" size="icon">
            <Icons.Delete size={20} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkflowCard;
