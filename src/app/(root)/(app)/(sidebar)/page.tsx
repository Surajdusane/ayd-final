import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { WorkflowsList } from "@/features/workflow/components/workflows";
import { prefetchWorkflows } from "@/features/workflow/server/prefetch";

const page = async () => {
  await requireAuth();

  prefetchWorkflows();

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
