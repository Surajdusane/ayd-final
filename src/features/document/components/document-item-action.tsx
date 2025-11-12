import { RouterOutputs } from "@/trpc/routers/_app";

import { DeleteDocumentActions } from "./delete-document-button";
import { DownloadDocumentActions } from "./download-document-button";
import { EditDocumentActions } from "./edit-document-button";

type DocumentOutput = RouterOutputs["documents"]["getById"];

export const DocumentItemActions = ({ document }: { document: DocumentOutput }) => {
  return (
    <div className="flex justify-between gap-2">
      <EditDocumentActions document={document} />
      <DeleteDocumentActions documentpath={document.path} />
      <DownloadDocumentActions document={document} />
    </div>
  );
};
