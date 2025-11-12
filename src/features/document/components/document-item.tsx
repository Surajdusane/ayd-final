import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { RouterOutputs } from "@/trpc/routers/_app";
import { DocumentItemActions } from "./document-item-action";

type DocumentOutput = RouterOutputs["documents"]["getById"];

const DocumentItem = ({ document }: { document: DocumentOutput }) => {
  // If metadata might still come as a string, you can guard against that:
  const metadata = typeof document.metadata === "string" ? JSON.parse(document.metadata) : document.metadata;

  const variables = metadata?.variables ?? [];

  return (
    <Card className="hover:bg-muted/10 group relative max-w-sm transition-all duration-300">
      <div className="absolute top-4 right-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <DocumentItemActions document={document} />
      </div>
      <CardHeader>
        <Icons.Description className="text-muted-foreground/40 mb-4" size={56} />
        <CardTitle className="font-medium">{document.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="scrollbar-hide mt-auto flex gap-2 overflow-x-auto pb-2">
          {variables.map((v: string, index: number) => (
            <Badge
              className="text-muted-foreground rounded-full font-sans text-xs tracking-wider"
              variant={"secondary"}
              key={index}
            >{`{${v}}`}</Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentItem;

