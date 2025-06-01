import { AssignmentCard } from "@/components/dashboard/assignments/assignment-card";
import { CreateAssignmentDialog } from "@/components/dashboard/assignments/create-assignment-dialog";
import { EmptyState } from "@/components/empty-state";
import { useIsInstructor } from "@/hooks/use-user";
import { Assignment, Course } from "@/types";
import { CalendarClock, FileText, Folder } from "lucide-react";

interface AssignmentsTabProps {
  assignments: Assignment[];
  course: Course;
}

export default function AssignmentsTab({
  assignments,
  course,
}: AssignmentsTabProps) {
  const isInstructor = useIsInstructor(course);

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Assignments</h2>
        {isInstructor && <CreateAssignmentDialog course={course} />}
      </div>

      {assignments.length > 0 ? (
        <div className="space-y-4">
          {assignments.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              course={course}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No assignments yet"
          description={
            isInstructor
              ? "Create your first assignment to get started."
              : "There are no assignments for this course yet. Check back later for updates."
          }
          icons={[FileText, Folder, CalendarClock]}
        />
      )}
    </div>
  );
}