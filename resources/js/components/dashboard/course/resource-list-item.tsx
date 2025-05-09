import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Resource } from "@/types";
import { confirmSafe } from "@/utils/confirm";
import { ResourceIcon } from "@/utils/course-utils";
import { router } from "@inertiajs/react";
import { Edit, FileText, Trash2 } from "lucide-react";
import { toast } from "sonner";

export function ResourceListItem({ resource }: { resource: Resource }) {
  // Determine the resource type display name
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

  // Get metadata info display for the resource
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

  // Get the appropriate action button based on resource type
  const getActionButton = () => {
    switch (resource.resource_type) {
      case "attachment":
        return (
          <Button variant="outline" size="sm">
            View
          </Button>
        );
      case "rich_text":
        return (
          <Button variant="outline" size="sm">
            <FileText className="mr-1 h-3.5 w-3.5" />
            Read
          </Button>
        );
      case "quiz":
        return (
          <Button variant="outline" size="sm">
            Take Quiz
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
              Visit Link
            </a>
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-card hover:bg-accent/5 overflow-hidden rounded-lg border transition-colors">
      <div className="flex items-center gap-3 p-3">
        <div className="bg-primary/10 text-primary rounded-md p-2">
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

        <div className="flex flex-shrink-0 items-center gap-2">
          {getActionButton()}

          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive h-8 w-8"
            onClick={async () => {
              const confirmed = await confirmSafe({
                title: "Delete Resource",
                message: "Are you sure you want to delete this resource?",
                confirmText: "Delete",
                cancelText: "Cancel",
                variant: "destructive",
              });

              if (confirmed) {
                // Create a promise to handle the delete operation
                const deletePromise = new Promise<void>((resolve, reject) => {
                  router.delete(
                    route("resources.destroy", { resource: resource.id }),
                    {
                      onSuccess: () => resolve(),
                      onError: (errors) =>
                        reject(
                          new Error(errors[0] || "Failed to delete resource"),
                        ),
                      async: true,
                    },
                  );
                });

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
        </div>
      </div>
    </div>
  );
}
