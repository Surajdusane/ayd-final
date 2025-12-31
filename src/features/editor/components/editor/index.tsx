"use client";

import dynamic from "next/dynamic";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ReactFlowProvider } from "@xyflow/react";

import { SidebarProvider } from "@/components/ui/sidebar";
import { useTRPC } from "@/trpc/client";

import SheetProvider from "../../providers/sheet-provider";
import { EditorSidebar } from "../editor-sidebar";
import Topbar from "./topbar";

const FlowEditor = dynamic(() => import("./flow-editor"), { ssr: false });

const Editor = ({ id }: { id: string }) => {
  const trpc = useTRPC();
  const { data: workflow } = useSuspenseQuery(
    trpc.workflow.getById.queryOptions({
      workflowId: id,
    })
  );

  return (
    <ReactFlowProvider>
      <SidebarProvider>
        <div className="flex size-full flex-col overflow-hidden">
          <section className="relative flex h-full overflow-auto">
            <Topbar title={workflow.name?.toUpperCase() || "Workflow Editor"} workflowId={workflow.id} />
            <EditorSidebar />
            <FlowEditor workflow={workflow} />
          </section>
        </div>
      </SidebarProvider>
      <SheetProvider />
    </ReactFlowProvider>
  );
};

export default Editor;
