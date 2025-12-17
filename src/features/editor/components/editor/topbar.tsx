import { useRouter } from "next/navigation";

import FormPreviewButton from "./form-preview-button";
import PublishButton from "./publish-button";
import { SaveButton } from "./save-button";
import { TestButton } from "./test-button";

const Topbar = ({ title, workflowId }: { title: string; workflowId: string }) => {
  const router = useRouter();
  return (
    <header className="bg-background/50 absolute top-0 z-50 flex h-[60px] w-full border-separate items-center justify-between border-b-2 p-2 backdrop-blur-sm">
      <div className="flex h-full flex-1 items-center gap-1">
        <p className="truncate text-sm font-medium tracking-wide text-ellipsis normal-case">{title}</p>
      </div>
      <div className="flex flex-1 items-center justify-end gap-2">
        <FormPreviewButton workflowId={workflowId} />
        <TestButton workflowId={workflowId} />
        <SaveButton workflowId={workflowId} />
        <PublishButton />
      </div>
    </header>
  );
};

export default Topbar;
