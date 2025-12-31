"use client";

import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import PizZip from "pizzip";

interface GenerationResult {
  filename: string;
  blob: Blob;
}

interface PizZipUtils {
  getBinaryContent: (url: string, callback: (error: Error | null, content?: ArrayBuffer) => void) => void;
}

let PizZipUtils: PizZipUtils | null = null;

if (typeof window !== "undefined") {
  import("pizzip/utils/index.js").then((module) => {
    PizZipUtils = module as unknown as PizZipUtils;
  });
}

const loadFile = (url: string): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    if (!PizZipUtils) {
      reject(new Error("PizZipUtils not loaded"));
      return;
    }
    PizZipUtils.getBinaryContent(url, (error: Error | null, content?: ArrayBuffer) => {
      if (error) reject(error);
      else if (content) resolve(content);
      else reject(new Error("No content received"));
    });
  });
};

const generateSingleDocument = async (
  templateUrl: string,
  data: Record<string, string | number | boolean>,
  filename?: string
): Promise<GenerationResult> => {
  try {
    const content = await loadFile(templateUrl);
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
      linebreaks: true,
      paragraphLoop: true,
    });

    doc.render(data);
    const blob = doc.toBlob();
    const finalFilename = filename || "document.docx";

    return {
      filename: finalFilename,
      blob,
    };
  } catch (error) {
    console.error(`Error generating document with template ${templateUrl}:`, error);
    throw error;
  }
};

export type TemplateConfig = {
  template: string;
  data: Record<string, string | number | boolean>;
  filename?: string;
};

export const generateBatchDocuments = async (
  configs: TemplateConfig[],
  onProgress?: (current: number, total: number) => void
): Promise<void> => {
  try {
    // If only one config, download single file
    if (configs.length === 1) {
      const { template, data, filename } = configs[0];
      const result = await generateSingleDocument(template, data, filename);
      saveAs(result.blob, result.filename);
      onProgress?.(1, 1);
      return;
    }

    // Multiple files: create zip archive
    const zipArchive = new JSZip();
    const results: GenerationResult[] = [];

    for (let i = 0; i < configs.length; i++) {
      const { template, data, filename } = configs[i];
      const defaultFilename = filename || `document_${i + 1}.docx`;

      const result = await generateSingleDocument(template, data, defaultFilename);
      results.push(result);

      onProgress?.(i + 1, configs.length);

      // Add small delay between generations
      if (i < configs.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    }

    // Add all documents to zip
    for (const result of results) {
      const arrayBuffer = await result.blob.arrayBuffer();
      zipArchive.file(result.filename, arrayBuffer);
    }

    // Generate and download zip
    const zipBlob = await zipArchive.generateAsync({ type: "blob" });
    const timestamp = new Date().toISOString().split("T")[0];
    saveAs(zipBlob, `documents_${timestamp}.zip`);
  } catch (error) {
    console.error("Error generating documents:", error);
    throw error;
  }
};
