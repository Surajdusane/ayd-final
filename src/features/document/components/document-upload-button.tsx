"use client";

import { useRef, useState } from "react";
import { stripSpecialCharacters } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import mammoth from "mammoth";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Spinner } from "@/components/ui/spinner";
import { useUserQuery } from "@/hooks/use-user";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { createClient } from "@/utils/supabase/client";

interface DocumentUploadButtonProps {
  textVisible?: boolean;
  hideIcon?: boolean;
}

const DocumentUploadButton = ({ textVisible, hideIcon }: DocumentUploadButtonProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { data: user } = useUserQuery();
  const supabase = createClient();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const mutate = useMutation(
    trpc.documents.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.documents.getAllByUser.queryOptions());
      },
    })
  );

  const extractDocxVariablesFromFile = async (file: File): Promise<string[]> => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    const fullText = result.value;

    const variableRegex = /{{\s*(\w+)\s*}}/g;
    const tagRegex = /{%\s*(?:if|for)\s+(\w+)/g;

    const variablesSet = new Set<string>();
    let match;

    while ((match = variableRegex.exec(fullText)) !== null) {
      variablesSet.add(match[1]);
    }

    while ((match = tagRegex.exec(fullText)) !== null) {
      variablesSet.add(match[1]);
    }

    return Array.from(variablesSet).sort();
  };

  const handleButtonClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    // Validate user
    if (!user?.id) {
      toast.error("Please log in to upload files");
      return;
    }

    // Validate file type
    if (!file.name.endsWith(".docx")) {
      toast.error("Please upload .docx files only");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large - maximum size is 5MB");
      return;
    }

    setIsUploading(true);
    const uploadToast = toast.loading("Processing document...", {
      id: "upload-document",
    });

    try {
      // Extract variables
      const extractedVariables = await extractDocxVariablesFromFile(file);

      if (extractedVariables.length === 0) {
        toast.error("No variables found in document", {
          id: "upload-document",
        });
        return;
      }

      if (extractedVariables.length > 0) {
        toast.success(`Found ${extractedVariables.length} variables`, {
          id: "upload-document",
        });
      }

      // Upload to Supabase
      toast.loading("Uploading document...", { id: "upload-document" });

      const filename = stripSpecialCharacters(file.name);
      const timestamp = Date.now();
      const filePath = `${user.id}/${timestamp}-${filename}`;

      const { data, error } = await supabase.storage.from("documents").upload(filePath, file, {
        cacheControl: "3600",
      });

      if (error) throw error;

      mutate.mutate({
        id: data.id,
        name: filename,
        userId: user.id,
        metadata: {
          variables: extractedVariables,
        },
        path: data.path,
      });

      console.log(data);

      // Success
      toast.success("Document uploaded successfully", {
        id: "upload-document",
        description:
          extractedVariables.length > 0
            ? `Template with ${extractedVariables.length} variables ready`
            : "Document stored successfully",
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload failed - please try again", {
        id: "upload-document",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size={textVisible ? "default" : "icon"}
        onClick={handleButtonClick}
        type="button"
        disabled={isUploading}
      >
        {!hideIcon && (isUploading ? <Spinner size={17} /> : <Icons.Add size={17} />)}
        {textVisible && <span className={cn(hideIcon ? "" : "ml-2")}>{isUploading ? "Uploading..." : "Upload"}</span>}
      </Button>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".docx"
        multiple={false}
        className="hidden"
        disabled={isUploading}
      />
    </>
  );
};

export default DocumentUploadButton;
