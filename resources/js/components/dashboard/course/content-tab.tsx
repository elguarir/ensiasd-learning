import { EmptyState } from "@/components/empty-state";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useIsInstructor } from "@/hooks/use-user";
import { Assignment, Chapter, Course, Resource } from "@/types";
import {
  formatDate,
  getAssignmentStatus,
  ResourceIcon,
} from "@/utils/course-utils";
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
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { router } from "@inertiajs/react";
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  GripVertical,
  Trash2,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AddChapterModal } from "./add-chapter-modal";

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

    // If not dropped over anything or dropped over itself, do nothing
    if (!over || active.id === over.id) return;

    // Handle reordering
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

    // Optimistic UI update
    setItems(items.filter((item) => item.id !== chapterId));

    try { 
      // Send delete request
      await router.delete(route("chapters.destroy", chapterId), {
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

  // Update the items state when the chapters prop changes
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

        {items.length > 0 ? (
          <>
            {isInstructor && isDragging && (
              <div className="mb-4 rounded-md bg-blue-50 p-2 text-center text-sm text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                Drag to reorder chapters
              </div>
            )}
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <div className="flex flex-col gap-4">
                <SortableContext
                  items={items.map((chapter) => chapter.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <Accordion type="multiple" className="w-full border">
                    {items.map((chapter) => (
                      <SortableChapterItem
                        key={chapter.id}
                        chapter={chapter}
                        isInstructor={isInstructor}
                        onDelete={() => deleteChapter(chapter.id)}
                      />
                    ))}
                  </Accordion>
                </SortableContext>
              </div>
            </DndContext>
          </>
        ) : (
          <EmptyState
            title="No chapters yet"
            description="There are no chapters in this course yet. Check back later for content updates."
            icons={[BookOpen]}
          />
        )}
      </div>

      <div className="space-y-8 lg:col-span-1">
        <UpcomingDeadlinesCard assignments={assignments} />
        <CourseInfoCard course={course} />
      </div>
    </div>
  );
}

function SortableChapterItem({
  chapter,
  isInstructor,
  onDelete,
}: {
  chapter: Chapter;
  isInstructor: boolean;
  onDelete: () => void;
}) {
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

  return (
    <div ref={setNodeRef} style={style} className="relative">
      {isInstructor && (
        <>
          <div
            className="hidden md:block absolute top-1/2 left-2 -translate-y-1/2 cursor-grab opacity-40 hover:opacity-100 active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4" />
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full p-1.5 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30"
            title="Delete chapter"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </>
      )}
      <ChapterItem chapter={chapter} isInstructor={isInstructor} />
    </div>
  );
}

function ChapterItem({
  chapter,
  isInstructor,
}: {
  chapter: Chapter;
  isInstructor: boolean;
}) {
  return (
    <AccordionItem
      key={chapter.id}
      value={`chapter-${chapter.id}`}
      className="group rounded-lg"
    >
      <AccordionTrigger
        className={`rounded-t-lg py-3 hover:bg-neutral-50 hover:no-underline dark:hover:bg-neutral-900/50 ${isInstructor ? "pr-10 pl-8" : ""}`}
      >
        <div className="flex flex-col items-start text-left">
          <span className="text-lg font-medium">{chapter.title}</span>
          <span className="text-muted-foreground text-sm">
            {chapter.resources?.length || 0} resources
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pr-4 pb-6 pl-8">
        {chapter.description && (
          <p className="text-muted-foreground mb-6">{chapter.description}</p>
        )}

        {chapter.resources && chapter.resources.length > 0 ? (
          <div className="space-y-4">
            {chapter.resources?.map((resource) => (
              <ResourceItem key={resource.id} resource={resource} />
            ))}
          </div>
        ) : (
          <div className="py-2">
            <p className="text-muted-foreground text-sm">
              No resources available for this chapter yet.
            </p>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}

function ResourceItem({ resource }: { resource: Resource }) {
  return (
    <div
      key={resource.id}
      className="flex items-center gap-4 rounded-lg border border-neutral-200 p-4 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900/50"
    >
      <ResourceIcon type={resource.resource_type} />
      <div className="flex-1">
        <p className="font-medium">{resource.title}</p>
        {resource.description && (
          <p className="text-muted-foreground text-sm">
            {resource.description}
          </p>
        )}
      </div>
      <Button variant="outline" size="sm">
        View
      </Button>
    </div>
  );
}

function UpcomingDeadlinesCard({ assignments }: { assignments: Assignment[] }) {
  const upcomingAssignments = assignments
    .filter(
      (assignment) =>
        assignment.due_date && new Date(assignment.due_date) > new Date(),
    )
    .slice(0, 3);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Deadlines</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {upcomingAssignments.length > 0 ? (
          upcomingAssignments.map((assignment) => {
            const { status, color, bgColor } = getAssignmentStatus(assignment);
            return (
              <div
                key={assignment.id}
                className={`flex items-start gap-3 rounded-lg border border-neutral-200 p-4 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900/50 ${bgColor}`}
              >
                {assignment.type === "quiz" ? (
                  <div className="rounded-md bg-blue-100 p-2.5 dark:bg-blue-900">
                    <FileText className="h-4 w-4 text-blue-500 dark:text-blue-300" />
                  </div>
                ) : (
                  <div className="rounded-md bg-green-100 p-2.5 dark:bg-green-900">
                    <FileText className="h-4 w-4 text-green-500 dark:text-green-300" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{assignment.title}</p>
                  <div className="mt-1.5 flex items-center gap-1">
                    <Clock className="text-muted-foreground h-3.5 w-3.5" />
                    <span className="text-muted-foreground text-xs">
                      {assignment.due_date
                        ? formatDate(assignment.due_date)
                        : "No deadline"}
                    </span>
                  </div>
                </div>
                <div
                  className={`rounded-full px-2 py-1 text-xs font-medium text-white ${color}`}
                >
                  {status}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-muted-foreground py-2 text-sm">
            No upcoming deadlines.
          </p>
        )}
      </CardContent>
      {upcomingAssignments.length > 0 && (
        <CardFooter>
          <Button variant="outline" className="w-full">
            View All Assignments
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

function CourseInfoCard({ course }: { course: Course }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex items-center gap-4">
          <div className="rounded-md bg-blue-100 p-2.5 dark:bg-blue-900">
            <Calendar className="h-4 w-4 text-blue-500 dark:text-blue-300" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Enrolled at</p>
            <p className="font-medium">
              {formatDate(course.published_at || course.created_at)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="rounded-md bg-purple-100 p-2.5 dark:bg-purple-900">
            <User className="h-4 w-4 text-purple-500 dark:text-purple-300" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Instructor</p>
            <p className="font-medium">{course.instructor?.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="rounded-md bg-green-100 p-2.5 dark:bg-green-900">
            <CheckCircle2 className="h-4 w-4 text-green-500 dark:text-green-300" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Course Status</p>
            <p className="font-medium capitalize">{course.status}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
