import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { type BreadcrumbItem as BreadcrumbItemType } from "@/types";
import { Link } from "@inertiajs/react";
import { Fragment } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

export function Breadcrumbs({
  breadcrumbs,
}: {
  breadcrumbs: BreadcrumbItemType[];
}) {
  return (
    <>
      {breadcrumbs.length > 0 && (
        <Breadcrumb>
          <BreadcrumbList className="flex flex-nowrap">
            {breadcrumbs.length >= 3 ? (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href={breadcrumbs[0].href}>{breadcrumbs[0].title}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem className="md:hidden">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-1">
                      <BreadcrumbEllipsis className="h-4 w-4" />
                      <span className="sr-only">Toggle menu</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {breadcrumbs.slice(1, -1).map((item, index) => (
                        <DropdownMenuItem key={index} asChild>
                          <Link href={item.href}>{item.title}</Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </BreadcrumbItem>
                {breadcrumbs.slice(1, -1).map((item, index) => (
                  <Fragment key={index}>
                    <BreadcrumbItem className="hidden md:inline-flex">
                      <BreadcrumbLink asChild>
                        <Link href={item.href}>{item.title}</Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:inline-flex" />
                  </Fragment>
                ))}
                <BreadcrumbSeparator className="md:hidden" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{breadcrumbs[breadcrumbs.length - 1].title}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            ) : (
              breadcrumbs.map((item, index) => {
                const isLast = index === breadcrumbs.length - 1;
                return (
                  <Fragment key={index}>
                    <BreadcrumbItem>
                      {isLast ? (
                        <BreadcrumbPage>{item.title}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link href={item.href}>{item.title}</Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {!isLast && <BreadcrumbSeparator />}
                  </Fragment>
                );
              })
            )}
          </BreadcrumbList>
        </Breadcrumb>
      )}
    </>
  );
}
