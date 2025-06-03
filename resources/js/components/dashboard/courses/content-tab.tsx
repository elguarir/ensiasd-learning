import { EmptyState } from "@/components/empty-state";
import { Accordion } from "@/components/ui/accordion";
import { useIsInstructor } from "@/hooks/use-user";
import { Assignment, Chapter, Course } from "@/types";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { router } from "@inertiajs/react";
import { BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AddChapterModal } from "./add-chapter-modal";
import { CourseInfoCard } from "./course-info-card";
import { SortableChapterItem } from "./sortable-chapter-item";
import { UpcomingDeadlinesCard } from "./upcoming-deadlines-card";

interface ContentTabProps {
  course: Course;
  chapters: Chapter[];
  assignments: Assignment[];
}

export default function ContentTab({
  course,
  chapters,
  assignments,
}: ContentTabProps) {
  const isInstructor = useIsInstructor(course);
  const [items, setItems] = useState(chapters);
  const [isDragging, setIsDragging] = useState(false);
  const [activeChapter, setActiveChapter] = useState<Chapter | null>(null);
  const [expandedChapters, setExpandedChapters] = useState<string[]>([]);

  const refreshPage = () => {
    router.reload({
      only: ["chapters"],
    });
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    setIsDragging(true);
    const { active } = event;
    const activeItem = items.find((item) => item.id === active.id);
    if (activeItem) {
      setActiveChapter(activeItem);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setIsDragging(false);
    setActiveChapter(null);

    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);

    const newItems = [...items];
    const [removed] = newItems.splice(oldIndex, 1);
    newItems.splice(newIndex, 0, removed);
    setItems(newItems);

    updateChapterPositions(newItems);
  };

  const deleteChapter = async (chapterId: number) => {
    const confirmed = confirm("Are you sure you want to delete this chapter?");

    if (!confirmed) return;

    setItems(items.filter((item) => item.id !== chapterId));

    try {
      router.delete(route("chapters.destroy", chapterId), {
        preserveScroll: true,
        onSuccess: () => {
          toast.success("Chapter deleted successfully");
        },
        onError: (errors) => {
          toast.error("Failed to delete chapter");
          setItems(chapters);
        },
      });
    } catch (error) {
      toast.error("Failed to delete chapter");
      setItems(chapters);
    }
  };

  const updateChapterPositions = async (sortedChapters: Chapter[]) => {
    try {
      const positions = sortedChapters.map((chapter, index) => ({
        id: chapter.id,
        position: index,
      }));

      router.post(
        route("courses.chapters.reorder", course.id),
        {
          positions,
        },
        {
          preserveScroll: true,
          onSuccess: () => {
            toast.success("Chapters reordered successfully");
          },
          onError: () => {
            toast.error("Failed to reorder chapters");
            setItems(chapters); // Revert to original order on error
          },
        },
      );
    } catch (error) {
      console.error("Error updating chapter positions:", error);
      toast.error("Failed to reorder chapters");
      setItems(chapters); // Revert to original order on error
    }
  };

  useEffect(() => {
    setItems(chapters);
  }, [chapters]);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="flex flex-col gap-6 lg:col-span-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Course Content</h2>
          {isInstructor && (
            <AddChapterModal
              courseId={course.id}
              onChapterAdded={refreshPage}
            />
          )}
        </div>

        {isInstructor && isDragging && (
          <div className="bg-primary/10 text-primary dark:bg-primary/20 mb-4 rounded-md p-2 text-center text-sm">
            Drag to reorder chapters
          </div>
        )}

        {items.length > 0 ? (
          <div className="space-y-6">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={items.map((chapter) => chapter.id)}
                strategy={verticalListSortingStrategy}
              >
                <Accordion
                  type="multiple"
                  value={expandedChapters}
                  onValueChange={setExpandedChapters}
                  className="w-full divide-y border"
                >
                  {items.map((chapter) => (
                    <SortableChapterItem
                      key={chapter.id}
                      chapter={chapter}
                      isInstructor={isInstructor}
                      onDelete={() => deleteChapter(chapter.id)}
                      valueKey={`chapter-${chapter.id}`}
                    />
                  ))}
                </Accordion>
              </SortableContext>
            </DndContext>
          </div>
        ) : (
          <EmptyState
            title="No chapters yet"
            description="There are no chapters in this course yet. Check back later for content updates."
            icons={[BookOpen]}
          />
        )}
      </div>

      <div className="space-y-8 lg:col-span-1">
        <UpcomingDeadlinesCard assignments={assignments} course={course} />
        <CourseInfoCard course={course} />
      </div>
    </div>
  );
}
