import { Assignment } from "@/types";
import { File, FileText, Video, HelpCircle, ExternalLink } from "lucide-react";
import React from "react";

/**
 * Format a date string to a more readable format
 */
export function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
}

/**
 * Calculate days remaining for an assignment
 */
export function getDaysRemaining(dueDate: string): number {
  const now = new Date();
  const due = new Date(dueDate);
  const diffTime = due.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Calculate assignment status based on due date
 */
export function getAssignmentStatus(assignment: Assignment): {
  status: string;
  color: string;
  bgColor: string;
} {
  if (!assignment.due_date) {
    return {
      status: "No deadline",
      color: "bg-gray-200",
      bgColor: "bg-gray-50 dark:bg-gray-800/50",
    };
  }

  const daysRemaining = getDaysRemaining(assignment.due_date);

  if (daysRemaining < 0) {
    return {
      status: "Overdue",
      color: "bg-red-500",
      bgColor: "bg-red-50 dark:bg-red-900/20",
    };
  }

  if (daysRemaining === 0) {
    return {
      status: "Due today",
      color: "bg-amber-500",
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
    };
  }

  if (daysRemaining <= 3) {
    return {
      status: `Due soon (${daysRemaining} days)`,
      color: "bg-amber-400",
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
    };
  }

  return {
    status: `${daysRemaining} days left`,
    color: "bg-emerald-500",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
  };
}

/**
 * Get icon for resource type
 */
export function ResourceIcon({ type }: { type: string }): React.ReactElement {
  switch (type) {
    case "attachment":
      return <File className="h-4 w-4" />;
    case "rich_text":
      return <FileText className="h-4 w-4" />;
    case "quiz":
      return <HelpCircle className="h-4 w-4" />;
    case "external":
      return <ExternalLink className="h-4 w-4" />;
    default:
      return <File className="h-4 w-4" />;
  }
}

/**
 * Get a display name from a full name (first letter of each word)
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

/**
 * Format relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) {
    return interval === 1 ? "1 year ago" : `${interval} years ago`;
  }

  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
    return interval === 1 ? "1 month ago" : `${interval} months ago`;
  }

  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    return interval === 1 ? "1 day ago" : `${interval} days ago`;
  }

  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    return interval === 1 ? "1 hour ago" : `${interval} hours ago`;
  }

  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    return interval === 1 ? "1 minute ago" : `${interval} minutes ago`;
  }

  return "Just now";
}
