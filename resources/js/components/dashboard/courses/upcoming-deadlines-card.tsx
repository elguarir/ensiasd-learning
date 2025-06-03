import { Assignment, Course } from "@/types";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatDate, getAssignmentStatus } from "@/utils/course-utils";
import { Link } from "@inertiajs/react";
import { Calendar, FileText } from "lucide-react";

export function UpcomingDeadlinesCard({
  assignments,
  course,
}: {
  assignments: Assignment[];
  course: Course;
}) {
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
            const { status, type } = getAssignmentStatus(assignment);

            const statusStyles = {
              overdue: {
                text: "text-red-700 dark:text-red-400",
                bg: "bg-red-50 dark:bg-red-950/30",
                border: "border-red-300 dark:border-red-900",
                hover:
                  "hover:bg-red-100 hover:border-red-400 dark:hover:bg-red-950/50 dark:hover:border-red-800",
                badgeBg: "bg-red-100 dark:bg-red-900/50",
                badgeText: "text-red-800 dark:text-red-200",
                badgeHover:
                  "group-hover:bg-red-200 dark:group-hover:bg-red-900/70",
              },
              "due-today": {
                text: "text-amber-700 dark:text-amber-400",
                bg: "bg-amber-50 dark:bg-amber-950/30",
                border: "border-amber-300 dark:border-amber-900",
                hover:
                  "hover:bg-amber-100 hover:border-amber-400 dark:hover:bg-amber-950/50 dark:hover:border-amber-800",
                badgeBg: "bg-amber-100 dark:bg-amber-900/50",
                badgeText: "text-amber-800 dark:text-amber-200",
                badgeHover:
                  "group-hover:bg-amber-200 dark:group-hover:bg-amber-900/70",
              },
              "due-soon": {
                text: "text-orange-700 dark:text-orange-400",
                bg: "bg-orange-50 dark:bg-orange-950/30",
                border: "border-orange-300 dark:border-orange-900",
                hover:
                  "hover:bg-orange-100 hover:border-orange-400 dark:hover:bg-orange-950/50 dark:hover:border-orange-800",
                badgeBg: "bg-orange-100 dark:bg-orange-900/50",
                badgeText: "text-orange-800 dark:text-orange-200",
                badgeHover:
                  "group-hover:bg-orange-200 dark:group-hover:bg-orange-900/70",
              },
              normal: {
                text: "text-green-700 dark:text-green-400",
                bg: "bg-green-50 dark:bg-green-950/30",
                border: "border-green-300 dark:border-green-900",
                hover:
                  "hover:bg-green-100 hover:border-green-400 dark:hover:bg-green-950/50 dark:hover:border-green-800",
                badgeBg: "bg-green-100 dark:bg-green-900/50",
                badgeText: "text-green-800 dark:text-green-200",
                badgeHover:
                  "group-hover:bg-green-200 dark:group-hover:bg-green-900/70",
              },
              "no-deadline": {
                text: "text-gray-600 dark:text-gray-400",
                bg: "bg-gray-50 dark:bg-gray-900/30",
                border: "border-gray-300 dark:border-gray-800",
                hover:
                  "hover:bg-gray-100 hover:border-gray-400 dark:hover:bg-gray-900/50 dark:hover:border-gray-700",
                badgeBg: "bg-gray-100 dark:bg-gray-800/50",
                badgeText: "text-gray-700 dark:text-gray-300",
                badgeHover:
                  "group-hover:bg-gray-200 dark:group-hover:bg-gray-800/70",
              },
            }[type];

            return (
              <Link
                key={assignment.id}
                href={route("courses.assignments.show", [
                  assignment.course_id,
                  assignment.id,
                ])}
                className={cn(
                  `group flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-all duration-200 hover:translate-y-[-1.5px] hover:shadow-sm`,
                  statusStyles.bg,
                  statusStyles.border,
                  statusStyles.hover,
                )}
              >
                {assignment.type === "quiz" ? (
                  <div className="flex-shrink-0 rounded-lg bg-blue-500/20 p-2.5 dark:bg-blue-900">
                    <FileText className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                  </div>
                ) : (
                  <div className="flex-shrink-0 rounded-lg bg-green-500/20 p-2.5 dark:bg-green-900">
                    <FileText className="h-4 w-4 text-green-600 dark:text-green-300" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <p className="line-clamp-1 flex-1 truncate leading-tight font-medium">
                      {assignment.title}
                    </p>
                    <div
                      className={`flex-shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition-colors duration-200 ${statusStyles.badgeBg} ${statusStyles.badgeText} ${statusStyles.badgeHover}`}
                    >
                      {status}
                    </div>
                  </div>
                  <div className="mt-px flex items-center gap-1">
                    <Calendar className="text-muted-foreground h-3.5 w-3.5 flex-shrink-0" />
                    <span className="text-muted-foreground text-xs">
                      {assignment.due_date
                        ? formatDate(assignment.due_date)
                        : "No deadline"}
                    </span>
                  </div>
                </div>
              </Link>
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
          <Button asChild variant="outline" className="w-full">
            <Link
              href={route("dashboard.courses.assignments", {
                course: course.id,
              })}
            >
              View All Assignments
            </Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
