import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { FormFieldType } from "@/features/editor/types/input-types";
import FormClient from "@/features/form/components/form-client-wraper";
import { prefetchFormData } from "@/features/form/server/prefetch";
import { HydrateClient } from "@/trpc/server";

const page = async ({ params }: { params: Promise<{ formid: string }> }) => {
  const { formid } = await params;

  prefetchFormData(formid);

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<div>Error</div>}>
        <Suspense fallback={<div>Loading...</div>}>
          <div className="mx-auto max-w-xl py-10">
            <FormClient formId={formid} />
          </div>
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
};

export default page;
