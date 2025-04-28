import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppLayout from "@/layouts/app-layout";
import { Assignment, BreadcrumbItem, Chapter, Course, Resource } from "@/types";
import {
  formatDate,
  formatRelativeTime,
  getAssignmentStatus,
  getInitials,
  ResourceIcon,
} from "@/utils/course-utils";
import { Head } from "@inertiajs/react";
import {
  AlertCircle,
  BookOpen,
  Calendar,
  CalendarClock,
  CheckCircle2,
  Clock,
  FileText,
  Info,
  MessageSquare,
  Send,
  User,
  Users,
} from "lucide-react";
import { useState } from "react";

// Define Announcement interface locally since it's not exported from @/types
interface Announcement {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
  comments?: AnnouncementComment[];
}

interface AnnouncementComment {
  id: number;
  user_name: string;
  user_avatar?: string;
  content: string;
  created_at: string;
}

// Mock data for the component
const mockCourse: Course = {
  id: 1,
  instructor_id: 1,
  code: "CS101",
  title: "Introduction to Computer Science",
  description:
    "Learn the fundamentals of computer science including algorithms, data structures, and programming basics.",
  image:
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop",
  color: "#4f46e5",
  category: "Computer Science",
  status: "published",
  published_at: "2023-01-15T00:00:00.000Z",
  created_at: "2023-01-01T00:00:00.000Z",
  updated_at: "2023-01-01T00:00:00.000Z",
  instructor: {
    id: 1,
    name: "Prof. Jane Smith",
    username: "jsmith",
    email: "jane.smith@example.com",
    avatar: "https://i.pravatar.cc/150?u=jsmith",
    role: "instructor",
    email_verified_at: "2022-12-01T00:00:00.000Z",
    created_at: "2022-12-01T00:00:00.000Z",
    updated_at: "2022-12-01T00:00:00.000Z",
  },
};

const mockChapters: Chapter[] = [
  {
    id: 1,
    course_id: 1,
    title: "Introduction to Algorithms",
    description:
      "Learn the basics of algorithms and their importance in computer science.",
    position: 1,
    created_at: "2023-01-05T00:00:00.000Z",
    updated_at: "2023-01-05T00:00:00.000Z",
    resources: [
      {
        id: 1,
        chapter_id: 1,
        title: "Algorithm Basics",
        description: "Introduction to algorithm concepts",
        resource_type: "document",
        position: 1,
        metadata: null,
        created_at: "2023-01-06T00:00:00.000Z",
        updated_at: "2023-01-06T00:00:00.000Z",
      },
      {
        id: 2,
        chapter_id: 1,
        title: "Big O Notation",
        description: "Understanding time and space complexity",
        resource_type: "video",
        position: 2,
        metadata: null,
        created_at: "2023-01-07T00:00:00.000Z",
        updated_at: "2023-01-07T00:00:00.000Z",
      },
    ],
  },
  {
    id: 2,
    course_id: 1,
    title: "Data Structures",
    description:
      "Understanding different data structures and their applications.",
    position: 2,
    created_at: "2023-01-12T00:00:00.000Z",
    updated_at: "2023-01-12T00:00:00.000Z",
    resources: [
      {
        id: 3,
        chapter_id: 2,
        title: "Arrays and Linked Lists",
        description: "Understanding fundamental data structures",
        resource_type: "document",
        position: 1,
        metadata: null,
        created_at: "2023-01-13T00:00:00.000Z",
        updated_at: "2023-01-13T00:00:00.000Z",
      },
    ],
  },
];

const mockAssignments: Assignment[] = [
  {
    id: 1,
    course_id: 1,
    chapter_id: 1,
    title: "Algorithm Implementation",
    description: "Implement a sorting algorithm of your choice",
    type: "file",
    due_date: "2023-03-15T23:59:59.000Z",
    points_possible: 20,
    published: true,
    created_at: "2023-01-20T00:00:00.000Z",
    updated_at: "2023-01-20T00:00:00.000Z",
  },
  {
    id: 2,
    course_id: 1,
    chapter_id: 2,
    title: "Data Structures Quiz",
    description: "Test your knowledge on various data structures",
    type: "quiz",
    due_date: "2023-03-30T23:59:59.000Z",
    points_possible: 15,
    published: true,
    created_at: "2023-01-25T00:00:00.000Z",
    updated_at: "2023-01-25T00:00:00.000Z",
  },
];

