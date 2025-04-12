import InstructorCourses from "@/components/dashboard/instructor-courses";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";
import { BookOpenText, Pencil, StarsIcon, User } from "lucide-react";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
  },
  {
    title: "Courses",
    href: "/dashboard/courses",
  },
];

export default function CoursesPage() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Courses" />
      <div className="flex h-full flex-1 flex-col gap-4 p-4">
        <InstructorCourses />
      </div>
    </AppLayout>
  );
}

const StatsCards = () => (
  <div className="border-border from-sidebar/60 to-sidebar grid grid-cols-2 rounded-xl border bg-gradient-to-br min-[1200px]:grid-cols-4">
    <div className="group before:from-input/30 before:via-input before:to-input/30 relative p-4 before:absolute before:inset-y-8 before:right-0 before:w-px before:bg-gradient-to-b last:before:hidden lg:p-5">
      <div className="relative flex items-center gap-4">
        <svg
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          width={20}
          height={20}
          fill="currentColor"
          aria-hidden="true"
          className="remixicon absolute top-0 right-0 text-emerald-500 opacity-0 transition-opacity group-has-[a:hover]:opacity-100"
        >
          <path d="M16.0037 9.41421L7.39712 18.0208L5.98291 16.6066L14.5895 8H7.00373V6H18.0037V17H16.0037V9.41421Z" />
        </svg>
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-emerald-600/50 bg-emerald-600/25 text-emerald-500 max-[480px]:hidden">
          <BookOpenText className="size-5" />
        </div>
        <div>
          <a
            href="#"
            className="text-muted-foreground/60 text-xs font-medium tracking-widest uppercase before:absolute before:inset-0"
          >
            Total Courses
          </a>
          <div className="mb-2 text-2xl font-semibold">24</div>
          <div className="text-muted-foreground/60 text-xs">
            <span className="font-medium text-emerald-500">↗ +3</span> vs last
            semester
          </div>
        </div>
      </div>
    </div>
    <div className="group before:from-input/30 before:via-input before:to-input/30 relative p-4 before:absolute before:inset-y-8 before:right-0 before:w-px before:bg-gradient-to-b last:before:hidden lg:p-5">
      <div className="relative flex items-center gap-4">
        <svg
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          width={20}
          height={20}
          fill="currentColor"
          aria-hidden="true"
          className="remixicon absolute top-0 right-0 text-emerald-500 opacity-0 transition-opacity group-has-[a:hover]:opacity-100"
        >
          <path d="M16.0037 9.41421L7.39712 18.0208L5.98291 16.6066L14.5895 8H7.00373V6H18.0037V17H16.0037V9.41421Z" />
        </svg>
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-emerald-600/50 bg-emerald-600/25 text-emerald-500 max-[480px]:hidden">
          <Pencil className="size-5" />
        </div>
        <div>
          <a
            href="#"
            className="text-muted-foreground/60 text-xs font-medium tracking-widest uppercase before:absolute before:inset-0"
          >
            Assignments
          </a>
          <div className="mb-2 text-2xl font-semibold">47</div>
          <div className="text-muted-foreground/60 text-xs">
            <span className="font-medium text-emerald-500">↗ +12</span> vs last
            month
          </div>
        </div>
      </div>
    </div>
    <div className="group before:from-input/30 before:via-input before:to-input/30 relative p-4 before:absolute before:inset-y-8 before:right-0 before:w-px before:bg-gradient-to-b last:before:hidden lg:p-5">
      <div className="relative flex items-center gap-4">
        <svg
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          width={20}
          height={20}
          fill="currentColor"
          aria-hidden="true"
          className="remixicon absolute top-0 right-0 text-emerald-500 opacity-0 transition-opacity group-has-[a:hover]:opacity-100"
        >
          <path d="M16.0037 9.41421L7.39712 18.0208L5.98291 16.6066L14.5895 8H7.00373V6H18.0037V17H16.0037V9.41421Z" />
        </svg>
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-emerald-600/50 bg-emerald-600/25 text-emerald-500 max-[480px]:hidden">
          <User className="size-5" />
        </div>
        <div>
          <a
            href="#"
            className="text-muted-foreground/60 text-xs font-medium tracking-widest uppercase before:absolute before:inset-0"
          >
            Students
          </a>
          <div className="mb-2 text-2xl font-semibold">183</div>
          <div className="text-muted-foreground/60 text-xs">
            <span className="font-medium text-emerald-500">↗ +8%</span> vs last
            semester
          </div>
        </div>
      </div>
    </div>
    <div className="group before:from-input/30 before:via-input before:to-input/30 relative p-4 before:absolute before:inset-y-8 before:right-0 before:w-px before:bg-gradient-to-b last:before:hidden lg:p-5">
      <div className="relative flex items-center gap-4">
        <svg
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          width={20}
          height={20}
          fill="currentColor"
          aria-hidden="true"
          className="remixicon absolute top-0 right-0 text-emerald-500 opacity-0 transition-opacity group-has-[a:hover]:opacity-100"
        >
          <path d="M16.0037 9.41421L7.39712 18.0208L5.98291 16.6066L14.5895 8H7.00373V6H18.0037V17H16.0037V9.41421Z" />
        </svg>
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-emerald-600/50 bg-emerald-600/25 text-emerald-500 max-[480px]:hidden">
          <StarsIcon className="size-5" />
        </div>
        <div>
          <a
            href="#"
            className="text-muted-foreground/60 text-xs font-medium tracking-widest uppercase before:absolute before:inset-0"
          >
            Avg. Rating
          </a>
          <div className="mb-2 text-2xl font-semibold">4.7</div>
          <div className="text-muted-foreground/60 text-xs">
            <span className="font-medium text-emerald-500">↗ +0.3</span> vs
            last semester
          </div>
        </div>
      </div>
    </div>
  </div>
);
