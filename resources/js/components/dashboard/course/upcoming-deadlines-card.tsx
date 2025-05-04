import { Assignment } from "@/types";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, getAssignmentStatus } from "@/utils/course-utils";
import { Calendar } from "lucide-react";
import { FileText } from "lucide-react";

export function UpcomingDeadlinesCard({ assignments }: { assignments: Assignment[] }) {
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
                  className={`flex items-start gap-3  border border-neutral-200 p-4 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900/50 ${bgColor}`}
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
                      <Calendar className="text-muted-foreground h-3.5 w-3.5" />
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
  