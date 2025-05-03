import { JoinCourseDialog } from "@/components/dashboard/join-course-dialog";
import { EmptyState } from "@/components/empty-state";
import Heading from "@/components/heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem, type Course } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { BookOpenText, ExternalLink, Pencil, User } from "lucide-react";
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

export default function Dashboard(props: { courses: Course[] }) {
  const { courses } = props;
  console.log(courses);
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Courses" />
      <div className="flex h-full flex-1 flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <Heading
            title="Courses"
            description="View your courses and enroll in new ones."
          />

          <JoinCourseDialog />
        </div>
        <div>
          {courses.length === 0 ? (
            <EmptyState
              title="You're not enrolled in any courses"
              description="Enroll in a course to get started."
              icons={[BookOpenText, Pencil, User]}
              className="w-full"
            />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {courses.map((course) => (
                <CourseItem key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

function CourseItem({ course }: { course: Course }) {
  return (
    <div className="group border-border bg-card relative isolate flex flex-col overflow-hidden rounded-lg border transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg">
      <Link
        href={`/dashboard/courses/${course.id}`}
        className="relative h-56 w-full overflow-hidden"
      >
        {course.image ? (
          <>
            <img
              src={course.image}
              alt={course.title}
              className="h-full w-full object-cover brightness-[0.85] transition-all group-hover:scale-105 group-hover:brightness-100"
            />
            {/* Gradient overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
          </>
        ) : (
          <div
            className="h-full w-full"
            style={{
              backgroundColor: course.color || "#3b82f6",
              backgroundImage: `linear-gradient(135deg, 
                ${course.color || "#3b82f6"}99, 
                ${course.color || "#3b82f6"}EE
              )`,
            }}
          ></div>
        )}

        {/* Dark overlay for better text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

        {/* Title on image */}
        <div className="absolute right-0 bottom-0 left-0 p-4">
          <h3 className="text-xl font-bold text-white drop-shadow-md">
            {course.title}
          </h3>
          {course.category && (
            <Badge
              variant="outline"
              className="mt-2 border-white/20 bg-black/30 text-white"
            >
              {course.category}
            </Badge>
          )}
        </div>

        <div
          className="absolute inset-x-0 top-0 h-1.5"
          style={{ backgroundColor: course.color || "#3b82f6" }}
        />
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <p className="text-muted-foreground mb-4 line-clamp-2 text-sm">
          {course.description || "No description"}
        </p>

        {/* Course details */}
        <div className="text-muted-foreground mb-4 space-y-2 text-sm">
          {course.instructor && (
            <div className="flex items-center gap-2">
              <span className="font-medium">Instructor:</span>
              <div className="flex items-center gap-1.5">
                {course.instructor.avatar ? (
                  <img
                    src={course.instructor.avatar}
                    alt={course.instructor.name}
                    className="h-5 w-5 rounded-full object-cover"
                  />
                ) : (
                  <div className="bg-primary text-primary-foreground flex h-5 w-5 items-center justify-center rounded-full text-[10px]">
                    {course.instructor.name.charAt(0)}
                  </div>
                )}
                <span>{course.instructor.name}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-muted/20 border-t p-4">
        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link href={`/dashboard/courses/${course.id}`}>
            View Course <ExternalLink className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
