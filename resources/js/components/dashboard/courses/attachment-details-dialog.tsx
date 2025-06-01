import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Resource } from "@/types";
import { Download, Paperclip } from "lucide-react";

interface AttachmentDetailsDialogProps {
  resource: Resource;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AttachmentDetailsDialog({
  resource,
  open,
  onOpenChange,
}: AttachmentDetailsDialogProps) {
  
  
  if (resource.resource_type !== "attachment" || !resource.metadata?.files) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Paperclip className="mr-1 h-3.5 w-3.5" />
          View Attachments
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{resource.title}</DialogTitle>
          <DialogDescription>
            View and download the attachments for this resource.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {resource.metadata.files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between rounded-md border p-3"
            >
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-muted-foreground text-xs">
                  {Math.round(file.size / 1024)} KB
                </p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <a href={file.path} target="_blank" rel="noopener noreferrer">
                  <Download className="mr-1 h-3.5 w-3.5" />
                  Download
                </a>
              </Button>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
