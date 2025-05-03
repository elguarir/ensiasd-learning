import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { Assignment } from "@/types";
import { formatDate, getAssignmentStatus } from "@/utils/course-utils";
import { CalendarClock, FileText, Folder } from "lucide-react";

interface AssignmentsTabProps {
  assignments: Assignment[];
}

export default function AssignmentsTab({ assignments }: AssignmentsTabProps) {
  return (
    <div className="grid grid-cols-1 gap-6">
      <h2 className="text-xl font-bold">Assignments</h2>

      {assignments.length > 0 ? (
        <div className="space-y-6">
          {assignments.map((assignment) => (
            <AssignmentCard key={assignment.id} assignment={assignment} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No assignments yet"
          description="There are no assignments for this course yet. Check back later for updates."
          icons={[FileText, Folder, CalendarClock]}
        />
      )}
    </div>
  );
}

function AssignmentCard({ assignment }: { assignment: Assignment }) {
  const { status, color } = getAssignmentStatus(assignment);
  return (
    <div
      key={assignment.id}
      className="bg-card flex flex-col overflow-hidden rounded-2xl border border-neutral-200 p-0 shadow-sm transition hover:shadow-md dark:border-neutral-800"
    >
      {/* Header Row */}
      <div className="flex items-center gap-4 px-6 pt-6 pb-2">
        <div
          className={`flex items-center justify-center rounded-lg p-2.5 ${
            assignment.type === "quiz"
              ? "bg-blue-100 dark:bg-blue-900"
              : "bg-green-100 dark:bg-green-900"
          }`}
        >
          {assignment.type === "quiz" ? (
            <FileText className="h-6 w-6 text-blue-500 dark:text-blue-300" />
          ) : (
            <FileText className="h-6 w-6 text-green-500 dark:text-green-300" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-semibold">{assignment.title}</h3>
        </div>
        <Badge className={color}>{status}</Badge>
      </div>

      {/* Meta Row */}
      <div className="text-muted-foreground flex flex-wrap items-center gap-4 px-6 pt-2 pb-1 text-sm">
        <div className="flex items-center gap-1.5">
          <CalendarClock className="h-4 w-4" />
          <span>
            {assignment.due_date
              ? `Due ${formatDate(assignment.due_date)}`
              : "No deadline"}
          </span>
        </div>
        <span className="hidden sm:inline">•</span>
        <div className="flex items-center gap-1.5">
          <span>Points:</span>
          <span className="text-foreground font-medium">
            {assignment.points_possible}
          </span>
        </div>
        <span className="hidden sm:inline">•</span>
        <div className="flex items-center gap-1.5">
          <span>Type:</span>
          <span className="text-foreground font-medium capitalize">
            {assignment.type === "quiz" ? "Quiz" : "File Submission"}
          </span>
        </div>
      </div>

      {/* Description */}
      {assignment.description && (
        <div className="px-6 pt-2 pb-2">
          <p className="text-muted-foreground text-sm leading-relaxed">
            {assignment.description}
          </p>
        </div>
      )}

      {/* Action Button */}
      <div className="mt-auto flex px-6 pt-2 pb-6">
        <Button className="w-full sm:ml-auto sm:w-auto">
          Start Assignment
        </Button>
      </div>
    </div>
  );
} 