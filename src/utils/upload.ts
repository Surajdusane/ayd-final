import { stripSpecialCharacters } from "@/utils";
import type { SupabaseClient } from "@supabase/supabase-js";
import * as tus from "tus-js-client";

type ResumableUploadParams = {
  file: File;
  path: string[];
  bucket: string;
  onProgress?: (bytesUploaded: number, bytesTotal: number) => void;
};

export async function resumableUpload(
  client: SupabaseClient,
  { file, path, bucket, onProgress }: ResumableUploadParams
) {
  // Get session
  const {
    data: { session },
  } = await client.auth.getSession();

  if (!session?.access_token) {
    throw new Error("No active session. Please log in.");
  }

  // Get Supabase URL from environment
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL environment variable is not set");
  }

  const filename = stripSpecialCharacters(file.name);
  const fullPath = decodeURIComponent([...path, filename].join("/"));

  return new Promise((resolve, reject) => {
    const upload = new tus.Upload(file, {
      endpoint: `${supabaseUrl}/storage/v1/upload/resumable`,
      retryDelays: [0, 3000, 5000, 10000],
      metadata: {
        bucketName: bucket,
        objectName: fullPath,
        contentType: file.type,
        cacheControl: "3600",
      },
      chunkSize: 6 * 1024 * 1024, // 6MB chunks
      onError: (error) => {
        console.error("Tus upload error:", error);
        reject(new Error(`Upload failed: ${error.message}`));
      },
      onProgress,
      onSuccess: () => {
        resolve({
          ...upload,
          filename,
        });
      },
    });

    // Check if there are any previous uploads to continue
    upload
      .findPreviousUploads()
      .then((previousUploads) => {
        if (previousUploads.length) {
          console.log(`Resuming previous upload: ${previousUploads[0]}`);
          upload.resumeFromPreviousUpload(previousUploads[0]);
        }

        upload.start();
      })
      .catch((error) => {
        console.error("Error finding previous uploads:", error);
        reject(error);
      });
  });
}
