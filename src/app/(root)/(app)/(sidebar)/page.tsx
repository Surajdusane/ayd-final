import { Suspense } from "react";

import WorkflowHeader from "@/features/workflow/components/header";
import { WorkflowsList } from "@/features/workflow/components/workflows";
import { prefetchWorkflows } from "@/features/workflow/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";

export const dynamic = 'force-dynamic';

const page = async () => {
  await requireAuth();

  prefetchWorkflows();

  return (
    <div className="flex w-full flex-col gap-y-4">
      <WorkflowHeader />
      <Suspense fallback={<div>Loading...</div>}>
        <WorkflowsList />
      </Suspense>
    </div>
  );
};

export default page;
