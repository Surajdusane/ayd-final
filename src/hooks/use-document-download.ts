import { createClient } from "@/utils/supabase/client";

export const useDownloadDocument = () => {
  const supabase = createClient();

  const downloadDocument = async (documentPath: string, fileName: string) => {
    const { data, error } = await supabase.storage.from("documents").download(documentPath);
    if (error) {
      throw new Error(error.message);
    }

    // Create a download link and trigger download
    const url = URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return data;
  };

  return downloadDocument;
};
