"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { createClient } from "@/utils/supabase/client";

export const useGetDocumentsLink = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const supabase = createClient();

  const getDocumentLink = async (id: string): Promise<string | null> => {
    const document = await queryClient.fetchQuery(
      trpc.documents.getById.queryOptions({ id })
    );

    if (!document) return null;

    const { data, error } = await supabase.storage
      .from("documents")
      .createSignedUrl(document.path, 60);

    if (error) {
      console.error(error);
      return null;
    }

    return data?.signedUrl ?? null;
  };

  return { getDocumentLink };
};
