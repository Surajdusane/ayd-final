import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import Editor from "@/features/editor/components/editor";
import { prefetchDocuments, prefetchWorkflow, prefetchWorkflowData } from "@/features/editor/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";

const page = async ({ params }: { params: Promise<{ workflowid: string }> }) => {
  await requireAuth();

  const { workflowid } = await params;

  prefetchDocuments();
  prefetchWorkflow(workflowid);
  prefetchWorkflowData(workflowid);

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<div>Error</div>}>
        <Suspense fallback={<div>Loading...</div>}>
          <Editor id={workflowid} />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
};

export default page;
