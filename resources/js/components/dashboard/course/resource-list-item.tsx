import { Button } from "@/components/ui/button";
import { Resource } from "@/types";
import { ResourceIcon } from "@/utils/course-utils";
import { Edit, Trash2 } from "lucide-react";

export function ResourceListItem({ resource }: { resource: Resource }) {
  return (
    <div className="hover:bg-muted/50 flex items-center gap-3 rounded-md p-2">
      <ResourceIcon type={resource.resource_type} />
      <span className="flex-1">{resource.title}</span>
      <div className="flex items-center gap-2">
        {resource.description && (
          <span className="text-muted-foreground mr-2 text-xs">
            {resource.description}
          </span>
        )}
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
