import { EmptyState } from "@/components/empty-state";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileUploader } from "@/components/ui/file-uploader";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Textarea } from "@/components/ui/textarea";
import { useIsInstructor, useUser } from "@/hooks/use-user";
import { Announcement, Course } from "@/types";
import { formatRelativeTime, getInitials } from "@/utils/course-utils";
import { router, useForm } from "@inertiajs/react";
import {
  Download,
  FileText,
  Info,
  MessageSquare,
  Paperclip,
  PlusCircle,
  Send,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface AnnouncementsTabProps {
  announcements: Announcement[];
  course: Course;
}

export default function AnnouncementsTab({
  announcements: initialAnnouncements,
  course,
}: AnnouncementsTabProps) {
  const [announcements, setAnnouncements] =
    useState<Announcement[]>(initialAnnouncements);
  const isInstructor = useIsInstructor(course);

  const handleDeleteAnnouncement = (announcementId: number) => {
    if (confirm("Are you sure you want to delete this announcement?")) {
      router.delete(route("announcements.destroy", announcementId), {
        onSuccess: () => {
          toast.success("Announcement deleted successfully");
          setAnnouncements(
            announcements.filter((a) => a.id !== announcementId),
          );
        },
        onError: () => {
          toast.error("Failed to delete announcement");
        },
        preserveScroll: true,
      });
    }
  };

  useEffect(() => {
    setAnnouncements(initialAnnouncements);
  }, [initialAnnouncements]);

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Announcements</h2>
        {isInstructor && <CreateAnnouncementDialog courseId={course.id} />}
      </div>

      {announcements.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {announcements.map((announcement) => (
            <AnnouncementCard
              key={announcement.id}
              course={course}
              announcement={announcement}
              onDelete={() => handleDeleteAnnouncement(announcement.id)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No announcements yet"
          description="There are no announcements for this course yet. Check back later for updates from your instructor."
          icons={[Info, MessageSquare]}
        />
      )}
    </div>
  );
}

interface CreateAnnouncementDialogProps {
  courseId: number;
}

function CreateAnnouncementDialog({ courseId }: CreateAnnouncementDialogProps) {
  const [open, setOpen] = useState(false);

  const { data, setData, post, processing, reset, errors } = useForm({
    content: "",
    attachments: [] as File[],
  });

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();

    post(route("courses.announcements.store", courseId), {
      onSuccess: () => {
        toast.success("Announcement posted successfully");
        reset();
        setOpen(false);
        router.reload({ only: ["announcements"] });
      },
      onError: () => {
        toast.error("Failed to post announcement");
      },
      forceFormData: true,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Announcement
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Announcement</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleCreateAnnouncement} className="space-y-4">
          <div>
            <label htmlFor="content" className="mb-2 block text-sm font-medium">
              Announcement Content
            </label>
            <RichTextEditor
              content={data.content}
              onChange={(content) => setData("content", content)}
              className="min-h-[250px]"
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-500">{errors.content}</p>
            )}
          </div>

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
              uploadText="Drag files here or click to upload"
            />
            {errors.attachments && (
              <p className="mt-1 text-sm text-red-500">{errors.attachments}</p>
            )}
            <p className="text-muted-foreground mt-1 text-xs">
              Max 5 files, 5MB each. Supported formats: Images, PDF, Office
              documents, text files, and ZIP archives.
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={processing}>
              {processing ? "Posting..." : "Post Announcement"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function AnnouncementCard({
  announcement,
  course,
  onDelete,
}: {
  announcement: Announcement;
  onDelete: () => void;
  course: Course;
}) {
  
  const user = useUser();
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentAttachments, setCommentAttachments] = useState<File[]>([]);
  const announcer = announcement.user;
  const isInstructor = useIsInstructor(course);

  const handlePostComment = () => {
    if (!comment.trim() && commentAttachments.length === 0) return;

    const formData = new FormData();
    formData.append("content", comment);
    commentAttachments.forEach((file) => {
      formData.append("attachments[]", file);
    });

    setIsSubmitting(true);
    router.post(
      route("announcements.comments.store", announcement.id),
      formData,
      {
        onSuccess: () => {
          router.reload({ only: ["announcements"] });
          setComment("");
          setCommentAttachments([]);
          toast.success("Comment posted successfully");
        },
        onError: () => {
          toast.error("Failed to post comment");
        },
        preserveScroll: true,
        onFinish: () => {
          setIsSubmitting(false);
        },
      },
    );
  };
  const handleDeleteComment = (commentId: number) => {
    if (confirm("Are you sure you want to delete this comment?")) {
      router.delete(route("announcement-comments.destroy", commentId), {
        onSuccess: () => {
          router.reload({ only: ["announcements"] });
          toast.success("Comment deleted successfully");
        },
        onError: () => {
          toast.error("Failed to delete comment");
        },
        preserveScroll: true,
      });
    }
  };

  return (
    <Card className="overflow-hidden py-0">
      <div className="border-l-[6px] border-blue-500 pt-4 dark:border-blue-400">
        <CardHeader className="flex flex-row items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={announcer?.avatar || undefined}
                alt={announcer?.name}
              />
              <AvatarFallback>
                {getInitials(announcer?.name || "")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="mb-0.5 text-base font-medium">{announcer?.name}</p>
              <p className="text-muted-foreground text-xs">
                Posted {formatRelativeTime(announcement.created_at)}
              </p>
            </div>
          </div>

          {isInstructor && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-500 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </CardHeader>
        <CardContent className="pt-2">
          <div
            className="prose prose-sm dark:prose-invert max-w-none pb-4"
            dangerouslySetInnerHTML={{
              __html: announcement.content,
            }}
          />

          {/* Announcement Attachments */}
          {announcement.attachments && announcement.attachments.length > 0 && (
            <div className="mt-4 border-t pt-4">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-medium">
                <Paperclip className="h-4 w-4" />
                Attachments ({announcement.attachments.length})
              </h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {announcement.attachments.map((attachment) => (
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

        {/* Comments section */}
        <div className="border-t border-neutral-200 dark:border-neutral-800">
          <div className="bg-neutral-50 p-4 dark:bg-neutral-900/30">
            <h4 className="mb-3 flex items-center gap-1.5 text-sm font-medium">
              <MessageSquare className="h-4 w-4" />
              Comments ({announcement.comments?.length || 0})
            </h4>

            {announcement.comments && announcement.comments.length > 0 ? (
              <div className="mb-4 space-y-4">
                {announcement.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={comment.user.avatar || undefined}
                        alt={comment.user.name}
                      />
                      <AvatarFallback>
                        {getInitials(comment.user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 rounded-lg bg-white p-3 shadow-sm dark:bg-neutral-800">
                      <div className="mb-1 flex items-center justify-between">
                        <p className="text-sm font-medium">
                          {comment.user.name}
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="text-muted-foreground text-xs">
                            {formatRelativeTime(comment.created_at)}
                          </p>
                          {isInstructor && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-red-500 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900"
                              onClick={() => handleDeleteComment(comment.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                      <p className="text-sm">{comment.content}</p>

                      {/* Comment Attachments */}
                      {comment.attachments &&
                        comment.attachments.length > 0 && (
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
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground mb-4 text-sm">
                No comments yet. Be the first to comment!
              </p>
            )}

            {/* Add comment form */}
            <div className="mt-4 space-y-4">
              <div className="flex w-full max-w-full gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={user?.avatar || undefined}
                    alt={user?.name}
                  />
                  <AvatarFallback>
                    {getInitials(user?.name || "")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="resize-none"
                    rows={2}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <FileUploader
                  value={commentAttachments}
                  onChange={setCommentAttachments}
                  maxFiles={3}
                  maxSize={2 * 1024 * 1024} // 2MB max size
                  accept={[
                    "image/*",
                    "application/pdf",
                    ".doc",
                    ".docx",
                    ".txt",
                  ]}
                  uploadText="Attach files"
                  variant="compact"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Max 3 files, 2MB each
                </p>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handlePostComment}
                  className="flex items-center gap-2"
                  variant="secondary"
                  disabled={
                    (!comment.trim() && commentAttachments.length === 0) ||
                    isSubmitting
                  }
                >
                  <Send className="h-4 w-4" />
                  Post Comment
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
