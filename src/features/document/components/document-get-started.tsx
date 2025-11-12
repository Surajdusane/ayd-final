import { Button } from "@/components/ui/button";
import DocumentUploadButton from "./document-upload-button";


export function DocumetGetStarted() {
  return (
    <div className="h-[calc(100vh-250px)] flex items-center justify-center">
      <div className="relative z-20 m-auto flex w-full max-w-[380px] flex-col">
        <div className="flex w-full flex-col relative text-center">
          <div className="pb-4">
            <h2 className="font-medium text-lg">Upload your docs templates</h2>
          </div>

          <p className=" text-sm text-[#878787]">
            This documents required to contain atlist one variable in form of {`{ variable }`}. if you still don't know what is a variable, you can read more about it <a href="https://www.markdownguide.org/basic-syntax/#variables" target="_blank" className=" underline">here</a>
          </p>

          {/* <Button
            variant="outline"
            onClick={() => document.getElementById("upload-files")?.click()}
          >
            Upload
          </Button> */}
          <DocumentUploadButton textVisible={true} hideIcon={true} />
        </div>
      </div>
    </div>
  );
}