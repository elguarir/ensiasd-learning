import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";
import { Assignment, Chapter, Course, Resource } from "@/types";
import { formatDate, getAssignmentStatus, ResourceIcon } from "@/utils/course-utils";
import { BookOpen, Calendar, CheckCircle2, Clock, FileText, User } from "lucide-react";

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
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="flex flex-col gap-6 lg:col-span-2">
        <h2 className="text-xl font-bold">Course Content</h2>
        
        {chapters.length > 0 ? (
          <Accordion type="multiple" className="w-full border">
            {chapters.map((chapter) => (
              <ChapterItem key={chapter.id} chapter={chapter} />
            ))}
          </Accordion>
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

function ChapterItem({ chapter }: { chapter: Chapter }) {
  return (
    <AccordionItem
      key={chapter.id}
      value={`chapter-${chapter.id}`}
      className="rounded-lg"
    >
      <AccordionTrigger className="rounded-t-lg px-6 py-3 hover:bg-neutral-50 hover:no-underline dark:hover:bg-neutral-900/50">
        <div className="flex flex-col items-start text-left">
          <span className="text-lg font-medium">{chapter.title}</span>
          <span className="text-muted-foreground text-sm">
            {chapter.resources?.length || 0} resources
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-6 pb-6">
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
            <p className="text-muted-foreground text-sm">No resources available for this chapter yet.</p>
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
  const upcomingAssignments = assignments.filter(
    (assignment) => assignment.due_date && new Date(assignment.due_date) > new Date()
  ).slice(0, 3);

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
          <p className="text-muted-foreground text-sm py-2">No upcoming deadlines.</p>
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