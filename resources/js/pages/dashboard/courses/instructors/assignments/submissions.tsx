import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AppLayout from "@/layouts/app-layout";
import { cn } from "@/lib/utils";
import { Assignment, BreadcrumbItem, Course, Submission } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { format, formatDistanceToNow, isPast } from "date-fns";
import {
  AlertCircle,
  Award,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  FileIcon,
  FileText,
  Search,
  Users,
} from "lucide-react";
import { useState } from "react";

interface SubmissionsPageProps {
  course: Course;
  assignment: Assignment & { submissions: Submission[] };
  stats: {
    total_students: number;
    submitted_count: number;
    graded_count: number;
    average_grade: number | null;
    submission_rate: number;
  };
}

export default function SubmissionsPage({
  course,
  assignment,
  stats,
}: SubmissionsPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("submitted_at");

  const breadcrumbs: BreadcrumbItem[] = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "My Courses", href: "/dashboard/courses" },
    { title: course.title, href: route("dashboard.courses.show", course.id) },
    { title: "Assignments", href: route("dashboard.courses.assignments", course.id) },
    { title: assignment.title, href: route("courses.assignments.show", [course.id, assignment.id]) },
    { title: "Submissions", href: "#" },
  ];

  // Filter and sort submissions
  const filteredSubmissions = assignment.submissions?.filter((submission) => {
    const matchesSearch = submission.user?.name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || submission.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedSubmissions = [...(filteredSubmissions || [])].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.user?.name?.localeCompare(b.user?.name || "") || 0;
      case "submitted_at":
        return new Date(b.submitted_at || 0).getTime() - new Date(a.submitted_at || 0).getTime();
      case "grade":
        return (b.grade || 0) - (a.grade || 0);
      default:
        return 0;
    }
  });

  const getStatusBadge = (submission: Submission) => {
    switch (submission.status) {
      case "submitted":
        return (
          <Badge className="bg-green-600 hover:bg-green-700">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Submitted
          </Badge>
        );
      case "graded":
        return (
          <Badge className="bg-blue-600 hover:bg-blue-700">
            <Award className="mr-1 h-3 w-3" />
            Graded
          </Badge>
        );
      case "draft":
        return <Badge variant="secondary">Draft</Badge>;
      default:
        return <Badge variant="secondary">Not Started</Badge>;
    }
  };

  const getGradeDisplay = (submission: Submission) => {
    if (submission.status !== "graded" || !submission.grade) {
      return <span className="text-muted-foreground">—</span>;
    }

    const percentage = (submission.grade / assignment.points_possible) * 100;
    const gradeColor = cn({
      "text-green-600": percentage >= 90,
      "text-blue-600": percentage >= 80 && percentage < 90,
      "text-yellow-600": percentage >= 70 && percentage < 80,
      "text-orange-600": percentage >= 60 && percentage < 70,
      "text-red-600": percentage < 60,
    });

    return (
      <span className={cn("font-semibold", gradeColor)}>
        {submission.grade}/{assignment.points_possible} ({percentage.toFixed(1)}%)
      </span>
    );
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Submissions: ${assignment.title}`} />

      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">
              Assignment Submissions
            </h1>
            <Button variant="outline" asChild>
              <Link href={route("courses.assignments.show", [course.id, assignment.id])}>
                Back to Assignment
              </Link>
            </Button>
          </div>
          <div className="text-muted-foreground">
            <h2 className="text-lg font-medium text-foreground">
              {assignment.title}
            </h2>
            <p>Course: {course.title}</p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Students
                </p>
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_students}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  Submissions
                </p>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.submitted_count}</div>
              <p className="text-xs text-muted-foreground">
                {stats.submission_rate}% submission rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  Graded
                </p>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.graded_count}</div>
              <Progress
                value={(stats.graded_count / stats.submitted_count) * 100 || 0}
                className="mt-2 h-2"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  Average Grade
                </p>
                <Award className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.average_grade !== null
                  ? `${stats.average_grade}%`
                  : "—"}
              </div>
              {stats.average_grade !== null && (
                <p className="text-xs text-muted-foreground">
                  Out of {assignment.points_possible} points
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader variant="highlighted">
            <h3 className="text-lg font-semibold">Submissions</h3>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by student name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Submissions</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="graded">Graded</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="submitted_at">Submission Date</SelectItem>
                  <SelectItem value="name">Student Name</SelectItem>
                  <SelectItem value="grade">Grade</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {sortedSubmissions.length === 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No submissions found matching your criteria.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedSubmissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img
                              src={submission.user?.avatar}
                              alt={submission.user?.name}
                              className="h-8 w-8 rounded-full"
                            />
                            <div>
                              <p className="font-medium">
                                {submission.user?.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {submission.user?.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(submission)}
                            {submission.is_late && (
                              <Badge variant="destructive" className="gap-1">
                                <Clock className="h-3 w-3" />
                                Late
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {submission.submitted_at ? (
                            <div>
                              <p className="text-sm">
                                {format(
                                  new Date(submission.submitted_at),
                                  "MMM d, yyyy"
                                )}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {format(
                                  new Date(submission.submitted_at),
                                  "h:mm a"
                                )}
                              </p>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>{getGradeDisplay(submission)}</TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="ghost" asChild>
                            <Link
                              href={route("courses.assignments.submissions.show", [
                                course.id,
                                assignment.id,
                                submission.id,
                              ])}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
} 