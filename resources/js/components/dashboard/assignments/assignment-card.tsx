import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useUser, useIsInstructor } from "@/hooks/use-user";
import { Assignment, Course } from "@/types";
import { formatDate, getAssignmentStatus } from "@/utils/course-utils";
import { Link } from "@inertiajs/react";
import {
  CalendarClock,
  CheckCircle,
  CircleDashed,
  FileText,
} from "lucide-react";

interface AssignmentCardProps {
  assignment: Assignment;
  course: Course;
}

export function AssignmentCard({ assignment, course }: AssignmentCardProps) {
  const { status, type } = getAssignmentStatus(assignment);
  const user = useUser();
  const isInstructor = useIsInstructor(course);
  
  // Find the current user's submission (only for students)
  const userSubmission = !isInstructor
    ? assignment.submissions?.find((s) => s.user_id === user?.id) || null
    : null;
  
  const isSubmitted = userSubmission?.status === "submitted";
  const isGraded = userSubmission?.status === "graded";

  // Calculate instructor statistics
  const instructorStats = isInstructor ? {
    totalSubmissions: assignment.submissions?.length || 0,
    gradedSubmissions: assignment.submissions?.filter(s => s.status === 'graded').length || 0,
    submittedSubmissions: assignment.submissions?.filter(s => s.status === 'submitted' || s.status === 'graded').length || 0,
  } : null;

  const statusStyles = {
    overdue: {
      badge: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200",
      card: "border-red-300 dark:border-red-800",
    },
    "due-today": {
      badge:
        "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200",
      card: "border-amber-300 dark:border-amber-800",
    },
    "due-soon": {
      badge:
        "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200",
      card: "border-orange-300 dark:border-orange-800",
    },
    normal: {
      badge:
        "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200",
      card: "border-green-300 dark:border-green-800",
    },
    "no-deadline": {
      badge: "bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-300",
      card: "border-gray-300 dark:border-gray-800",
    },
  }[type];

  return (
    <Card className="group overflow-hidden py-0 transition-all duration-200 hover:shadow-md dark:hover:shadow-gray-900/50">
      <div
        className={`border-l-4 py-4 ${
          assignment.type === "quiz" ? "border-blue-500" : "border-green-500"
        }`}
      >
        <CardHeader className="flex flex-row items-start justify-between pb-3">
          <div className="flex items-center gap-3">
            <div
              className={`flex items-center justify-center rounded-lg p-2 ${
                assignment.type === "quiz"
                  ? "bg-blue-100 dark:bg-blue-900"
                  : "bg-green-100 dark:bg-green-900"
              }`}
            >
              <FileText
                className={`h-5 w-5 ${
                  assignment.type === "quiz"
                    ? "text-blue-500 dark:text-blue-300"
                    : "text-green-500 dark:text-green-300"
                }`}
              />
            </div>
            <div>
              <h3 className="font-semibold">{assignment.title}</h3>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {assignment.type === "quiz" ? "Quiz" : "File Submission"}
                </Badge>
                {!isInstructor && (
                  <Badge
                    className={`${statusStyles.badge} font-semibold`}
                    variant="secondary"
                  >
                    {status}
                  </Badge>
                )}
                {isInstructor && (
                  <Badge 
                    variant={assignment.published ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {assignment.published ? "Published" : "Draft"}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="text-right">
            <p className="text-sm font-medium">
              {assignment.points_possible} pts
            </p>
            {!isInstructor && userSubmission?.grade !== null &&
              userSubmission?.grade !== undefined && (
                <p className="text-muted-foreground text-sm">
                  Score: {userSubmission.grade}%
                </p>
              )}
            {isInstructor && instructorStats && (
              <p className="text-muted-foreground text-sm">
                {instructorStats.submittedSubmissions} submissions
              </p>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {assignment.description && (
            <p className="text-muted-foreground mb-3 text-sm">
              {assignment.description}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="text-muted-foreground flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <CalendarClock className="h-4 w-4" />
                <span>
                  {assignment.due_date
                    ? `Due ${formatDate(assignment.due_date)}`
                    : "No due date"}
                </span>
              </div>

              {!isInstructor && userSubmission && (
                <div className="flex items-center gap-1">
                  {isGraded ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-green-600 dark:text-green-400">
                        Graded
                      </span>
                    </>
                  ) : isSubmitted ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                      <span className="text-blue-600 dark:text-blue-400">
                        Submitted
                      </span>
                    </>
                  ) : (
                    <>
                      <CircleDashed className="h-4 w-4" />
                      <span>Not submitted</span>
                    </>
                  )}
                </div>
              )}

              {isInstructor && instructorStats && (
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-green-600 dark:text-green-400">
                    {instructorStats.gradedSubmissions} graded
                  </span>
                </div>
              )}
            </div>

            <Button asChild size="sm">
              <Link
                href={route("courses.assignments.show", [
                  course.id,
                  assignment.id,
                ])}
              >
                {isInstructor 
                  ? "Manage Assignment"
                  : userSubmission?.status === "submitted"
                  ? "View Submission"
                  : "Start Assignment"
                }
              </Link>
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
