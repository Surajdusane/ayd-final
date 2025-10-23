
import { WorkflowsList } from "@/features/workflow/components/workflows";
import { prefetchWorkflows } from "@/features/workflow/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

const page = async () => {
  await requireAuth()

  prefetchWorkflows()

  return (
    <HydrateClient>
        <ErrorBoundary fallback={<div>Error</div>}>
          <Suspense fallback={<div>Loading...</div>}>
            <WorkflowsList />
          </Suspense>
        </ErrorBoundary>
    </HydrateClient>
  );
};

export default page;
