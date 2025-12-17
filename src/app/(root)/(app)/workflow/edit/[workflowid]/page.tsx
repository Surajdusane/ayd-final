import React, { Suspense } from "react";

import { requireAuth } from "@/lib/auth-utils";
import { batchPrefetch, getQueryClient, trpc } from "@/trpc/server";
import Editor from "@/features/editor/components/editor";

const page = async ({ params }: { params: Promise<{ workflowid: string }> }) => {
  const { workflowid } = await params;
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.workflow.getById.queryOptions({
      workflowId: workflowid,
    })
  );
  void queryClient.prefetchQuery(trpc.documents.getAllByUser.queryOptions());
  
  await requireAuth();
  return <Suspense fallback={<div>Loading...</div>}>
    <Editor id={workflowid} />
  </Suspense>;
};

export default page;
