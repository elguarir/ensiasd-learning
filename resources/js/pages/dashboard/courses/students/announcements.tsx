import CourseHeader from "@/components/dashboard/course-header";
import AnnouncementsTab from "@/components/dashboard/courses/announcements-tab";
import AppLayout from "@/layouts/app-layout";
import {
  Announcement,
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
    title: "Announcements",
    href: "#",
  },
];

interface CourseAnnouncementsProps extends SharedData {
  course: Course;
  announcements: Announcement[];
  enrollmentCount: number;
  chaptersCount: number;
  assignmentsCount: number;
}

export default function CourseAnnouncements(p: CourseAnnouncementsProps) {
  const {
    course,
    announcements,
    enrollmentCount,
    chaptersCount,
    assignmentsCount,
  } = p;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`${course.title} - Announcements`} />
      <div className="flex h-full flex-1 flex-col gap-4">
        <div className="container mx-auto">
          <CourseHeader
            course={course}
            enrollmentCount={enrollmentCount}
            chaptersCount={chaptersCount}
            assignmentsCount={assignmentsCount}
            activeTab="announcements"
          />
          
          <AnnouncementsTab announcements={announcements} course={course} />
        </div>
      </div>
    </AppLayout>
  );
} 