"use client";

import { useState, type ReactNode } from "react";
import { stripSpecialCharacters } from "@/utils";
import { useDropzone, type FileRejection } from "react-dropzone";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { useUserQuery } from "@/hooks/use-user";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";

type UploadData = {
  file_path: string[];
  mimetype: string;
  size: number;
};

type Props = {
  children: ReactNode;
  onUpload?: (result: UploadData) => void;
};

export function DocumentUploadZone({ onUpload, children }: Props) {
  const { data: user, isLoading: userLoading } = useUserQuery();
  const supabase = createClient();
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = async (acceptedFiles: File[]) => {
    if (!user?.id) {
      toast.error("User not authenticated. Please log in.", { duration: 2500 });
      return;
    }

    if (acceptedFiles.length === 0) {
      toast.error("No file selected.", { duration: 2500 });
      return;
    }

    if (acceptedFiles.length > 1) {
      toast.warning("Please upload one file at a time.", { duration: 2500 });
      return;
    }

    const file = acceptedFiles[0];
    setIsUploading(true);
    toast.loading("Document is uploading...", { id: "upload-status" });

    try {
      const filename = stripSpecialCharacters(file.name);
      const timestamp = Date.now();
      const filePath = `${user.id}/${timestamp}-${filename}`;

      const { data, error } = await supabase.storage.from("documents").upload(filePath, file, {
        cacheControl: "3600",
      });

      if (error) {
        throw error;
      }

      const uploadResult: UploadData = {
        file_path: [user.id, `${timestamp}-${filename}`],
        mimetype: file.type,
        size: file.size,
      };

      toast.dismiss("upload-status");
      toast.success("Document uploaded successfully.", { duration: 2000 });
      onUpload?.(uploadResult);
    } catch (error) {
      console.error("Upload error:", error);
      toast.dismiss("upload-status");
      toast.error("Upload failed. Please try again.", { duration: 2500 });
    } finally {
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected: (rejections: FileRejection[]) => {
      rejections.forEach((rejection) => {
        const hasLargeFile = rejection.errors.some(({ code }) => code === "file-too-large");
        const hasInvalidType = rejection.errors.some(({ code }) => code === "file-invalid-type");

        if (hasLargeFile) {
          toast.error("File size is too large (max 5MB).", { duration: 2500 });
        }

        if (hasInvalidType) {
          toast.error("File type not supported. Only .doc and .docx files are allowed.", { duration: 2500 });
        }
      });
    },
    maxSize: 5000000,
    maxFiles: 1,
    accept: {
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    disabled: isUploading || !user?.id || userLoading,
  });

  return (
    <div className="relative h-full" {...getRootProps({ onClick: (evt) => evt.stopPropagation() })}>
      <div className="pointer-events-none absolute top-0 right-0 left-0 z-51 h-[calc(100vh-150px)] w-full">
        <div
          className={cn(
            "bg-background flex h-full w-full items-center justify-center text-center dark:bg-[#1A1A1A]",
            isDragActive && !isUploading ? "visible" : "invisible"
          )}
        >
          <Input {...getInputProps()} id="upload-files" disabled={isUploading} />

          <div className="flex flex-col items-center justify-center gap-2">
            <p className="text-xs">
              Drop your document here. <br />
              One file at a time.
            </p>

            <span className="text-muted-foreground text-xs">Max file size 5MB (.doc, .docx)</span>
          </div>
        </div>
      </div>

      {children}
    </div>
  );
}
