import Heading from "@/components/heading";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";

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

export default function Dashboard() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Courses" />
      <div className="flex h-full flex-1 flex-col gap-4 p-4">
        <Heading
          title="Courses"
          description="View and manage all your courses. Create new courses or modify existing ones."
        />
      </div>
    </AppLayout>
  );
}
