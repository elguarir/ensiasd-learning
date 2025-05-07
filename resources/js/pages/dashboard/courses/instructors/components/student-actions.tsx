import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { confirm } from "@/utils/confirm";
import { router } from "@inertiajs/react";
import { CheckCircle, MoreHorizontal, UserMinus } from "lucide-react";
import { toast } from "sonner";

interface StudentActionsProps {
  courseId: number;
  student: {
    id: number;
    name: string;
  };
  enrollmentId: number;
}

export default function StudentActions({
  courseId,
  student,
  enrollmentId,
}: StudentActionsProps) {
  const handleRemoveStudent = async () => {
    try {
      await confirm({
        title: "Remove student",
        message: `Are you sure you want to remove ${student.name} from this course? This action cannot be undone.`,
        variant: "destructive",
      });

      // Call the API to remove the student using Inertia
      const promise = new Promise<void>((resolve, reject) => {
        router.delete(
          route("dashboard.courses.students.remove", {
            course: courseId,
            enrollment: enrollmentId,
          }),
          {
            onSuccess: () => resolve(),
            onError: () => reject(new Error("Failed to remove student")),
          },
        );
      });

      toast.promise(promise, {
        loading: "Removing student...",
        success: "Student removed successfully",
        error: "Failed to remove student",
      });
    } catch (error) {
      // User cancelled the action
    }
  };

  const handleUpdateStatus = (completed: boolean) => {
    const promise = new Promise<void>((resolve, reject) => {
      router.put(
        route("dashboard.courses.students.update", {
          course: courseId,
          enrollment: enrollmentId,
        }),
        { completed },
        {
          onSuccess: () => resolve(),
          onError: () => reject(new Error("Failed to update student status")),
        },
      );
    });

    toast.promise(promise, {
      loading: "Updating student status...",
      success: "Student status updated successfully",
      error: "Failed to update student status",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => handleUpdateStatus(true)}
          className="cursor-pointer"
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          Mark as completed
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleUpdateStatus(false)}
          className="cursor-pointer"
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          Mark as not completed
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleRemoveStudent}
          className="text-destructive cursor-pointer"
        >
          <UserMinus className="mr-2 h-4 w-4" />
          Remove from course
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
