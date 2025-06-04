import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Resource } from "@/types";
import { FileText } from "lucide-react";

type RichTextDetailsDialogProps = {
  resource: Resource;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function RichTextDetailsDialog({
  resource,
  open,
  onOpenChange,
}: RichTextDetailsDialogProps) {
  if (resource.resource_type !== "rich_text" || !resource.metadata?.content) {
    return null;
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <FileText className="mr-1 h-3.5 w-3.5" />
          View
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{resource.title}</DialogTitle>
        </DialogHeader>
        <div
          className="prose prose-sm dark:prose-invert max-w-none pb-4 prose-p:my-2!"
          dangerouslySetInnerHTML={{
            __html: resource.metadata.content,
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
