import CourseHeader from "@/components/dashboard/course-header";
import AssignmentsTab from "@/components/dashboard/courses/assignments-tab";
import AppLayout from "@/layouts/app-layout";
import {
  Assignment,
  BreadcrumbItem,
  Course,
  SharedData,
} from "@/types";
import { Head } from "@inertiajs/react";

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
    title: "Assignments",
    href: "#",
  },
];

interface CourseAssignmentsProps extends SharedData {
  course: Course;
  assignments: Assignment[];
  enrollmentCount: number;
  chaptersCount: number;
  assignmentsCount: number;
}

export default function CourseAssignments(p: CourseAssignmentsProps) {
  const {
    course,
    assignments,
    enrollmentCount,
    chaptersCount,
    assignmentsCount,
  } = p;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`${course.title} - Assignments`} />
      <div className="flex h-full flex-1 flex-col gap-4">
        <div className="container mx-auto">
          <CourseHeader
            course={course}
            enrollmentCount={enrollmentCount}
            chaptersCount={chaptersCount}
            assignmentsCount={assignmentsCount}
            activeTab="assignments"
          />
          
          <AssignmentsTab assignments={assignments} course={course} />
        </div>
      </div>
    </AppLayout>
  );
} 