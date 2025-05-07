import AnnouncementsTab from "@/components/dashboard/course/announcements-tab";
import AssignmentsTab from "@/components/dashboard/course/assignments-tab";
import ContentTab from "@/components/dashboard/course/content-tab";
import DiscussionTab from "@/components/dashboard/course/discussion-tab";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppLayout from "@/layouts/app-layout";
import {
  Announcement,
  Assignment,
  BreadcrumbItem,
  Chapter,
  Course,
  CourseThread,
} from "@/types";
import { getInitials } from "@/utils/course-utils";
import { Head, Link } from "@inertiajs/react";
import {
  BookOpen,
  ExternalLink,
  FileText,
  Info,
  MessageSquare,
  Users,
} from "lucide-react";
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
    title: "Course Details",
    href: "#",
  },
];

interface CourseViewProps {
  course: Course;
  chapters: Chapter[];
  assignments: Assignment[];
  announcements: Announcement[];
  enrollmentCount: number;
  threads?: CourseThread[];
}

export default function CourseView(p: CourseViewProps) {
  const {
    course,
    chapters,
    assignments,
    announcements,
    enrollmentCount,
    threads,
  } = p;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`${course.title} Details`} />
      <div className="flex h-full flex-1 flex-col gap-4">
        <div className="container mx-auto">
          {/* Course Header */}
          <div
            className="relative mb-8 overflow-hidden rounded-xl bg-cover bg-center p-8 text-white"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.4)), url(${course.image})`,
              minHeight: "220px",
            }}
          >
            <div className="relative z-10 flex h-full flex-col justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="border-white/30 bg-white/20 text-white"
                  >
                    {course.code}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-white/30 bg-white/20 text-white"
                  >
                    {course.category}
                  </Badge>
                </div>
                <h2 className="mb-4 text-2xl font-bold md:text-3xl">
                  {course.title}
                </h2>
                <p className="mb-6 line-clamp-3 max-w-3xl text-white/80">
                  {course.description}
                </p>
              </div>

              <div className="mt-4 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border-2 border-white">
                    <AvatarImage
                      src={course.instructor?.avatar || undefined}
                      alt={course.instructor?.name}
                    />
                    <AvatarFallback>
                      {getInitials(course.instructor?.name || "")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">
                      {course.instructor?.name}
                    </p>
                    <p className="text-xs text-white/70">Instructor</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button size="sm" variant="secondary" className="gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <span className="hidden sm:inline">Discussion</span>
                  </Button>
                  <Button size="sm" variant="secondary" className="gap-2">
                    <Info className="h-4 w-4" />
                    <span className="hidden sm:inline">Course Info</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Responsive Info Cards (Chapters, Assignments, Students) */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-row items-center gap-3 border border-blue-600/20 bg-blue-50 p-4 dark:bg-blue-950/30">
              <BookOpen className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-muted-foreground text-sm">Chapters</p>
                <p className="text-lg font-medium">{chapters.length}</p>
              </div>
            </div>
            <div className="flex flex-row items-center gap-3 border border-green-600/20 bg-green-50 p-4 dark:bg-green-950/30">
              <FileText className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-muted-foreground text-sm">Assignments</p>
                <p className="text-lg font-medium">{assignments.length}</p>
              </div>
            </div>
            <Link
              href={route("dashboard.courses.students", course.id)}
              className="group flex flex-row items-center gap-3 border border-purple-600/20 bg-purple-50 p-4 transition-colors hover:bg-purple-100 dark:bg-purple-950/30 dark:hover:bg-purple-950/40"
            >
              <Users className="h-8 w-8 text-purple-500" />
              <div className="flex-grow">
                <p className="text-muted-foreground text-sm">Students</p>
                <p className="text-lg font-medium">{enrollmentCount}</p>
              </div>
              <ExternalLink className="h-4 w-4 text-purple-500 opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="bg-background mb-3 h-auto w-full flex-wrap p-0 shadow-xs sm:justify-start sm:-space-x-px">
              <TabsTrigger
                value="content"
                className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative w-full min-w-fit overflow-hidden rounded-none border px-4 py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e max-sm:justify-start sm:w-auto"
              >
                <BookOpen
                  className="-ms-0.5 me-1.5 opacity-60"
                  size={16}
                  aria-hidden="true"
                />
                Content
              </TabsTrigger>
              <TabsTrigger
                value="assignments"
                className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative w-full min-w-fit overflow-hidden rounded-none border px-4 py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e max-sm:justify-start sm:w-auto"
              >
                <FileText
                  className="-ms-0.5 me-1.5 opacity-60"
                  size={16}
                  aria-hidden="true"
                />
                Assignments
              </TabsTrigger>
              <TabsTrigger
                value="announcements"
                className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative w-full min-w-fit overflow-hidden rounded-none border px-4 py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e max-sm:justify-start sm:w-auto"
              >
                <Info
                  className="-ms-0.5 me-1.5 opacity-60"
                  size={16}
                  aria-hidden="true"
                />
                Announcements
              </TabsTrigger>
              <TabsTrigger
                value="discussion"
                className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative w-full min-w-fit overflow-hidden rounded-none border px-4 py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e max-sm:justify-start sm:w-auto"
              >
                <MessageSquare
                  className="-ms-0.5 me-1.5 opacity-60"
                  size={16}
                  aria-hidden="true"
                />
                Discussion
              </TabsTrigger>
            </TabsList>

            {/* Course Content Tab */}
            <TabsContent
              value="content"
              className="focus-visible:ring-0 focus-visible:outline-none"
            >
              <ContentTab
                course={course}
                chapters={chapters}
                assignments={assignments}
              />
            </TabsContent>

            {/* Assignments Tab */}
            <TabsContent
              value="assignments"
              className="focus-visible:ring-0 focus-visible:outline-none"
            >
              <AssignmentsTab assignments={assignments} />
            </TabsContent>

            {/* Announcements Tab */}
            <TabsContent
              value="announcements"
              className="focus-visible:ring-0 focus-visible:outline-none"
            >
              <AnnouncementsTab announcements={announcements} />
            </TabsContent>

            {/* Discussion Tab */}
            <TabsContent
              value="discussion"
              className="focus-visible:ring-0 focus-visible:outline-none"
            >
              <DiscussionTab threads={threads} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
}
