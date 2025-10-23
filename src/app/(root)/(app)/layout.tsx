import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import LoadingPage from "@/components/global/loading-page";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

const layout = ({ children }: { children: React.ReactNode }) => {
  prefetch(trpc.user.me.queryOptions());
  return (
    <HydrateClient>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <Suspense fallback={<LoadingPage />}>
          <div className="h-full w-full">{children}</div>
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
};

export default layout;
