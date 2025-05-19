import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FileUploader } from "@/components/ui/file-uploader";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/hooks/use-user";
import AppLayout from "@/layouts/app-layout";
import {
  BreadcrumbItem,
  Course,
  CourseThread,
  ThreadComment as ThreadCommentType,
} from "@/types";
import { formatRelativeTime, getInitials } from "@/utils/course-utils";
import { Head, Link, router, useForm } from "@inertiajs/react";
import {
  ArrowLeft,
  Download,
  FileText,
  MessageSquare,
  Paperclip,
  Send,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

// Extend the ThreadComment interface to include replies
interface ThreadComment extends ThreadCommentType {
  replies?: ThreadComment[];
}

interface ThreadProps {
  course: Course;
  thread: CourseThread;
}

export default function ThreadView({ course, thread }: ThreadProps) {
  // Define breadcrumbs for the page
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
    },
    {
      title: "Courses",
      href: "/dashboard/courses",
    },
    {
      title: course.title,
      href: route("dashboard.courses.show", course.id),
    },
    {
      title: "Thread",
      href: "#",
    },
  ];

  const { data, setData, post, reset, errors, processing } = useForm({
    content: "",
    attachments: [] as File[],
  });

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();

    if (!data.content.trim() && data.attachments.length === 0) return;

    post(
      route("courses.threads.comments.store", {
        course: course.id,
        thread: thread.id,
      }),
      {
        onSuccess: () => {
          reset();
          toast.success("Comment added successfully");
        },
        onError: () => {
          toast.error("Failed to post comment");
        },
        forceFormData: true,
      },
    );
  };

  // Organize comments into a tree structure with parent-child relationships
  const organizeCommentsTree = (
    comments: ThreadCommentType[] = [],
  ): ThreadComment[] => {
    const commentMap = new Map<number, ThreadComment>();
    const rootComments: ThreadComment[] = [];

    // First pass: Create ThreadComment objects with replies array
    comments.forEach((comment) => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    // Second pass: Establish parent-child relationships
    comments.forEach((comment) => {
      const threadComment = commentMap.get(comment.id)!;

      if (comment.parent_id) {
        // This is a reply, add it to its parent's replies
        const parent = commentMap.get(comment.parent_id);
        if (parent && parent.replies) {
          parent.replies.push(threadComment);
        }
      } else {
        // This is a top-level comment
        rootComments.push(threadComment);
      }
    });

    return rootComments;
  };

  // Get the tree of comments
  const commentTree = organizeCommentsTree(thread.comments);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Discussion`} />
      <div className="container mx-auto py-4">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href={route("dashboard.courses")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to discussions
          </Link>
        </Button>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Thread Details - Left Column */}
          <div>
            <Card className="sticky top-4 overflow-hidden">
              <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={thread.author?.avatar || undefined}
                    alt={thread.author?.name}
                  />
                  <AvatarFallback>
                    {getInitials(thread.author?.name || "")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex flex-col space-y-1 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                    <h1 className="text-2xl font-bold">{thread.title}</h1>
                    <Badge variant="outline">
                      {thread.comments?.length || 0}{" "}
                      {thread.comments?.length === 1 ? "reply" : "replies"}
                    </Badge>
                  </div>
                  <div className="text-muted-foreground flex items-center gap-2 text-sm">
                    <span>{thread.author?.name}</span>
                    <span>•</span>
                    <span>{formatRelativeTime(thread.created_at)}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-stone dark:prose-invert max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: thread.content }} />
                </div>

                {/* Thread Attachments */}
                {thread.attachments && thread.attachments.length > 0 && (
                  <div className="mt-6 border-t pt-4">
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-medium">
                      <Paperclip className="h-4 w-4" />
                      Attachments ({thread.attachments.length})
                    </h3>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {thread.attachments.map((attachment) => (
                        <div
                          key={attachment.id}
                          className="flex items-center justify-between rounded-md border p-3"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="text-muted-foreground h-4 w-4" />
                            <div>
                              <p className="text-sm font-medium">
                                {attachment.filename}
                              </p>
                              <p className="text-muted-foreground text-xs">
                                {Math.round(attachment.size / 1024)} KB
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            asChild
                          >
                            <a
                              href={attachment.path}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Download file"
                            >
                              <Download className="h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Comments Section - Right Column */}
          <div>
            <div className="mb-6">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                <MessageSquare className="h-5 w-5" />
                Comments ({thread.comments?.length || 0})
              </h2>

              {commentTree.length > 0 ? (
                <div className="space-y-6">
                  {commentTree.map((comment) => (
                    <CommentCard
                      key={comment.id}
                      comment={comment}
                      courseId={course.id}
                      threadId={thread.id}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed p-6 text-center">
                  <p className="text-muted-foreground">
                    No comments yet. Be the first to comment!
                  </p>
                </div>
              )}
            </div>

            {/* Add Comment Form */}
            <div className="sticky top-4 mt-8">
              <h3 className="mb-4 text-lg font-medium">Add a Comment</h3>
              <form onSubmit={handleSubmitComment} className="space-y-4">
                <div>
                  <Textarea
                    placeholder="Write your comment here..."
                    value={data.content}
                    onChange={(e) => setData("content", e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                  {errors.content && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.content}
                    </p>
                  )}
                </div>

                {/* File Attachments */}
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Attachments (optional)
                  </label>
                  <FileUploader
                    value={data.attachments}
                    onChange={(files) => setData("attachments", files)}
                    maxFiles={5}
                    maxSize={5 * 1024 * 1024} // 5MB max size
                    accept={[
                      "image/*",
                      "application/pdf",
                      ".doc",
                      ".docx",
                      ".xls",
                      ".xlsx",
                      ".ppt",
                      ".pptx",
                      ".txt",
                      ".zip",
                    ]}
                    variant="compact"
                    uploadText="Attach files"
                  />
                  {errors.attachments && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.attachments}
                    </p>
                  )}
                  <p className="text-muted-foreground mt-1 text-xs">
                    Max 5 files, 5MB each. Supported formats: Images, PDF,
                    Office documents, text files, and ZIP archives.
                  </p>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={
                      processing ||
                      (!data.content.trim() && data.attachments.length === 0)
                    }
                    className="flex items-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    Post Comment
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

interface CommentCardProps {
  comment: ThreadComment;
  courseId: number;
  threadId: number;
}

function CommentCard({ comment, courseId, threadId }: CommentCardProps) {
  const currentUser = useUser();
  const isAuthor = currentUser?.id === comment.author_id;
  const canDelete = isAuthor || currentUser?.role === "instructor";

  const handleDeleteComment = () => {
    if (confirm("Are you sure you want to delete this comment?")) {
      router.delete(
        route("courses.threads.comments.destroy", {
          course: courseId,
          thread: threadId,
          comment: comment.id,
        }),
        {
          preserveScroll: true,
          onSuccess: () => {
            toast.success("Comment deleted successfully");
          },
          onError: () => {
            toast.error("Failed to delete comment");
          },
        },
      );
    }
  };

  return (
    <div className="flex gap-4">
      <Avatar className="h-10 w-10">
        <AvatarImage
          src={comment.author?.avatar || undefined}
          alt={comment.author?.name}
        />
        <AvatarFallback>
          {getInitials(comment.author?.name || "")}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-1">
        <div className="bg-card rounded-lg border p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <div className="font-medium">{comment.author?.name}</div>
            <div className="flex items-center gap-2">
              <div className="text-muted-foreground text-xs">
                {formatRelativeTime(comment.created_at)}
              </div>
              {canDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive h-6 w-6"
                  onClick={handleDeleteComment}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>
          <p className="text-sm whitespace-pre-line">{comment.content}</p>

          {/* Comment Attachments */}
          {comment.attachments && comment.attachments.length > 0 && (
            <div className="mt-3 border-t pt-3">
              <div className="text-muted-foreground mb-1 flex items-center gap-1 text-xs font-medium">
                <Paperclip className="h-3.5 w-3.5 shrink-0" />
                <span>Attachments:</span>
              </div>
              <div className="grid gap-2">
                {comment.attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="bg-muted flex items-center justify-between rounded-md p-2"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="truncate text-xs">
                        {attachment.filename}
                      </span>
                    </div>
                    <a
                      href={attachment.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:bg-muted-foreground/10 flex-shrink-0 rounded-sm p-1"
                      title="Download"
                    >
                      <Download className="h-3 w-3" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-3 space-y-3 pl-6">
            {comment.replies.map((reply) => (
              <CommentCard
                key={reply.id}
                comment={reply}
                courseId={courseId}
                threadId={threadId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