const mockAnnouncements: Announcement[] = [
  {
    id: 1,
    content:
      "Welcome to the course! Please review the syllabus and upcoming assignments. We'll be covering a lot of interesting topics this semester and I'm looking forward to an engaging class with all of you.",
    created_at: "2023-01-16T00:00:00.000Z",
    updated_at: "2023-01-16T00:00:00.000Z",
    comments: [
      {
        id: 1,
        user_name: "Alice Johnson",
        user_avatar: "https://i.pravatar.cc/150?u=alice",
        content:
          "Looking forward to the course! Will the syllabus be available on the course page?",
        created_at: "2023-01-16T08:30:00.000Z",
      },
      {
        id: 2,
        user_name: "Prof. Jane Smith",
        user_avatar: "https://i.pravatar.cc/150?u=jsmith",
        content:
          "Yes, the syllabus is now available under the 'Content' tab. Let me know if you have any questions!",
        created_at: "2023-01-16T10:15:00.000Z",
      },
    ],
  },
  {
    id: 2,
    content:
      "Office hours will be held on Wednesdays from 2-4pm in Room 302. Feel free to drop by with any questions about course material or assignments. If you can't make it during these hours, please email me to schedule an appointment.",
    created_at: "2023-01-18T00:00:00.000Z",
    updated_at: "2023-01-18T00:00:00.000Z",
    comments: [],
  },
];

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
    title: "Course View",
    href: "#",
  },
];

