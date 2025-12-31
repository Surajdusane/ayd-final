// features/execution/hooks/use-document-generator.ts
import { useCallback, useState } from "react";

import { generateBatchDocuments, TemplateConfig } from "@/features/execution/lib/generate-document";

interface UseDocumentGeneratorOptions {
  onSuccess?: (result: GenerationResult) => void;
  onError?: (error: Error) => void;
  onProgress?: (progress: GenerationProgress) => void;
}

interface GenerationProgress {
  current: number;
  total: number;
  status: "idle" | "generating" | "completed" | "error";
  currentFilename?: string;
}

interface GenerationResult {
  filename: string;
  downloadUrl: string;
  format: "single" | "zip";
  timestamp: Date;
}

interface UseDocumentGeneratorReturn {
  isLoading: boolean;
  progress: GenerationProgress;
  progressPercentage: number;
  lastResult: GenerationResult | null;
  generateDocuments: (configs: TemplateConfig[]) => Promise<GenerationResult>;
  generateSingleDocument: (config: TemplateConfig) => Promise<GenerationResult>;
  generateFromExecutionData: (executionData: {
    documentId: string;
    values: Record<string, string | number | boolean>;
    filename?: string;
  }) => Promise<GenerationResult>;
  reset: () => void;
}

export function useDocumentGenerator(options: UseDocumentGeneratorOptions = {}): UseDocumentGeneratorReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<GenerationProgress>({
    current: 0,
    total: 0,
    status: "idle",
  });
  const [lastResult, setLastResult] = useState<GenerationResult | null>(null);

  const updateProgress = useCallback(
    (update: Partial<GenerationProgress>) => {
      setProgress((prev) => ({ ...prev, ...update }));
      options.onProgress?.({ ...progress, ...update });
    },
    [options]
  );

  const generateDocuments = useCallback(
    async (configs: TemplateConfig[]): Promise<GenerationResult> => {
      if (configs.length === 0) {
        throw new Error("No document configurations provided");
      }

      setIsLoading(true);
      updateProgress({
        current: 0,
        total: configs.length,
        status: "generating",
        currentFilename: configs[0]?.filename,
      });

      try {
        await generateBatchDocuments(configs, (current, total) => {
          updateProgress({
            current,
            total,
            currentFilename: configs[current - 1]?.filename,
          });
        });

        const result: GenerationResult = {
          filename:
            configs.length === 1 && configs[0].filename
              ? configs[0].filename
              : `documents_${new Date().toISOString().split("T")[0]}.zip`,
          downloadUrl: "#", // This would come from generateBatchDocuments response
          format: configs.length === 1 ? "single" : "zip",
          timestamp: new Date(),
        };

        setLastResult(result);
        updateProgress({ status: "completed" });
        options.onSuccess?.(result);

        return result;
      } catch (error) {
        console.error("Failed to generate documents:", error);
        updateProgress({ status: "error" });

        const generationError = new Error(error instanceof Error ? error.message : "Failed to generate documents");
        options.onError?.(generationError);
        throw generationError;
      } finally {
        setIsLoading(false);
      }
    },
    [options, updateProgress]
  );

  const generateSingleDocument = useCallback(
    async (config: TemplateConfig): Promise<GenerationResult> => {
      return generateDocuments([config]);
    },
    [generateDocuments]
  );

  const generateFromExecutionData = useCallback(
    async (executionData: {
      documentId: string;
      values: Record<string, string | number | boolean>;
      filename?: string;
    }) => {
      // In a real implementation, you would fetch the document template
      // based on documentId and then generate the document
      const config: TemplateConfig = {
        template: `https://your-api.com/documents/${executionData.documentId}`, // This should come from your API
        data: executionData.values,
        filename: executionData.filename || `document_${Date.now()}.docx`,
      };

      return generateSingleDocument(config);
    },
    [generateSingleDocument]
  );

  const reset = useCallback(() => {
    setIsLoading(false);
    setProgress({
      current: 0,
      total: 0,
      status: "idle",
    });
    setLastResult(null);
  }, []);

  const progressPercentage = progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0;

  return {
    isLoading,
    progress,
    progressPercentage,
    lastResult,
    generateDocuments,
    generateSingleDocument,
    generateFromExecutionData,
    reset,
  };
}
