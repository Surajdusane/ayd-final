"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

import { DocumetGetStarted } from "./document-get-started";
import DocumentItem from "./document-item";
import { cn } from "@/lib/utils";

export function DocumetView() {
  const trpc = useTRPC();
  const { data: documents } = useSuspenseQuery(trpc.documents.getAllByUser.queryOptions());

  if (documents.length === 0) {
    return <DocumetGetStarted />;
  }

  return (
    <div className={cn("flex gap-4 pt-4 flex-wrap", documents.length < 3 && "flex-nowrap")}>
      {documents.map((document) => (
        <DocumentItem key={document.id} document={document} />
      ))}
    </div>
  );
}
