import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Course } from "@/types";
import { confirm } from "@/utils/confirm";
import { Link, router } from "@inertiajs/react";
import {
  ArchiveIcon,
  CodeIcon,
  EditIcon,
  EllipsisIcon,
  EyeIcon,
  LinkIcon,
  TrashIcon,
  UploadIcon,
  UserIcon,
} from "lucide-react";
import { ReactNode } from "react";
import { toast } from "sonner";
import CourseCodeDialog from "./course-code-dialog";

// Action handler functions

export function handlePublishCourse(courseId: number | string) {
  const promise = new Promise<void>((resolve, reject) => {
    router.put(
      route("dashboard.courses.status", { course: courseId }),
      {
        status: "published",
      },
      {
        onSuccess: () => resolve(),
        onError: () => reject(new Error("Failed to publish course")),
      },
    );
  });

  toast.promise(promise, {
    loading: "Publishing course...",
    success: "Course published successfully",
    error: "Failed to publish course",
  });
}

export function handleUnpublishCourse(courseId: number | string) {
  return async () => {
    try {
      // Confirm before unpublishing
      await confirm({
        title: "Unpublish course",
        message:
          "Are you sure you want to unpublish this course? Students won't be able to access it until it's published again.",
        confirmText: "Unpublish",
        cancelText: "Cancel",
      });

      // User confirmed
      const promise = new Promise<void>((resolve, reject) => {
        router.put(
          route("dashboard.courses.status", { course: courseId }),
          {
            status: "draft",
          },
          {
            onSuccess: () => resolve(),
            onError: () => reject(new Error("Failed to unpublish course")),
          },
        );
      });

      toast.promise(promise, {
        loading: "Unpublishing course...",
        success: "Course unpublished successfully",
        error: "Failed to unpublish course",
      });
    } catch {
      // User cancelled, do nothing
    }
  };
}

export function handleArchiveCourse(courseId: number | string) {
  const promise = new Promise<void>((resolve, reject) => {
    router.put(
      route("dashboard.courses.status", { course: courseId }),
      {
        status: "archived",
      },
      {
        onSuccess: () => resolve(),
        onError: () => reject(new Error("Failed to archive course")),
      },
    );
  });

  toast.promise(promise, {
    loading: "Archiving course...",
    success: "Course archived successfully",
    error: "Failed to archive course",
  });
}

export function handleRestoreCourse(courseId: number | string) {
  const promise = new Promise<void>((resolve, reject) => {
    router.put(
      route("dashboard.courses.status", { course: courseId }),
      {
        status: "draft",
      },
      {
        onSuccess: () => resolve(),
        onError: () => reject(new Error("Failed to restore course")),
      },
    );
  });

  toast.promise(promise, {
    loading: "Restoring course...",
    success: "Course restored successfully",
    error: "Failed to restore course",
  });
}

export function handleDeleteCourse(courseId: number | string) {
  return async () => {
    try {
      // Show the confirmation dialog and wait for user response
      await confirm({
        title: "Delete course",
        message:
          "Are you sure you want to delete this course? This action cannot be undone.",
        confirmText: "Delete",
        cancelText: "Cancel",
        variant: "destructive",
      });

      // If we get here, user confirmed the action
      const promise = new Promise<void>((resolve, reject) => {
        router.delete(
          route("dashboard.courses.destroy", { course: courseId }),
          {
            onSuccess: () => resolve(),
            onError: () => reject(new Error("Failed to delete course")),
          },
        );
      });

      toast.promise(promise, {
        loading: "Deleting course...",
        success: "Course deleted successfully",
        error: "Failed to delete course",
      });
    } catch {
      // User cancelled, do nothing
    }
  };
}

export function handleCopyInviteLink(course: Course) {
  return async () => {
    try {
      const inviteLink = `${window.location.origin}/courses/join/${course.invite_token}`;
      await navigator.clipboard.writeText(inviteLink);
      
      toast.success("Invite link copied to clipboard!");
    } catch (error) {}
  };
}

interface CourseActionsProps {
  course: Course;
  children?: ReactNode;
}

// The main component that renders a dropdown menu with course actions
export default function CourseActions({
  course,
  children,
}: CourseActionsProps) {
  const isPublished = course.status === "published";
  const isArchived = course.status === "archived";
  const isDraft = course.status === "draft";

  const deleteCourseHandler = handleDeleteCourse(course.id);
  const copyInviteLinkHandler = handleCopyInviteLink(course);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children || (
          <Button
            size="icon"
            variant="ghost"
            className="shadow-none"
            aria-label="Course actions"
          >
            <span className="sr-only">Open menu</span>
            <EllipsisIcon className="h-4 w-4" />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={route("dashboard.courses.show", { course: course.id })}>
              <EditIcon className="mr-2 h-4 w-4" />
              <span>Edit course</span>
              <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={route("dashboard.courses.show", { course: course.id })}>
              <EyeIcon className="mr-2 h-4 w-4" />
              <span>View course</span>
              <DropdownMenuShortcut>⌘V</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          {isDraft && (
            <DropdownMenuItem onClick={() => handlePublishCourse(course.id)}>
              <UploadIcon className="mr-2 h-4 w-4" />
              <span>Publish</span>
              <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
          )}
          {isPublished && (
            <DropdownMenuItem onClick={() => handleUnpublishCourse(course.id)}>
              <UploadIcon className="mr-2 h-4 w-4 rotate-180" />
              <span>Unpublish</span>
              <DropdownMenuShortcut>⌘U</DropdownMenuShortcut>
            </DropdownMenuItem>
          )}
          {!isArchived && (
            <DropdownMenuItem onClick={() => handleArchiveCourse(course.id)}>
              <ArchiveIcon className="mr-2 h-4 w-4" />
              <span>Archive</span>
              <DropdownMenuShortcut>⌘A</DropdownMenuShortcut>
            </DropdownMenuItem>
          )}
          {isArchived && (
            <DropdownMenuItem onClick={() => handleRestoreCourse(course.id)}>
              <ArchiveIcon className="mr-2 h-4 w-4" />
              <span>Restore</span>
              <DropdownMenuShortcut>⌘R</DropdownMenuShortcut>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link
              href={route("dashboard.courses.students", { course: course.id })}
            >
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Manage students</span>
            </Link>
          </DropdownMenuItem>
          <CourseCodeDialog course={course}>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <CodeIcon className="mr-2 h-4 w-4" />
              <span>Show course code</span>
              <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
            </DropdownMenuItem>
          </CourseCodeDialog>
          <DropdownMenuItem onClick={copyInviteLinkHandler}>
            <LinkIcon className="mr-2 h-4 w-4" />
            <span>Copy invite link</span>
            <DropdownMenuShortcut>⌘L</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={deleteCourseHandler}
          className="text-destructive focus:text-destructive"
        >
          <TrashIcon className="mr-2 h-4 w-4" />
          <span>Delete course</span>
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
