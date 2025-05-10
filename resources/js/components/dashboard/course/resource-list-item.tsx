import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Resource } from "@/types";
import { confirmSafe } from "@/utils/confirm";
import { ResourceIcon } from "@/utils/course-utils";
import { Link, router } from "@inertiajs/react";
import { Edit, ExternalLink, PenBox, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AttachmentDetailsDialog } from "./attachment-details-dialog";
import { RichTextDetailsDialog } from "./richtext-details-dialog";

export function ResourceListItem({
  resource,
  isInstructor,
}: {
  resource: Resource;
  isInstructor: boolean;
}) {
  const [rTextOpen, setRTextOpen] = useState(false);
  const [attachmentOpen, setAttachmentOpen] = useState(false);

  const getResourceTypeName = () => {
    switch (resource.resource_type) {
      case "attachment":
        return "File";
      case "rich_text":
        return "Text";
      case "quiz":
        return "Quiz";
      case "external":
        return "Link";
      default:
        return "Resource";
    }
  };

  const getMetadataInfo = () => {
    if (!resource.metadata) return null;

    switch (resource.resource_type) {
      case "attachment":
        return (
          <div className="text-muted-foreground flex items-center gap-2 text-xs">
            <span>{resource.metadata.file_count} file(s)</span>
            {resource.metadata.total_size && (
              <span>{Math.round(resource.metadata.total_size / 1024)} KB</span>
            )}
          </div>
        );

      case "rich_text":
        return (
          <div className="text-muted-foreground line-clamp-1 text-xs">
            {resource.metadata.excerpt}
          </div>
        );

      case "quiz":
        return (
          <div className="text-muted-foreground flex items-center gap-2 text-xs">
            <span>{resource.metadata.question_count} question(s)</span>
            {resource.metadata.total_points && (
              <span>{resource.metadata.total_points} points</span>
            )}
          </div>
        );

      case "external":
        return (
          <div className="text-muted-foreground line-clamp-1 text-xs">
            <span>{resource.metadata.external_url}</span>
          </div>
        );

      default:
        return null;
    }
  };

  const getActionButton = () => {
    switch (resource.resource_type) {
      case "attachment":
        return (
          <AttachmentDetailsDialog
            resource={resource}
            open={attachmentOpen}
            onOpenChange={setAttachmentOpen}
          />
        );
      case "rich_text":
        return (
          <RichTextDetailsDialog
            resource={resource}
            open={rTextOpen}
            onOpenChange={setRTextOpen}
          />
        );
      case "quiz":
        return (
          <Button variant="outline" size="sm" asChild>
            <Link
              // href={route("resources.quiz.take", { resource: resource.id })}
              href="#"
            >
              <PenBox className="mr-1 h-3.5 w-3.5" />
              Take Quiz
            </Link>
          </Button>
        );
      case "external":
        return (
          <Button variant="outline" size="sm" asChild>
            <a
              href={resource.metadata?.external_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="mr-1 h-3.5 w-3.5" />
              Visit Link
            </a>
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="bg-card hover:bg-accent/5 overflow-hidden rounded-lg border transition-colors">
        <div className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
          <div className="bg-primary/10 text-primary self-start rounded-md p-2 sm:self-center">
            <ResourceIcon type={resource.resource_type} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="font-medium">{resource.title}</h4>
              <Badge variant="secondary" className="font-normal">
                {getResourceTypeName()}
              </Badge>
            </div>

            <div className="mt-1">{getMetadataInfo()}</div>
          </div>

          <div className="flex flex-shrink-0 items-center gap-2 self-end max-sm:w-full max-sm:justify-between sm:self-center">
            {getActionButton()}
            <div className="flex flex-shrink-0 items-center gap-2">
              {isInstructor && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    asChild
                  >
                    <Link
                      // href={route("resources.edit", { resource: resource.id })}
                      href="#"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive h-8 w-8"
                    onClick={async () => {
                      const confirmed = await confirmSafe({
                        title: "Delete Resource",
                        message:
                          "Are you sure you want to delete this resource?",
                        confirmText: "Delete",
                        cancelText: "Cancel",
                        variant: "destructive",
                      });

                      if (confirmed) {
                        // Create a promise to handle the delete operation
                        const deletePromise = new Promise<void>(
                          (resolve, reject) => {
                            router.delete(
                              route("resources.destroy", {
                                resource: resource.id,
                              }),
                              {
                                onSuccess: () => resolve(),
                                onError: (errors) =>
                                  reject(
                                    new Error(
                                      errors[0] || "Failed to delete resource",
                                    ),
                                  ),
                                async: true,
                              },
                            );
                          },
                        );

                        // Show toast notifications for the operation
                        toast.promise(deletePromise, {
                          loading: "Deleting resource...",
                          success: "Resource deleted successfully",
                          error: "Failed to delete resource",
                        });
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
