import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Resource } from "@/types";
import { ResourceIcon } from "@/utils/course-utils";
import { Edit } from "lucide-react";


export function ResourceListItem({ resource }: { resource: Resource }) {
    return (
      <div className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50">
        <ResourceIcon type={resource.resource_type} />
        <span className="flex-1">{resource.title}</span>
        <div className="flex items-center gap-2">
          {resource.description && (
            <span className="text-muted-foreground text-xs mr-2">
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