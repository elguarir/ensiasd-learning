import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Course } from "@/types";
import { getInitials } from "@/utils/course-utils";
import { Link } from "@inertiajs/react";
import { BookOpen, FileText, Info, MessageSquare, Users } from "lucide-react";
import { useEffect, useState } from "react";

interface CourseHeaderProps {
  course: Course;
  enrollmentCount: number;
  chaptersCount?: number;
  assignmentsCount?: number;
  activeTab?: "content" | "assignments" | "announcements" | "discussion";
}

export default function CourseHeader({
  course,
  enrollmentCount,
  chaptersCount = 0,
  assignmentsCount = 0,
  activeTab = "content",
}: CourseHeaderProps) {
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  const getTabHref = (tab: string) => {
    switch (tab) {
      case "content":
        return route("dashboard.courses.show", course.id);
      case "assignments":
        return route("dashboard.courses.assignments", course.id);
      case "announcements":
        return route("dashboard.courses.announcements", course.id);
      case "discussion":
        return route("dashboard.courses.discussion", course.id);
      default:
        return route("dashboard.courses.show", course.id);
    }
  };

  const isTabActive = (tab: string) => {
    const path = currentPath;
    switch (tab) {
      case "content":
        return path.endsWith(`/courses/${course.id}`);
      case "assignments":
        return path.includes("/assignments");
      case "announcements":
        return path.includes("/announcements");
      case "discussion":
        return path.includes("/discussion");
      default:
        return false;
    }
  };

  return (
    <>
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
              <Button size="sm" variant="secondary" className="gap-2" asChild>
                <Link href={route("dashboard.courses.discussion", course.id)}>
                  <MessageSquare className="h-4 w-4" />
                  <span className="hidden sm:inline">Discussion</span>
                </Link>
              </Button>
              <Button size="sm" variant="secondary" className="gap-2">
                <Info className="h-4 w-4" />
                <span className="hidden sm:inline">Course Info</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive Info Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-row items-center gap-3 border border-blue-600/20 bg-blue-50 p-4 dark:bg-blue-950/30">
          <BookOpen className="h-8 w-8 text-blue-500" />
          <div>
            <p className="text-muted-foreground text-sm">Chapters</p>
            <p className="text-lg font-medium">{chaptersCount}</p>
          </div>
        </div>
        <div className="flex flex-row items-center gap-3 border border-green-600/20 bg-green-50 p-4 dark:bg-green-950/30">
          <FileText className="h-8 w-8 text-green-500" />
          <div>
            <p className="text-muted-foreground text-sm">Assignments</p>
            <p className="text-lg font-medium">{assignmentsCount}</p>
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
        </Link>
      </div>

      {/* Navigation Tabs */}
      <Tabs value={activeTab} className="w-full">
        <TabsList className="bg-background mb-3 h-auto w-full flex-wrap p-0 shadow-xs sm:justify-start sm:-space-x-px">
          <TabsTrigger
            value="content"
            className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative w-full min-w-fit overflow-hidden rounded-none border px-4 py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e max-sm:justify-start sm:w-auto"
            asChild
          >
            <Link href={getTabHref("content")}>
              <BookOpen
                className="-ms-0.5 me-1.5 opacity-60"
                size={16}
                aria-hidden="true"
              />
              Content
            </Link>
          </TabsTrigger>
          <TabsTrigger
            value="assignments"
            className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative w-full min-w-fit overflow-hidden rounded-none border px-4 py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e max-sm:justify-start sm:w-auto"
            asChild
          >
            <Link href={getTabHref("assignments")}>
              <FileText
                className="-ms-0.5 me-1.5 opacity-60"
                size={16}
                aria-hidden="true"
              />
              Assignments
            </Link>
          </TabsTrigger>
          <TabsTrigger
            value="announcements"
            className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative w-full min-w-fit overflow-hidden rounded-none border px-4 py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e max-sm:justify-start sm:w-auto"
            asChild
          >
            <Link href={getTabHref("announcements")}>
              <Info
                className="-ms-0.5 me-1.5 opacity-60"
                size={16}
                aria-hidden="true"
              />
              Announcements
            </Link>
          </TabsTrigger>
          <TabsTrigger
            value="discussion"
            className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative w-full min-w-fit overflow-hidden rounded-none border px-4 py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e max-sm:justify-start sm:w-auto"
            asChild
          >
            <Link href={getTabHref("discussion")}>
              <MessageSquare
                className="-ms-0.5 me-1.5 opacity-60"
                size={16}
                aria-hidden="true"
              />
              Discussion
            </Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </>
  );
} 