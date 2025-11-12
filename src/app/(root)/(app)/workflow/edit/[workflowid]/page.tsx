import React, { Suspense } from "react";

import { requireAuth } from "@/lib/auth-utils";
import { getQueryClient, trpc } from "@/trpc/server";

const page = async ({ params }: { params: Promise<{ workflowid: string }> }) => {
  const { workflowid } = await params;
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.workflow.getById.queryOptions({
      workflowId: workflowid,
    })
  );
  await requireAuth();
  return <Suspense fallback={<div>Loading...</div>}>
    
  </Suspense>;
};

export default page;
