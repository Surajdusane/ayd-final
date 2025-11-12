"use client";

import DocumentSearchFilter from "./document-search-filterr";
import DocumentUploadButton from "./document-upload-button";

const DocumentHeader = () => {
  return (
    <div className="flex justify-between">
      <DocumentSearchFilter />
      <DocumentUploadButton />
    </div>
  );
};

export default DocumentHeader;