export default function CourseView({
  course: propCourse,
}: {
  course?: Course;
}) {
  // Use provided course or fallback to mock data
  const course = propCourse || mockCourse;
  const chapters = mockChapters;
  const assignments = mockAssignments;
  const announcements = mockAnnouncements;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`${course.title} | Course View`} />
      <div className="flex h-full flex-1 flex-col gap-6 p-6">
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
                <p className="mb-6 max-w-3xl text-white/80">
                  {course.description}
                </p>
              </div>

              <div className="mt-4 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border-2 border-white">
                    <AvatarImage
                      src={course.instructor?.avatar}
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
            <div className="flex flex-row items-center gap-3 p-4 rounded-lg border-[1.5px] border-blue-600/20 bg-blue-50 dark:bg-blue-950/30">
              <BookOpen className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-muted-foreground text-sm">Chapters</p>
                <p className="font-medium text-lg">{chapters.length}</p>
              </div>
            </div>
            <div className="flex flex-row items-center gap-3 p-4 rounded-lg border-[1.5px] border-green-600/20 bg-green-50 dark:bg-green-950/30">
              <FileText className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-muted-foreground text-sm">Assignments</p>
                <p className="font-medium text-lg">{assignments.length}</p>
              </div>
            </div>
            <div className="flex flex-row items-center gap-3 p-4 rounded-lg border-[1.5px] border-purple-600/20 bg-purple-50 dark:bg-purple-950/30">
              <Users className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-muted-foreground text-sm">Students</p>
                <p className="font-medium text-lg">32</p> {/* Mock data */}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="bg-background mb-3 h-auto -space-x-px p-0 shadow-xs rtl:space-x-reverse">
              <TabsTrigger
                value="content"
                className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border px-4 py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e"
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
                className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border px-4 py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e"
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
                className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border px-4 py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e"
              >
                <Info
                  className="-ms-0.5 me-1.5 opacity-60"
                  size={16}
                  aria-hidden="true"
                />
                Announcements
              </TabsTrigger>
            </TabsList>

            {/* Course Content Tab */}
            <TabsContent
              value="content"
              className="focus-visible:ring-0 focus-visible:outline-none"
            >
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <h2 className="mb-6 text-xl font-bold">Course Content</h2>
                  <Accordion type="multiple" className="w-full border">
                    {chapters.map((chapter) => (
                      <ChapterItem key={chapter.id} chapter={chapter} />
                    ))}
                  </Accordion>
                </div>

                <div className="space-y-8 lg:col-span-1">
                  <UpcomingDeadlinesCard assignments={assignments} />
                  <CourseInfoCard course={course} />
                </div>
              </div>
            </TabsContent>

            {/* Assignments Tab */}
            <TabsContent
              value="assignments"
              className="focus-visible:ring-0 focus-visible:outline-none"
            >
              <div className="grid grid-cols-1 gap-6">
                <h2 className="mb-6 text-xl font-bold">Assignments</h2>

                <div className="space-y-6">
                  {assignments.map((assignment) => (
                    <AssignmentCard
                      key={assignment.id}
                      assignment={assignment}
                    />
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Announcements Tab */}
            <TabsContent
              value="announcements"
              className="focus-visible:ring-0 focus-visible:outline-none"
            >
              <div className="grid grid-cols-1 gap-8">
                <h2 className="mb-6 text-xl font-bold">Announcements</h2>
                <div className="space-y-8">
                  {announcements.map((announcement) => (
                    <AnnouncementCard
                      key={announcement.id}
                      announcement={announcement}
                      instructor={course.instructor}
                    />
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
}

function ChapterItem({ chapter }: { chapter: Chapter }) {
  return (
    <AccordionItem
      key={chapter.id}
      value={`chapter-${chapter.id}`}
      className="rounded-lg"
    >
      <AccordionTrigger className="rounded-t-lg px-6 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 hover:no-underline">
        <div className="flex flex-col items-start text-left">
          <span className="text-lg font-medium">{chapter.title}</span>
          <span className="text-muted-foreground text-sm">
            {chapter.resources?.length || 0} resources
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-6 pt-2 pb-6">
        {chapter.description && (
          <p className="text-muted-foreground mb-6">{chapter.description}</p>
        )}
        <div className="space-y-4">
          {chapter.resources?.map((resource) => (
            <ResourceItem key={resource.id} resource={resource} />
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

function ResourceItem({ resource }: { resource: Resource }) {
  return (
    <div
      key={resource.id}
      className="flex items-center gap-4 rounded-lg border border-neutral-200 p-4 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900/50"
    >
      <ResourceIcon type={resource.resource_type} />
      <div className="flex-1">
        <p className="font-medium">{resource.title}</p>
        {resource.description && (
          <p className="text-muted-foreground text-sm">
            {resource.description}
          </p>
        )}
      </div>
      <Button variant="outline" size="sm">
        View
      </Button>
    </div>
  );
}

function UpcomingDeadlinesCard({ assignments }: { assignments: Assignment[] }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Upcoming Deadlines</CardTitle>
        <CardDescription>Stay on top of your assignments</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-2">
        {assignments.map((assignment) => {
          const { status, color, bgColor } = getAssignmentStatus(assignment);
          return (
            <div
              key={assignment.id}
              className={`flex items-start gap-3 rounded-lg border border-neutral-200 p-4 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900/50 ${bgColor}`}
            >
              {assignment.type === "quiz" ? (
                <div className="rounded-md bg-blue-100 p-2.5 dark:bg-blue-900">
                  <FileText className="h-4 w-4 text-blue-500 dark:text-blue-300" />
                </div>
              ) : (
                <div className="rounded-md bg-green-100 p-2.5 dark:bg-green-900">
                  <FileText className="h-4 w-4 text-green-500 dark:text-green-300" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{assignment.title}</p>
                <div className="mt-1.5 flex items-center gap-1">
                  <Clock className="text-muted-foreground h-3.5 w-3.5" />
                  <span className="text-muted-foreground text-xs">
                    {assignment.due_date
                      ? formatDate(assignment.due_date)
                      : "No deadline"}
                  </span>
                </div>
              </div>
              <div
                className={`rounded-full px-2 py-1 text-xs font-medium text-white ${color}`}
              >
                {status}
              </div>
            </div>
          );
        })}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          View All Assignments
        </Button>
      </CardFooter>
    </Card>
  );
}

function CourseInfoCard({ course }: { course: Course }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 pt-2">
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

function AssignmentCard({ assignment }: { assignment: Assignment }) {
  const { status, color } = getAssignmentStatus(assignment);
  return (
    <div
      key={assignment.id}
      className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-card shadow-sm p-0 flex flex-col overflow-hidden transition hover:shadow-md"
    >
      {/* Header Row */}
      <div className="flex items-center gap-4 px-6 pt-6 pb-2">
        <div
          className={`flex items-center justify-center rounded-lg p-2.5 ${assignment.type === "quiz" ? "bg-blue-100 dark:bg-blue-900" : "bg-green-100 dark:bg-green-900"}`}
        >
          {assignment.type === "quiz" ? (
            <FileText className="h-6 w-6 text-blue-500 dark:text-blue-300" />
          ) : (
            <FileText className="h-6 w-6 text-green-500 dark:text-green-300" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold truncate">{assignment.title}</h3>
        </div>
        <Badge className={color}>{status}</Badge>
      </div>

      {/* Meta Row */}
      <div className="flex flex-wrap items-center gap-4 px-6 pt-2 pb-1 text-sm text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <CalendarClock className="h-4 w-4" />
          <span>
            {assignment.due_date ? `Due ${formatDate(assignment.due_date)}` : "No deadline"}
          </span>
        </div>
        <span className="hidden sm:inline">•</span>
        <div className="flex items-center gap-1.5">
          <span>Points:</span>
          <span className="font-medium text-foreground">{assignment.points_possible}</span>
        </div>
        <span className="hidden sm:inline">•</span>
        <div className="flex items-center gap-1.5">
          <span>Type:</span>
          <span className="capitalize font-medium text-foreground">
            {assignment.type === "quiz" ? "Quiz" : "File Submission"}
          </span>
        </div>
      </div>

      {/* Description */}
      {assignment.description && (
        <div className="px-6 pt-2 pb-2">
          <p className="text-muted-foreground text-sm leading-relaxed">
            {assignment.description}
          </p>
        </div>
      )}

      {/* Action Button */}
      <div className="px-6 pt-2 pb-6 mt-auto flex">
        <Button className="w-full sm:w-auto sm:ml-auto">Start Assignment</Button>
      </div>
    </div>
  );
}

function AnnouncementCard({
  announcement,
  instructor,
}: {
  announcement: Announcement;
  instructor?: Course["instructor"];
}) {
  const [comment, setComment] = useState("");

  const handlePostComment = () => {
    if (!comment.trim()) return;
    alert(`Comment posted: ${comment}`);
    setComment("");
  };

  return (
    <Card className="overflow-hidden py-0">
      <div className="border-l-[6px] border-blue-500 pt-4 dark:border-blue-400">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={instructor?.avatar} alt={instructor?.name} />
              <AvatarFallback>
                {getInitials(instructor?.name || "")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="mb-0.5 text-base font-medium">{instructor?.name}</p>
              <p className="text-muted-foreground text-xs">
                Posted {formatRelativeTime(announcement.created_at)}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="py-4">
          <p className="text-base leading-relaxed whitespace-pre-line">
            {announcement.content}
          </p>
        </CardContent>

        {/* Comments section */}
        <div className="border-t border-neutral-200 dark:border-neutral-800">
          <div className="bg-neutral-50 p-4 dark:bg-neutral-900/30">
            <h4 className="mb-3 flex items-center gap-1.5 text-sm font-medium">
              <MessageSquare className="h-4 w-4" />
              Comments ({announcement.comments?.length || 0})
            </h4>

            {announcement.comments && announcement.comments.length > 0 ? (
              <div className="mb-4 space-y-4">
                {announcement.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={comment.user_avatar}
                        alt={comment.user_name}
                      />
                      <AvatarFallback>
                        {getInitials(comment.user_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 rounded-lg bg-white p-3 shadow-sm dark:bg-neutral-800">
                      <div className="mb-1 flex items-center justify-between">
                        <p className="text-sm font-medium">
                          {comment.user_name}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {formatRelativeTime(comment.created_at)}
                        </p>
                      </div>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground mb-4 text-sm">
                No comments yet. Be the first to comment!
              </p>
            )}

            {/* Add comment form */}
            <div className="mt-4 flex w-full max-w-full gap-4">
              <Avatar className="h-10 w-10">
                <AvatarFallback>ST</AvatarFallback>
              </Avatar>
              <div className="flex flex-1 gap-2">
                <div className="flex-1">
                  <Input
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="h-10"
                  />
                </div>
                <Button
                  onClick={handlePostComment}
                  size="icon"
                  className="h-10 w-10"
                  variant="secondary"
                  disabled={!comment.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
