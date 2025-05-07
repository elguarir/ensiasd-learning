import { Toaster } from "@/components/ui/sonner";
import { useAppearance } from "@/hooks/use-appearance";
import AppLayoutTemplate from "@/layouts/app/app-header-layout";
import { type BreadcrumbItem } from "@/types";

interface AppLayoutProps {
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
  const { appearance, updateAppearance } = useAppearance();
  return (
    <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
      {children}
      <Toaster theme={appearance} richColors duration={2300} />
    </AppLayoutTemplate>
  );
};
