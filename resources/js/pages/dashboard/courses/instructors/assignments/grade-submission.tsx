import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import AppLayout from "@/layouts/app-layout";
import { cn } from "@/lib/utils";
import { Assignment, BreadcrumbItem, Course, Submission } from "@/types";
import { Head, Link, useForm } from "@inertiajs/react";
import { format } from "date-fns";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  User,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

interface GradeSubmissionProps {
  course: Course;
  assignment: Assignment;
  submission: Submission;
}

export default function GradeSubmission({
  course,
  assignment,
  submission,
}: GradeSubmissionProps) {
  const form = useForm({
    grade: submission.grade || "",
    feedback: submission.feedback || "",
  });

  const breadcrumbs: BreadcrumbItem[] = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "My Courses", href: "/dashboard/courses" },
    { title: course.title, href: route("dashboard.courses.show", course.id) },
    { title: "Assignments", href: route("dashboard.courses.assignments", course.id) },
    { title: assignment.title, href: route("courses.assignments.show", [course.id, assignment.id]) },
    { 
      title: "Submissions", 
      href: route("courses.assignments.submissions", [course.id, assignment.id]) 
    },
    { title: submission.user?.name || "Submission", href: "#" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    form.put(
      route("courses.assignments.submissions.grade", [
        course.id,
        assignment.id,
        submission.id,
      ]),
      {
        onSuccess: () => {
          toast.success("Grade saved successfully");
        },
        onError: () => {
          toast.error("Failed to save grade");
        },
      }
    );
  };

  const calculateFinalGrade = () => {
    const baseGrade = parseFloat(form.data.grade as string) || 0;
    if (submission.is_late && assignment.allow_late_submissions && assignment.late_penalty_percentage > 0) {
      const penalty = (baseGrade * assignment.late_penalty_percentage) / 100;
      return Math.max(0, baseGrade - penalty);
    }
    return baseGrade;
  };

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 80) return "text-blue-600";
    if (percentage >= 70) return "text-yellow-600";
    if (percentage >= 60) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Grade Submission: ${submission.user?.name}`} />

      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">
              Grade Submission
            </h1>
            <Button variant="outline" asChild>
              <Link
                href={route("courses.assignments.submissions", [
                  course.id,
                  assignment.id,
                ])}
              >
                Back to Submissions
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Submission Details */}
          <div className="space-y-6 lg:col-span-2">
            {/* Student Info Card */}
            <Card>
              <CardHeader variant="highlighted">
                <h2 className="font-semibold">Student Information</h2>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <img
                    src={submission.user?.avatar}
                    alt={submission.user?.name}
                    className="h-16 w-16 rounded-full"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">
                      {submission.user?.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {submission.user?.email}
                    </p>
                    <div className="mt-2 flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        Submitted: {format(new Date(submission.submitted_at!), "PPP 'at' p")}
                      </div>
                      {submission.is_late && (
                        <Badge variant="destructive">
                          <AlertCircle className="mr-1 h-3 w-3" />
                          Late Submission
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submission Content */}
            {assignment.type === "file" ? (
              // File Submission
              <Card>
                <CardHeader variant="highlighted">
                  <h2 className="font-semibold">Submitted Files</h2>
                </CardHeader>
                <CardContent>
                  {submission.attachments && submission.attachments.length > 0 ? (
                    <div className="space-y-2">
                      {submission.attachments.map((attachment) => (
                        <a
                          key={attachment.id}
                          href={attachment.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-accent"
                        >
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <div className="flex-1">
                            <p className="font-medium">{attachment.filename}</p>
                            <p className="text-xs text-muted-foreground">
                              {(attachment.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          <Download className="h-4 w-4 text-muted-foreground" />
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No files submitted</p>
                  )}
                </CardContent>
              </Card>
            ) : (
              // Quiz Submission
              <Card>
                <CardHeader variant="highlighted">
                  <h2 className="font-semibold">Quiz Answers</h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {assignment.quiz_questions?.map((question, index) => {
                      const answer = submission.quiz_answers?.find(
                        (a) => a.quiz_question_id === question.id
                      );
                      const selectedOption = question.options?.find(
                        (o) => o.id === answer?.quiz_option_id
                      );

                      return (
                        <div key={question.id} className="space-y-2">
                          <div className="flex items-start gap-3">
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                              {index + 1}
                            </span>
                            <div className="flex-1">
                              <p className="font-medium">{question.question}</p>
                              <div className="mt-3 space-y-2">
                                {question.options?.map((option) => {
                                  const isSelected = option.id === answer?.quiz_option_id;
                                  const isCorrect = option.is_correct;
                                  
                                  return (
                                    <div
                                      key={option.id}
                                      className={cn(
                                        "rounded-lg border p-3",
                                        isSelected && isCorrect && "border-green-500 bg-green-50 dark:bg-green-950",
                                        isSelected && !isCorrect && "border-red-500 bg-red-50 dark:bg-red-950",
                                        !isSelected && isCorrect && "border-green-300 bg-green-50/50 dark:bg-green-950/50"
                                      )}
                                    >
                                      <div className="flex items-center gap-2">
                                        {isSelected && isCorrect && (
                                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                                        )}
                                        {isSelected && !isCorrect && (
                                          <XCircle className="h-4 w-4 text-red-600" />
                                        )}
                                        {!isSelected && isCorrect && (
                                          <CheckCircle2 className="h-4 w-4 text-green-400" />
                                        )}
                                        <span className={cn(
                                          "text-sm",
                                          isSelected && "font-medium"
                                        )}>
                                          {option.text}
                                        </span>
                                        {isSelected && (
                                          <Badge variant="secondary" className="ml-auto text-xs">
                                            Student's Answer
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                              <div className="mt-2 text-sm text-muted-foreground">
                                Points: {question.points || 1}
                              </div>
                            </div>
                          </div>
                          {index < (assignment.quiz_questions?.length || 0) - 1 && (
                            <Separator className="my-4" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Grading Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader variant="highlighted">
                <h3 className="font-semibold">Grade Assignment</h3>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="grade">Grade</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="grade"
                        type="number"
                        min="0"
                        max={assignment.points_possible}
                        step="0.01"
                        value={form.data.grade}
                        onChange={(e) => form.setData("grade", e.target.value)}
                        className="flex-1"
                      />
                      <span className="text-sm text-muted-foreground">
                        / {assignment.points_possible}
                      </span>
                    </div>
                    {form.errors.grade && (
                      <p className="mt-1 text-sm text-red-500">{form.errors.grade}</p>
                    )}
                    
                    {/* Show percentage and late penalty if applicable */}
                    {form.data.grade && (
                      <div className="mt-2 space-y-1 text-sm">
                        {submission.is_late && assignment.allow_late_submissions && assignment.late_penalty_percentage > 0 && (
                          <>
                            <p className="text-muted-foreground">
                              Base Grade: {parseFloat(form.data.grade as string).toFixed(2)} / {assignment.points_possible}
                            </p>
                            <p className="text-destructive">
                              Late Penalty: -{assignment.late_penalty_percentage}%
                            </p>
                            <p className={cn(
                              "font-semibold",
                              getGradeColor((calculateFinalGrade() / assignment.points_possible) * 100)
                            )}>
                              Final Grade: {calculateFinalGrade().toFixed(2)} / {assignment.points_possible}
                            </p>
                          </>
                        )}
                        <p className={cn(
                          "font-semibold",
                          getGradeColor((calculateFinalGrade() / assignment.points_possible) * 100)
                        )}>
                          {((calculateFinalGrade() / assignment.points_possible) * 100).toFixed(1)}%
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="feedback">Feedback</Label>
                    <Textarea
                      id="feedback"
                      rows={5}
                      value={form.data.feedback}
                      onChange={(e) => form.setData("feedback", e.target.value)}
                      placeholder="Provide feedback to the student..."
                    />
                    {form.errors.feedback && (
                      <p className="mt-1 text-sm text-red-500">{form.errors.feedback}</p>
                    )}
                  </div>

                  {submission.status === "graded" && submission.grade && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        This submission has already been graded. You are updating the existing grade.
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={form.processing}
                  >
                    {form.processing ? "Saving..." : "Save Grade"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Assignment Info */}
            <Card>
              <CardHeader variant="highlighted">
                <h3 className="font-semibold">Assignment Details</h3>
              </CardHeader>
              <CardContent>
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="font-medium text-muted-foreground">Title</dt>
                    <dd>{assignment.title}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-muted-foreground">Type</dt>
                    <dd>{assignment.type === "quiz" ? "Quiz" : "File Submission"}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-muted-foreground">Points</dt>
                    <dd>{assignment.points_possible}</dd>
                  </div>
                  {assignment.due_date && (
                    <div>
                      <dt className="font-medium text-muted-foreground">Due Date</dt>
                      <dd>{format(new Date(assignment.due_date), "PPP")}</dd>
                    </div>
                  )}
                  {assignment.allow_late_submissions && (
                    <div>
                      <dt className="font-medium text-muted-foreground">Late Penalty</dt>
                      <dd>{assignment.late_penalty_percentage}%</dd>
                    </div>
                  )}
                </dl>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
} 