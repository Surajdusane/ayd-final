import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Spinner } from "@/components/ui/spinner";
import { useDownloadDocument } from "@/hooks/use-document-download";
import { RouterOutputs } from "@/trpc/routers/_app";
import { useState } from "react";
import { toast } from "sonner";

type DocumentOutput = RouterOutputs["documents"]["getById"];

export const DownloadDocumentActions = ({ document }: { document: DocumentOutput }) => {
  const downloadDocument = useDownloadDocument();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      await downloadDocument(document.path, document.name || "document");
      toast.success("Document downloaded successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to download document");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button
      size="icon"
      variant="outline"
      className="rounded-full text-xs"
      onClick={handleDownload}
      disabled={isDownloading}
      aria-label="Download document"
    >
      {isDownloading ? (
        <Spinner className="bg-foreground" size={16} />
      ) : (
        <Icons.ArrowDownward className="text-muted-foreground/40" size={16} />
      )}
    </Button>
  );
};
