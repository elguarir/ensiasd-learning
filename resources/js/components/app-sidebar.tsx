import { NavFooter } from "@/components/nav-footer";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useUser } from "@/hooks/use-user";
import { type NavItem } from "@/types";
import { Link } from "@inertiajs/react";
import {
  BookOpenText,
  ClipboardList,
  FileText,
  LayoutGrid,
  MessageSquareIcon,
  User,
} from "lucide-react";
import AppLogo from "./app-logo";

const studentMainNavItems: NavItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutGrid,
  },
  {
    title: "Courses",
    url: "/dashboard/courses",
    icon: BookOpenText,
  },
];

const instructorMainNavItems: NavItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutGrid,
  },
  {
    title: "Courses",
    url: "/dashboard/courses",
    icon: BookOpenText,
  },
  {
    title: "Assignements",
    url: "/dashboard/assignments",
    icon: ClipboardList,
  },
  {
    title: "Publications",
    url: "/dashboard/publications",
    icon: FileText,
  },
  {
    title: "Messages",
    url: "/dashboard/messages",
    icon: MessageSquareIcon,
  },
];

const footerNavItems: NavItem[] = [
  {
    title: "Profile",
    url: "/settings/profile",
    icon: User,
  },
];

export function AppSidebar() {
  const user = useUser();
  const isInstructor = user?.role === "instructor";
  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard" prefetch>
                <AppLogo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain
          items={isInstructor ? instructorMainNavItems : studentMainNavItems}
        />
      </SidebarContent>

      <SidebarFooter>
        <NavFooter items={footerNavItems} className="mt-auto" />
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
