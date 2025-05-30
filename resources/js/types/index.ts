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
  invite_token: string;
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
  students_count?: number;
  chapters_count?: number;
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
  text: string;
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
  text: string;
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
  is_pinned?: boolean;
  created_at: string;
  updated_at: string;
  course?: Course;
  author?: User;
  comments?: ThreadComment[];
  attachments?: Attachment[];
}

export interface ThreadComment {
  id: number;
  thread_id: number;
  author_id: number;
  content: string;
  parent_id: number | null;
  created_at: string;
  updated_at: string;
  thread?: CourseThread;
  author?: User;
  attachments?: Attachment[];
}

// New types for Resource metadata
export interface ResourceAttachmentFile {
  id: number; // Attachment ID
  name: string;
  size: number;
  mime_type: string;
  path: string; // URL to download/access
}

export interface AttachmentResourceMetadata {
  file_count: number;
  total_size: number;
  files: ResourceAttachmentFile[];
}

export interface RichTextResourceMetadata {
  format: string;
  content: string;
  excerpt: string;
}

export interface ExternalResourceMetadata {
  external_url: string;
  link_title: string | null;
  link_description: string | null;
  favicon_url: string | null;
}

// Note: Assuming QuizOption type is sufficient for options listed in quiz questions metadata.
// The controller maps $question->options directly.
export interface QuizResourceMetadata {
  question_count: number;
  total_points: number;
  questions: Array<{
    id: number; // QuizQuestion ID
    question: string; // Text of the question
    // points per question is not in controller's mapped 'questions' array, so not included here.
    options: QuizOption[]; // Array of QuizOption objects
  }>;
}

// Base for all resource types
interface BaseResource {
  id: number;
  chapter_id: number;
  title: string;
  position: number;
  created_at: string;
  updated_at: string;
  chapter?: Chapter;
}

// Discriminated union for Resource
export type Resource =
  | (BaseResource & {
      resource_type: "attachment";
      metadata: AttachmentResourceMetadata | null;
    })
  | (BaseResource & {
      resource_type: "rich_text";
      metadata: RichTextResourceMetadata | null;
    })
  | (BaseResource & {
      resource_type: "quiz";
      metadata: QuizResourceMetadata | null;
    })
  | (BaseResource & {
      resource_type: "external";
      metadata: ExternalResourceMetadata | null;
    });

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
  attachments?: Attachment[];
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
  attachments?: Attachment[];
}
