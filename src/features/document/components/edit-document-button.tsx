import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useTRPC } from "@/trpc/client";
import { RouterOutputs } from "@/trpc/routers/_app";

type DocumentOutput = RouterOutputs["documents"]["getById"];

const EDIT_DOCUMENT_SCHEMA = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name must be 50 characters or less"),
});

export const EditDocumentActions = ({ document }: { document: DocumentOutput }) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof EDIT_DOCUMENT_SCHEMA>>({
    resolver: zodResolver(EDIT_DOCUMENT_SCHEMA),
    defaultValues: {
      name: document.name || "",
    },
  });

  const updateDocumentMutation = useMutation({
    ...trpc.documents.update.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.documents.getAllByUser.queryOptions());
      setIsOpen(false);
      toast.success("Document updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update document");
      console.error("Update document error:", error);
    },
  });

  const handleSubmit = (data: z.infer<typeof EDIT_DOCUMENT_SCHEMA>) => {
    updateDocumentMutation.mutate({
      id: document.id,
      name: data.name,
    });
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      form.reset();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline" className="rounded-full text-xs" aria-label="Edit document">
          <Icons.Edit className="text-muted-foreground/40" size={16} />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <DialogHeader>
              <DialogTitle>Edit document</DialogTitle>
              <DialogDescription>Make changes and click save when you're done.</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter document name" {...field} disabled={updateDocumentMutation.isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={updateDocumentMutation.isPending}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={updateDocumentMutation.isPending || !form.formState.isDirty}>
                {updateDocumentMutation.isPending ? <Spinner className="bg-foreground" /> : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
