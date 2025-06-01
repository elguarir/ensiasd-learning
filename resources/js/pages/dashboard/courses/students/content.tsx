import CourseHeader from "@/components/dashboard/course-header";
import ContentTab from "@/components/dashboard/courses/content-tab";
import AppLayout from "@/layouts/app-layout";
import {
  Assignment,
  BreadcrumbItem,
  Chapter,
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
    title: "Course Content",
    href: "#",
  },
];

interface CourseContentProps extends SharedData {
  course: Course;
  chapters: Chapter[];
  assignments: Assignment[];
  enrollmentCount: number;
  chaptersCount: number;
  assignmentsCount: number;
}

export default function CourseContent(p: CourseContentProps) {
  const {
    course,
    chapters,
    assignments,
    enrollmentCount,
    chaptersCount,
    assignmentsCount,
  } = p;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`${course.title}`} />
      <div className="flex h-full flex-1 flex-col gap-4">
        <div className="container mx-auto">
          <CourseHeader
            course={course}
            enrollmentCount={enrollmentCount}
            chaptersCount={chaptersCount}
            assignmentsCount={assignmentsCount}
            activeTab="content"
          />
          
          <ContentTab
            course={course}
            chapters={chapters}
            assignments={assignments}
          />
        </div>
      </div>
    </AppLayout>
  );
} 