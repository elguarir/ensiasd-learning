import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Course } from "@/types";
import { formatDate } from "@/utils/course-utils";
import { Calendar, CheckCircle2, User } from "lucide-react";

export function CourseInfoCard({ course }: { course: Course }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex items-center gap-4">
          <div className="rounded-md bg-blue-100 p-2.5 dark:bg-blue-900">
            <Calendar className="h-4 w-4 text-blue-500 dark:text-blue-300" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Enrolled at</p>
            <p className="font-medium">
              {formatDate(course.published_at || course.created_at)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="rounded-md bg-purple-100 p-2.5 dark:bg-purple-900">
            <User className="h-4 w-4 text-purple-500 dark:text-purple-300" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Instructor</p>
            <p className="font-medium">{course.instructor?.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="rounded-md bg-green-100 p-2.5 dark:bg-green-900">
            <CheckCircle2 className="h-4 w-4 text-green-500 dark:text-green-300" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Course Status</p>
            <p className="font-medium capitalize">{course.status}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
