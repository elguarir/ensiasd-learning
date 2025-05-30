import { PlaceholderPattern } from "@/components/ui/placeholder-pattern";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";
import {
  BookOpen,
  UserCheck,
  Users,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { EnrollmentChart } from "@/components/dashboard/enrollment-chart";
import { ResourceChart } from "@/components/dashboard/resource-chart";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
  },
];

type StatsProps = {
  stats?: {
    cards: {
      totalStudents: number;
      totalCourses: number;
      activeStudentsThisMonth: number;
      studentGrowth: number;
      courseGrowth: number;
      activeGrowth: number;
      studentHistory: Array<{ value: number }>;
      courseHistory: Array<{ value: number }>;
      activeStudentsHistory: Array<{ value: number }>;
    };
    enrollmentTrend: Array<{
      month: string;
      enrollments: number;
    }>;
    resourceStats: Array<{
      type: string;
      count: number;
    }>;
  };
};

export default function Dashboard({ stats }: StatsProps) {
  // Display placeholder if no stats
  if (!stats) {
    return (
      <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Dashboard" />
        <div className="flex h-full flex-1 flex-col gap-4 rounded-xl">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
              <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
            </div>
            <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
              <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
            </div>
            <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
              <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
            </div>
          </div>
          <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 rounded-xl border md:min-h-min">
            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
          </div>
        </div>
      </AppLayout>
    );
  }

  // With stats
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <div className="flex h-full flex-1 flex-col gap-4">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            title="Total Students"
            value={stats.cards.totalStudents}
            description="Students enrolled in your courses"
            growth={stats.cards.studentGrowth}
            history={stats.cards.studentHistory}
            icon={<Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
            chartColor="#3b82f6"
          />
          
          <StatCard
            title="Your Courses"
            value={stats.cards.totalCourses}
            description="Total courses you've created"
            growth={stats.cards.courseGrowth}
            history={stats.cards.courseHistory}
            icon={<BookOpen className="h-5 w-5 text-violet-600 dark:text-violet-400" />}
            chartColor="#8b5cf6"
          />
          
          <StatCard
            title="Active Students"
            value={stats.cards.activeStudentsThisMonth}
            description="New students this month"
            growth={stats.cards.activeGrowth}
            history={stats.cards.activeStudentsHistory}
            icon={<UserCheck className="h-5 w-5 text-sky-600 dark:text-sky-400" />}
            chartColor="#f59e0b"
          />
        </div>

        {/* Charts */}
        <div className="grid gap-4 md:grid-cols-2">
          <EnrollmentChart data={stats.enrollmentTrend} />
          <ResourceChart data={stats.resourceStats} />
        </div>
      </div>
    </AppLayout>
  );
}
