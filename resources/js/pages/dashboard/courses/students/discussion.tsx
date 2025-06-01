import CourseHeader from "@/components/dashboard/course-header";
import DiscussionTab from "@/components/dashboard/courses/discussion-tab";
import AppLayout from "@/layouts/app-layout";
import {
  BreadcrumbItem,
  Course,
  CourseThread,
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
    title: "Discussion",
    href: "#",
  },
];

interface CourseDiscussionProps extends SharedData {
  course: Course;
  threads?: CourseThread[];
  enrollmentCount: number;
  chaptersCount: number;
  assignmentsCount: number;
}

export default function CourseDiscussion(p: CourseDiscussionProps) {
  const {
    course,
    threads,
    enrollmentCount,
    chaptersCount,
    assignmentsCount,
  } = p;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`${course.title} - Discussion`} />
      <div className="flex h-full flex-1 flex-col gap-4">
        <div className="container mx-auto">
          <CourseHeader
            course={course}
            enrollmentCount={enrollmentCount}
            chaptersCount={chaptersCount}
            assignmentsCount={assignmentsCount}
            activeTab="discussion"
          />
          
          <DiscussionTab threads={threads} course={course} />
        </div>
      </div>
    </AppLayout>
  );
} 