"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";

import { DocumetGetStarted } from "./document-get-started";
import DocumentItem from "./document-item";

export function DocumetView() {
  const trpc = useTRPC();
  const { data: documents } = useSuspenseQuery(trpc.documents.getAllByUser.queryOptions());

  if (documents.length === 0) {
    return <DocumetGetStarted />;
  }

  return (
    <div className={cn("flex flex-wrap gap-4 pt-4", documents.length < 3 && "flex-nowrap")}>
      {documents.map((document) => (
        <DocumentItem key={document.id} document={document} />
      ))}
    </div>
  );
}
