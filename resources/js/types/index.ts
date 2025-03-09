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
  role?: "student" | "instructor";
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  [key: string]: unknown;
}

export interface Course {
  id: number;
  instructor_id: number;
  title: string;
  slug: string;
  description: string;
  image: string;
  category: string;
  is_featured: boolean;
  level: 'beginner' | 'intermediate' | 'advanced';
  status: 'draft' | 'published' | 'archived';
  tags: string[];
  published_at: string | null;
  created_at: string;
  updated_at: string;
  students_count: number;
}
