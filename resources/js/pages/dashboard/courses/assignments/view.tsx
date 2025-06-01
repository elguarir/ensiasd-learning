import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FileUploader } from "@/components/ui/file-uploader";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import AppLayout from "@/layouts/app-layout";
import { cn } from "@/lib/utils";
import { Assignment, BreadcrumbItem, Course, Submission } from "@/types";
import { getAssignmentStatus } from "@/utils/course-utils";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import { format, formatDistanceToNow, isPast } from "date-fns";
import {
  AlertCircle,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  FileIcon,
  FileText,
  XCircle,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useIsInstructor } from "@/hooks/use-user";

interface AssignmentDetailsProps {
  course: Course;
  assignment: Assignment;
  submission: Submission | null;
  assignments: Assignment[];
}

export default function AssignmentDetails({
  course,
  assignment,
  submission,
  assignments,
}: AssignmentDetailsProps) {
  const isInstructor = useIsInstructor(course);
  console.log(isInstructor);
  const { status, type } = getAssignmentStatus(assignment);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});

  const form = useForm({
    files: [] as File[],
    answers: {} as Record<number, number>,
  });

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
    },
    {
      title: "My Courses",
      href: "/dashboard/courses",
    },
    {
      title: course.title,
      href: route("dashboard.courses.show", course.id),
    },
    {
      title: "Assignments",
      href: route("dashboard.courses.assignments", course.id),
    },
    {
      title: assignment.title,
      href: "#",
    },
  ];

  const handleFileChange = (files: File[]) => {
    setSelectedFiles(files);
    form.setData("files", files);
  };

  const handleQuizAnswer = (questionId: number, optionId: number) => {
    const newAnswers = { ...quizAnswers, [questionId]: optionId };
    setQuizAnswers(newAnswers);
    form.setData("answers", newAnswers);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (assignment.type === "file") {
      form.post(
        route("courses.assignments.submit", [course.id, assignment.id]),
        {
          forceFormData: true,
        },
      );
    } else {
      form.post(
        route("courses.assignments.submit", [course.id, assignment.id]),
      );
    }
  };

  const isLate = assignment.due_date && isPast(new Date(assignment.due_date));
  const canSubmit =
    assignment.published &&
    (!submission || submission.status === "draft") &&
    (!isLate || assignment.allow_late_submissions);

  const getStatusBadge = () => {
    if (!submission) {
      return <Badge variant="secondary">Not Started</Badge>;
    }

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

  const getSubmissionDate = () => {
    if (!submission || !submission.submitted_at) return null;

    return (
      <div className="text-muted-foreground flex items-center gap-2 text-sm">
        <Clock className="h-4 w-4" />
        Submitted{" "}
        {formatDistanceToNow(new Date(submission.submitted_at), {
          addSuffix: true,
        })}
        {submission.is_late && (
          <Badge variant="destructive" className="ml-2">
            <AlertCircle className="mr-1 h-3 w-3" />
            Late
          </Badge>
        )}
      </div>
    );
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Assignment: ${assignment.title}`} />

      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">
                {assignment.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3">
                {!isInstructor && getStatusBadge()}
                <Badge variant="outline">
                  <FileText className="mr-1 h-3 w-3" />
                  {assignment.type === "quiz" ? "Quiz" : "File Submission"}
                </Badge>
                {assignment.points_possible && (
                  <Badge variant="outline">
                    <Award className="mr-1 h-3 w-3" />
                    {assignment.points_possible} points
                  </Badge>
                )}
              </div>
            </div>
            {isInstructor && (
              <Button asChild>
                <Link
                  href={route("courses.assignments.submissions", [
                    course.id,
                    assignment.id,
                  ])}
                >
                  <Users className="mr-2 h-4 w-4" />
                  View Submissions
                </Link>
              </Button>
            )}
          </div>

          {/* Due Date Alert */}
          {assignment.due_date && (
            <Alert
              className={cn(
                "border-l-4",
                isLate
                  ? "border-l-destructive bg-destructive/5"
                  : "border-l-warning bg-warning/5",
              )}
            >
              <Calendar className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>
                  <strong>Due:</strong>{" "}
                  {format(new Date(assignment.due_date), "PPP 'at' p")}
                </span>
                {isLate && !assignment.allow_late_submissions && (
                  <span className="text-destructive text-sm font-medium">
                    Late submissions not allowed
                  </span>
                )}
                {isLate && assignment.allow_late_submissions && (
                  <span className="text-warning-foreground text-sm font-medium">
                    Late penalty: {assignment.late_penalty_percentage}%
                  </span>
                )}
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Assignment Details */}
          <div className="space-y-6 lg:col-span-2">
            {/* Description & Instructions Card */}
            {(assignment.description || assignment.instructions) && (
              <Card className="overflow-hidden">
                <CardHeader variant="highlighted">
                  <h2 className="font-semibold">Assignment Details</h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6 px-6 py-4">
                    {assignment.description && (
                      <div>
                        <h2 className="mb-3 text-lg font-semibold">
                          Description
                        </h2>
                        <div className="prose prose-sm text-muted-foreground max-w-none">
                          {assignment.description}
                        </div>
                      </div>
                    )}

                    {assignment.description && assignment.instructions && (
                      <Separator />
                    )}

                    {assignment.instructions && (
                      <div>
                        <h2 className="mb-3 text-lg font-semibold">
                          Instructions
                        </h2>
                        <div
                          className="prose prose-sm text-muted-foreground max-w-none"
                          dangerouslySetInnerHTML={{
                            __html: assignment.instructions,
                          }}
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Resources */}
            {assignment.attachments && assignment.attachments.length > 0 && (
              <Card className="overflow-hidden">
                <CardHeader variant="highlighted">
                  <h2 className="font-semibold">Resources</h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {assignment.attachments.map((attachment) => (
                      <a
                        key={attachment.id}
                        href={attachment.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:bg-accent flex items-center gap-3 rounded-lg border p-3 transition-colors"
                      >
                        <FileIcon className="text-muted-foreground h-5 w-5" />
                        <span className="flex-1 text-sm font-medium">
                          {attachment.filename}
                        </span>
                        <Download className="text-muted-foreground h-4 w-4" />
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Submission Form */}
            {!isInstructor && canSubmit && (
              <Card className="overflow-hidden">
                <CardHeader variant="highlighted">
                  <h2 className="font-semibold">Submit Assignment</h2>
                </CardHeader>

                <form onSubmit={handleSubmit} className="px-6 py-4">
                  {assignment.type === "file" ? (
                    // File Upload Form
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="files" className="mb-2">
                          Upload Files
                        </Label>
                        <FileUploader
                          value={selectedFiles}
                          onChange={handleFileChange}
                          maxFiles={5}
                          maxSize={10 * 1024 * 1024} // 10MB
                          accept={[
                            ".pdf",
                            ".doc",
                            ".docx",
                            ".txt",
                            ".jpg",
                            ".jpeg",
                            ".png",
                          ]}
                          uploadText="Drag and drop files here or click to upload"
                          variant="default"
                        />
                        <p className="text-muted-foreground mt-2 text-xs">
                          Accepted formats: PDF, DOC, DOCX, TXT, JPG, PNG • Max
                          10MB per file
                        </p>
                      </div>
                    </div>
                  ) : (
                    // Quiz Form
                    <div className="space-y-6">
                      {assignment.quiz_questions?.map((question, qIndex) => (
                        <div key={question.id} className="space-y-3">
                          <div className="flex items-start gap-3">
                            <span className="bg-primary text-primary-foreground flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium">
                              {qIndex + 1}
                            </span>
                            <div className="flex-1 space-y-3">
                              <p className="leading-relaxed font-medium">
                                {question.question}
                              </p>
                              <RadioGroup
                                value={quizAnswers[question.id]?.toString()}
                                onValueChange={(value) =>
                                  handleQuizAnswer(question.id, parseInt(value))
                                }
                              >
                                {question.options?.map((option) => (
                                  <div
                                    key={option.id}
                                    className="flex items-start space-x-3 py-2"
                                  >
                                    <RadioGroupItem
                                      value={option.id.toString()}
                                      id={`q${question.id}-o${option.id}`}
                                      className="mt-0.5"
                                    />
                                    <Label
                                      htmlFor={`q${question.id}-o${option.id}`}
                                      className="flex-1 cursor-pointer leading-relaxed font-normal"
                                    >
                                      {option.text}
                                    </Label>
                                  </div>
                                ))}
                              </RadioGroup>
                            </div>
                          </div>
                          {qIndex <
                            (assignment.quiz_questions?.length ?? 0) - 1 && (
                            <Separator className="mt-6" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-6 flex gap-3">
                    <Button
                      type="submit"
                      disabled={
                        form.processing ||
                        (assignment.type === "file" &&
                          selectedFiles.length === 0) ||
                        (assignment.type === "quiz" &&
                          Object.keys(quizAnswers).length === 0)
                      }
                    >
                      {form.processing ? "Submitting..." : "Submit Assignment"}
                    </Button>
                    <Button variant="outline" asChild>
                      <Link
                        href={route("dashboard.courses.assignments", course.id)}
                      >
                        Cancel
                      </Link>
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            {/* Submitted Work */}
            {!isInstructor && submission && submission.status !== "draft" && (
              <Card className="overflow-hidden">
                <CardHeader variant="highlighted">
                  <h2 className="font-semibold">Your Submission</h2>
                </CardHeader>

                <div className="space-y-4 px-6 py-4">
                  {getSubmissionDate()}

                  {/* File Submissions */}
                  {assignment.type === "file" &&
                    submission.attachments &&
                    submission.attachments.length > 0 && (
                      <div className="space-y-3">
                        <p className="text-sm font-medium">Submitted files:</p>
                        <div className="space-y-2">
                          {submission.attachments.map((attachment) => (
                            <div
                              key={attachment.id}
                              className="bg-muted/30 flex items-center gap-3 rounded-lg border p-3"
                            >
                              <FileText className="text-muted-foreground h-5 w-5" />
                              <span className="flex-1 text-sm">
                                {attachment.filename}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Quiz Answers */}
                  {assignment.type === "quiz" &&
                    submission.quiz_answers &&
                    assignment.quiz_questions && (
                      <div className="space-y-4">
                        <p className="text-sm font-medium">Your answers:</p>
                        <div className="space-y-3">
                          {assignment.quiz_questions.map((question, index) => {
                            const answer = submission.quiz_answers?.find(
                              (a) => a.quiz_question_id === question.id,
                            );
                            const selectedOption = question.options?.find(
                              (o) => o.id === answer?.quiz_option_id,
                            );

                            return (
                              <div
                                key={question.id}
                                className="bg-muted/30 space-y-2 rounded-lg border p-4"
                              >
                                <p className="text-sm font-medium">
                                  Q{index + 1}: {question.question}
                                </p>
                                <p className="text-muted-foreground text-sm">
                                  <span className="font-medium">
                                    Your answer:
                                  </span>{" "}
                                  {selectedOption?.text || "No answer"}
                                  {submission.status === "graded" &&
                                    selectedOption?.is_correct && (
                                      <CheckCircle2 className="ml-2 inline h-4 w-4 text-green-600" />
                                    )}
                                  {submission.status === "graded" &&
                                    selectedOption &&
                                    !selectedOption.is_correct && (
                                      <XCircle className="text-destructive ml-2 inline h-4 w-4" />
                                    )}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                </div>
              </Card>
            )}
          </div>

          {/* Right Column - Status and Grade */}
          <div className="space-y-6">
            {/* Submission Status / Assignment Stats for Instructors */}
            {isInstructor ? (
              <Card>
                <CardHeader variant="highlighted">
                  <h3 className="font-semibold">Assignment Statistics</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button className="w-full" asChild>
                      <Link
                        href={route("courses.assignments.submissions", [
                          course.id,
                          assignment.id,
                        ])}
                      >
                        <Users className="mr-2 h-4 w-4" />
                        View All Submissions
                      </Link>
                    </Button>
                    <p className="text-sm text-muted-foreground text-center">
                      Click to view and grade student submissions
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader variant="highlighted">
                  <h3 className="font-semibold">Submission Status</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getStatusBadge()}
                    {getSubmissionDate()}

                    {!submission &&
                      isLate &&
                      !assignment.allow_late_submissions && (
                        <Alert variant="destructive" className="mt-4">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            This assignment is past due and late submissions are
                            not allowed.
                          </AlertDescription>
                        </Alert>
                      )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Grade */}
            {!isInstructor &&
              submission &&
              submission.status === "graded" &&
              submission.grade !== null && (
                <Card>
                  <CardHeader variant="highlighted">
                    <h3 className="mb-4 font-semibold">Grade</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold">
                          {submission.grade}
                          {assignment.points_possible && (
                            <span className="text-muted-foreground text-lg font-normal">
                              /{assignment.points_possible}
                            </span>
                          )}
                        </div>
                        <p className="text-muted-foreground mt-1 text-sm">
                          {(
                            (submission.grade /
                              (assignment.points_possible || 100)) *
                            100
                          ).toFixed(0)}
                          %
                        </p>
                      </div>

                      {submission.feedback && (
                        <div>
                          <h4 className="mb-2 text-sm font-medium">Feedback</h4>
                          <div className="bg-muted rounded-lg p-3 text-sm">
                            {submission.feedback}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

            {/* Assignment Info */}
            <Card>
              <CardHeader variant="highlighted">
                <h3 className="font-semibold">Assignment Details</h3>
              </CardHeader>
              <CardContent>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground font-medium">Type</dt>
                    <dd>
                      {assignment.type === "quiz" ? "Quiz" : "File Upload"}
                    </dd>
                  </div>
                  {assignment.points_possible && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground font-medium">
                        Points
                      </dt>
                      <dd>{assignment.points_possible}</dd>
                    </div>
                  )}
                  {assignment.due_date && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground font-medium">Due</dt>
                      <dd>
                        {format(new Date(assignment.due_date), "MMM d, yyyy")}
                      </dd>
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
