import { Suspense } from "react";

import WorkflowHeader from "@/features/workflow/components/header";
import { WorkflowsList } from "@/features/workflow/components/workflows";
import { prefetchWorkflows } from "@/features/workflow/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";

export const dynamic = "force-dynamic";

const page = async () => {
  await requireAuth();

  prefetchWorkflows();

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<div>Error</div>}>
    <div className="flex w-full flex-col gap-y-4">
      <WorkflowHeader />
      <Suspense fallback={<div>Loading...</div>}>
        <WorkflowsList />
      </Suspense>
    </div>
    </ErrorBoundary>
    </HydrateClient>
  );
};

export default page;
