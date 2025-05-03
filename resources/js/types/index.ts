import { LucideIcon } from "lucide-react";

export interface Auth {
  user: User;
}

export interface BreadcrumbItem {
  title: string;
  href: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon | null;
  isActive?: boolean;
}

export interface SharedData {
  name: string;
  quote: { message: string; author: string };
  auth: Auth;
  [key: string]: unknown;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  avatar?: string;
  role?: "student" | "instructor" | "admin";
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  [key: string]: unknown;
}
export interface Course {
  id: number;
  instructor_id: number;
  code: string;
  title: string;
  description: string;
  image: string;
  color: string;
  category: string;
  status: "draft" | "published" | "archived";
  published_at: string | null;
  created_at: string;
  updated_at: string;
  instructor?: User;
  chapters?: Chapter[];
  enrollments?: CourseEnrollment[];
  students?: User[];
  threads?: CourseThread[];
  assignments?: Assignment[];
}

export interface Assignment {
  id: number;
  course_id: number;
  chapter_id?: number | null;
  title: string;
  description: string | null;
  type: "file" | "quiz";
  due_date: string | null;
  points_possible: number;
  published: boolean;
  created_at: string;
  updated_at: string;
  course?: Course;
  chapter?: Chapter | null;
  submissions?: Submission[];
  quiz_questions?: QuizQuestion[];
  attachments?: Attachment[];
}

export interface Submission {
  id: number;
  assignment_id: number;
  user_id: number;
  submitted_at: string | null;
  is_late: boolean;
  status: "draft" | "submitted" | "graded";
  grade: number | null;
  feedback: string | null;
  created_at: string;
  updated_at: string;
  assignment?: Assignment;
  user?: User;
  attachments?: Attachment[];
  quiz_answers?: QuizAnswer[];
}

export interface QuizQuestion {
  id: number;
  assignment_id: number;
  question_text: string;
  position: number;
  points: number;
  created_at: string;
  updated_at: string;
  assignment?: Assignment;
  options?: QuizOption[];
  answers?: QuizAnswer[];
}

export interface QuizOption {
  id: number;
  quiz_question_id: number;
  option_text: string;
  is_correct: boolean;
  created_at: string;
  updated_at: string;
  question?: QuizQuestion;
}

export interface QuizAnswer {
  id: number;
  submission_id: number;
  quiz_question_id: number;
  quiz_option_id: number;
  created_at: string;
  updated_at: string;
  submission?: Submission;
  question?: QuizQuestion;
  selected_option?: QuizOption;
}

export interface Attachment {
  id: number;
  original_filename: string;
  path: string;
  filename: string;
  mime_type: string;
  size: number;
  extension: string | null;
  attachable_id: number;
  attachable_type: string;
  collection: string;
  is_private: boolean;
  metadata: Record<string, any> | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  url?: string;
}

export interface Chapter {
  id: number;
  course_id: number;
  title: string;
  description: string | null;
  position: number;
  created_at: string;
  updated_at: string;
  course?: Course;
  resources?: Resource[];
  assignments?: Assignment[];
}

export interface CourseEnrollment {
  id: number;
  course_id: number;
  user_id: number;
  enrolled_at: string;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  course?: Course;
  user?: User;
}

export interface CourseThread {
  id: number;
  course_id: number;
  author_id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  course?: Course;
  author?: User;
  comments?: ThreadComment[];
}

export interface ThreadComment {
  id: number;
  thread_id: number;
  author_id: number;
  content: string;
  created_at: string;
  updated_at: string;
  thread?: CourseThread;
  author?: User;
}

export interface Resource {
  id: number;
  chapter_id: number;
  title: string;
  description: string | null;
  resource_type: string;
  position: number;
  metadata: Record<string, any> | null;
  created_at: string;
  updated_at: string;
  chapter?: Chapter;
  attachments?: Attachment[];
}

export interface Announcement {
  id: number;
  course_id: number;
  user_id: number;
  content: string;
  created_at: string;
  updated_at: string;
  user: User;
  comments: AnnouncementComment[];
  course?: Course;
}

export interface AnnouncementComment {
  id: number;
  announcement_id: number;
  user_id: number;
  content: string;
  created_at: string;
  updated_at: string;
  user: User;
  announcement?: Announcement;
}
