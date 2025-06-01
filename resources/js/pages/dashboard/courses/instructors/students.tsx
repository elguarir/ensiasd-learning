import { EmptyState } from "@/components/empty-state";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, Course } from "@/types";
import { Head, router } from "@inertiajs/react";
import { formatDistance } from "date-fns";
import {
  ArrowLeftIcon,
  CalendarIcon,
  MailIcon,
  SearchIcon,
  UserIcon,
} from "lucide-react";
import { useState } from "react";
import StudentActions from "./components/student-actions";

type Student = {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  username: string;
  enrolled_at: string;
  enrollment_id: number;
};

interface StudentsPageProps {
  auth: {
    user: {
      id: number;
      name: string;
      email: string;
      avatar?: string;
    };
  };
  course: Course;
  students: Student[];
}

export default function Students({
  auth,
  course,
  students,
}: StudentsPageProps) {
  const [searchTerm, setSearchTerm] = useState("");

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
      title: "Students",
      href: route("dashboard.courses.students", course.id),
    },
  ];

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.username.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`${course.title} Students`} />
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <h1 className="text-2xl font-bold">Students</h1>
          <div className="flex w-full items-center gap-2 md:w-auto">
            <div className="relative w-full md:w-auto">
              <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
              <Input
                type="text"
                placeholder="Search students..."
                className="w-full pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              onClick={() =>
                router.visit(route("dashboard.courses.show", course.id))
              }
              variant="outline"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back to Course
            </Button>
          </div>
        </div>

        {students.length === 0 ? (
          <EmptyState
            title="No students enrolled"
            description="There are no students enrolled in this course yet."
            icons={[UserIcon]}
          />
        ) : filteredStudents.length === 0 ? (
          <EmptyState
            title="No matches found"
            description="No students match your search criteria. Try adjusting your search."
            icons={[SearchIcon]}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredStudents.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                courseId={course.id}
              />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

interface StudentCardProps {
  student: Student;
  courseId: number;
}

function StudentCard({ student, courseId }: StudentCardProps) {
  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <CardHeader className="pb-0">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={student.avatar || ""} alt={student.name} />
              <AvatarFallback>
                {student.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col -space-y-px">
              <h3 className="line-clamp-1 font-medium">{student.name}</h3>
              <p className="text-muted-foreground text-sm">
                @{student.username}
              </p>
            </div>
          </div>
          <StudentActions
            courseId={courseId}
            student={student}
            enrollmentId={student.enrollment_id}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-muted-foreground flex items-center gap-1 text-sm">
          <MailIcon className="h-3.5 w-3.5" />
          <span>{student.email}</span>
        </div>
        <div className="text-muted-foreground flex items-center gap-1 text-sm">
          <CalendarIcon className="h-3.5 w-3.5" />
          <span>
            Enrolled{" "}
            {formatDistance(new Date(student.enrolled_at), new Date(), {
              addSuffix: true,
            })}
          </span>
        </div>
      </CardContent>
      <CardFooter className="mt-auto pt-0">
        <Badge variant="outline" className="mt-2">
          Student
        </Badge>
      </CardFooter>
    </Card>
  );
}
