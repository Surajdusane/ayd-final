"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { ReactFlowProvider } from "@xyflow/react";
import { EditorSidebar } from "../editor-sidebar";

import Topbar from "./topbar";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import SheetProvider from "../../providers/sheet-provider";

const FlowEditor = dynamic(() => import("./flow-editor"), { ssr: false });



const Editor = ({id} : {id: string}) => {
  const trpc = useTRPC()
  const {data : workflow} = useSuspenseQuery(trpc.workflow.getById.queryOptions({
        workflowId: id,
      }))

  return (
    <ReactFlowProvider>
      <SidebarProvider>
        <div className="flex flex-col size-full overflow-hidden">
          <section className="flex h-full overflow-auto relative">
            <Topbar
              title={workflow.name?.toUpperCase() || "Workflow Editor"}
              workflowId={workflow.id}
            />
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
