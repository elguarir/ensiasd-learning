import { Button } from "@/components/ui/button";
import AppLayout from "@/layouts/app-layout";
import { Assignment, BreadcrumbItem, Course, Submission } from "@/types";
import { getAssignmentStatus } from "@/utils/course-utils";
import { Head, Link } from "@inertiajs/react";

interface StudentsPageProps {
  course: Course;
  assignment: Assignment;
  submission: Submission;
}

export default function AssignmentDetails({
  course,
  assignment,
  submission,
}: StudentsPageProps) {
  const { status, type } = getAssignmentStatus(assignment);

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
      title: "Assignment Details",
      href: "#",
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Assignment Details`} />
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <h1 className="text-2xl font-bold">Assignment Details</h1>
          <div className="flex w-full items-center gap-2 md:w-auto">
            <Button variant="outline" asChild>
              <Link href={route("dashboard.courses.show", course.id)}>
                Back to Assignments
              </Link>
            </Button>
          </div>
        </div>
        <div>
          
        </div>
      </div>
    </AppLayout>
  );
}
