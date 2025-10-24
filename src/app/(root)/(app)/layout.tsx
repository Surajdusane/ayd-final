import React, { Suspense } from "react";
import { redirect } from "next/navigation";
import { ErrorBoundary } from "react-error-boundary";

import { getQueryClient, HydrateClient, prefetch, trpc } from "@/trpc/server";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const queryClient = getQueryClient();
  const user = await queryClient.fetchQuery(trpc.user.me.queryOptions());

  if (!user) {
    redirect("/login");
  }

  if (!user.fullName) {
    redirect("/setup");
  }

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <div className="">{children}</div>
      </ErrorBoundary>
    </HydrateClient>
  );
};

export default layout;
