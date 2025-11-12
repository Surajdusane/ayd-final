import { Suspense } from "react";

import DocumentHeader from "@/features/document/components/document-header";
import { DocumetView } from "@/features/document/components/document-view";
import { getQueryClient, trpc } from "@/trpc/server";

const page = async () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.documents.getAllByUser.queryOptions());
  return (
    <div>
      <DocumentHeader />
      <Suspense fallback={<div>Loading...</div>}>
        <DocumetView />
      </Suspense>
    </div>
  );
};

export default page;
