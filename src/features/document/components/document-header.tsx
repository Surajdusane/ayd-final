"use client";

import DocumentUploadButton from "./document-upload-button";
import DocumentSearchFilter from "./document-search-filterr";

const DocumentHeader = () => {
  return (
    <div className="flex justify-between">
      <DocumentSearchFilter />
      <DocumentUploadButton  />
    </div>
  )
}

export default DocumentHeader