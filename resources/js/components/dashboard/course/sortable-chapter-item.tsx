import { AddResourceSheet } from "@/components/dashboard/add-resource-sheet";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Chapter } from "@/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { router } from "@inertiajs/react";
import { Edit, GripVertical, MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";
import { EditChapterModal } from "./edit-chapter-modal";
import { ResourceListItem } from "./resource-list-item";

export function SortableChapterItem({
  chapter,
  isInstructor,
  onDelete,
  valueKey,
}: {
  chapter: Chapter;
  isInstructor: boolean;
  onDelete: () => void;
  valueKey: string;
}) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: chapter.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    opacity: isDragging ? 0.6 : 1,
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const refreshChapter = () => {
    router.reload({
      only: ["chapters"],
    });
  };

  return (
    <>
      <div ref={setNodeRef} style={style}>
        <AccordionItem
          value={valueKey}
          className="bg-card overflow-hidden transition-all duration-300"
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex w-full items-center gap-4">
              {isInstructor && (
                <div
                  className="cursor-grab opacity-60 hover:opacity-100 active:cursor-grabbing"
                  {...attributes}
                  {...listeners}
                  onClick={(e) => e.stopPropagation()}
                >
                  <GripVertical className="text-muted-foreground h-5 w-5" />
                </div>
              )}
              <div className="min-w-0 flex-1 text-left">
                <h3 className="truncate text-lg font-semibold">
                  {chapter.title}
                </h3>
                <Badge variant="outline" className="mt-1">
                  {chapter.resources?.length || 0}{" "}
                  {(chapter.resources?.length || 0) === 1
                    ? "resource"
                    : "resources"}
                </Badge>
              </div>

              {isInstructor && (
                <div onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={handleEdit}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Chapter
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={onDelete}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Chapter
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          </AccordionTrigger>

          <AccordionContent className="px-4 pt-0 pb-4">
            {chapter.description && (
              <div className="pb-2">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {chapter.description}
                </p>
              </div>
            )}

            {chapter.resources && chapter.resources.length > 0 ? (
              <div className="space-y-2 py-4">
                {chapter.resources.map((resource) => (
                  <ResourceListItem key={resource.id} resource={resource} />
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground py-4 text-center italic">
                No resources added yet
              </div>
            )}

            {isInstructor && (
              <div>
                <AddResourceSheet chapterId={chapter.id} />
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </div>

      {isInstructor && (
        <EditChapterModal
          chapter={chapter}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onChapterUpdated={refreshChapter}
        />
      )}
    </>
  );
}

export default SortableChapterItem;
