import { EmptyState } from "@/components/empty-state";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileUploader } from "@/components/ui/file-uploader";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Course, CourseThread } from "@/types";
import { formatRelativeTime, getInitials } from "@/utils/course-utils";
import { Link, router, useForm } from "@inertiajs/react";
import {
  ArrowRight,
  MessageSquare,
  Paperclip,
  PlusCircle,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface DiscussionTabProps {
  threads?: CourseThread[];
  course: Course;
}

export default function DiscussionTab({
  threads = [],
  course,
}: DiscussionTabProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data, setData, post, processing, reset, errors } = useForm({
    title: "",
    body: "",
    attachments: [] as File[],
  });

  const handleCreateThread = (e: React.FormEvent) => {
    e.preventDefault();
    post(route("courses.threads.store", course.id), {
      onSuccess: () => {
        toast.success("Thread created successfully");
        reset();
        setIsDialogOpen(false);
        router.reload({ only: ["threads"] });
      },
      onError: () => {
        toast.error("Failed to create thread");
      },
      forceFormData: true,
    });
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Discussion</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Thread
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] max-w-3xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Discussion Thread</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateThread} className="space-y-4">
              <div>
                <label
                  htmlFor="title"
                  className="mb-1 block text-sm font-medium"
                >
                  Thread Title
                </label>
                <Input
                  id="title"
                  placeholder="Enter a title for your thread"
                  value={data.title}
                  onChange={(e) => setData("title", e.target.value)}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="body"
                  className="mb-1 block text-sm font-medium"
                >
                  Thread Content
                </label>
                <RichTextEditor
                  content={data.body}
                  onChange={(content) => setData("body", content)}
                  className="min-h-[250px]"
                />
                {errors.body && (
                  <p className="mt-1 text-sm text-red-500">{errors.body}</p>
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
                  <p className="mt-1 text-sm text-red-500">
                    {errors.attachments}
                  </p>
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
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                  {processing ? "Creating..." : "Create Thread"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {threads.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {threads.map((thread) => (
            <ThreadCard key={thread.id} thread={thread} course={course} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No discussions yet"
          description="Start a conversation with your instructor and classmates by creating a new discussion thread."
          icons={[MessageSquare, Users]}
          action={{
            label: "Start a discussion",
            onClick: () => setIsDialogOpen(true),
          }}
        />
      )}
    </div>
  );
}

function ThreadCard({
  thread,
  course,
}: {
  thread: CourseThread;
  course: Course;
}) {
  const commentCount = thread.comments?.length || 0;
  const hasAttachments = thread.attachments && thread.attachments.length > 0;

  return (
    <Card className="hover:border-primary/50 transition-colors duration-200">
      <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-2">
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={thread.author?.avatar || undefined}
            alt={thread.author?.name}
          />
          <AvatarFallback>
            {getInitials(thread.author?.name || "")}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="leading-none font-semibold">{thread.title}</h3>
            <div className="flex items-center gap-2">
              {hasAttachments && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Paperclip className="h-3 w-3" />
                  {thread.attachments?.length}
                </Badge>
              )}
              <Badge variant="outline">
                {commentCount} {commentCount === 1 ? "reply" : "replies"}
              </Badge>
            </div>
          </div>
          <p className="text-muted-foreground text-sm">
            {thread.author?.name} • {formatRelativeTime(thread.created_at)}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-muted-foreground prose prose-sm dark:prose-invert prose-p:m-0 prose-headings:m-0 prose-li:m-0 line-clamp-2 text-sm">
          <div dangerouslySetInnerHTML={{ __html: thread.content }} />
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild variant="ghost" className="ml-auto" size="sm">
          <Link
            href={route("courses.threads.show", {
              course: course.id,
              thread: thread.id,
            })}
          >
            View Thread <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
