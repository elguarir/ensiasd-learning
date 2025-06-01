import { AssignmentCard } from "@/components/dashboard/assignments/assignment-card";
import { CreateAssignmentDialog } from "@/components/dashboard/assignments/create-assignment-dialog";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useIsInstructor } from "@/hooks/use-user";
import { Assignment, Course } from "@/types";
import { Link } from "@inertiajs/react";
import {
  Award,
  CalendarClock,
  CheckCircle2,
  FileText,
  Folder,
  Users,
} from "lucide-react";

interface AssignmentsTabProps {
  assignments: Assignment[];
  course: Course;
}

export default function AssignmentsTab({
  assignments,
  course,
}: AssignmentsTabProps) {
  const isInstructor = useIsInstructor(course);
  console.log(assignments);

  // Calculate statistics for instructors
  const stats = isInstructor
    ? {
        totalAssignments: assignments.length,
        publishedAssignments: assignments.filter((a) => a.published).length,
        totalSubmissions: assignments.reduce(
          (sum, a) => sum + (a.submissions?.length || 0),
          0,
        ),
        gradedSubmissions: assignments.reduce(
          (sum, a) =>
            sum +
            (a.submissions?.filter((s) => s.status === "graded").length || 0),
          0,
        ),
      }
    : null;

  // Calculate student progress
  // This is only for students
  const studentProgress = !isInstructor
    ? {
        totalAssignments: assignments.filter((a) => a.published).length,
        completedAssignments: assignments.filter((a) =>
          a.submissions?.some(
            (s) => s.status === "submitted" || s.status === "graded",
          ),
        ).length,
        gradedAssignments: assignments.filter((a) =>
          a.submissions?.some((s) => s.status === "graded"),
        ).length,
      }
    : null;

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Assignments</h2>
        {isInstructor && <CreateAssignmentDialog course={course} />}
      </div>

      {/* Statistics Cards */}
      {isInstructor && stats && assignments.length > 0 && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground text-sm font-medium">
                  Total Assignments
                </p>
                <FileText className="text-muted-foreground h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAssignments}</div>
              <p className="text-muted-foreground text-xs">
                {stats.publishedAssignments} published
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground text-sm font-medium">
                  Total Submissions
                </p>
                <Users className="text-muted-foreground h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSubmissions}</div>
              <p className="text-muted-foreground text-xs">
                From all assignments
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground text-sm font-medium">
                  Graded
                </p>
                <CheckCircle2 className="text-muted-foreground h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.gradedSubmissions}
              </div>
              <Progress
                value={
                  stats.totalSubmissions > 0
                    ? (stats.gradedSubmissions / stats.totalSubmissions) * 100
                    : 0
                }
                className="mt-2 h-2"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground text-sm font-medium">
                  Quick Actions
                </p>
                <Award className="text-muted-foreground h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              {/* <Button size="sm" className="w-full" asChild>
                <Link
                 href="#"
                >
                  View All Submissions
                </Link>
              </Button> */}
              {/* We will add more actions here */}
              <p className="text-muted-foreground text-sm text-center">
                No actions available right now
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Student Progress Card */}
      {!isInstructor && studentProgress && assignments.length > 0 && (
        <Card>
          <CardHeader variant="highlighted">
            <h3 className="font-semibold">Your Progress</h3>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {studentProgress.totalAssignments}
                </div>
                <p className="text-muted-foreground text-sm">
                  Total Assignments
                </p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {studentProgress.completedAssignments}
                </div>
                <p className="text-muted-foreground text-sm">Submitted</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {studentProgress.gradedAssignments}
                </div>
                <p className="text-muted-foreground text-sm">Graded</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span>Completion Progress</span>
                <span>
                  {studentProgress.totalAssignments > 0
                    ? Math.round(
                        (studentProgress.completedAssignments /
                          studentProgress.totalAssignments) *
                          100,
                      )
                    : 0}
                  %
                </span>
              </div>
              <Progress
                value={
                  studentProgress.totalAssignments > 0
                    ? (studentProgress.completedAssignments /
                        studentProgress.totalAssignments) *
                      100
                    : 0
                }
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>
      )}

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
