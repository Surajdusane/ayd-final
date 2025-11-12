import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Spinner } from "@/components/ui/spinner";
import { useConfirm } from "@/hooks/use-confirm";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const DeleteDocumentActions = ({ documentpath }: { documentpath: string }) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [ConfirmationDialog, confirm] = useConfirm(
    "Delete document",
    "Are you sure you want to delete this document? This action cannot be undone."
  );

  const deleteDocumentMutation = useMutation({
    ...trpc.documents.remove.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.documents.getAllByUser.queryOptions());
      toast.success("Document deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete document");
      console.error("Delete document error:", error);
    },
  });

  const handleDelete = async () => {
    const isConfirmed = await confirm();
    if (isConfirmed) {
      deleteDocumentMutation.mutate({ path: documentpath });
    }
  };

  return (
    <>
      <Button
        size="icon"
        onClick={handleDelete}
        variant="outline"
        className="rounded-full text-xs"
        disabled={deleteDocumentMutation.isPending}
        aria-label="Delete document"
      >
        {deleteDocumentMutation.isPending ? (
          <Spinner className="" size={16} />
        ) : (
          <Icons.Delete className="text-muted-foreground/40" size={16} />
        )}
      </Button>
      <ConfirmationDialog />
    </>
  );
};