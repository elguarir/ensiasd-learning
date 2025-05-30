import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Course } from "@/types";
import {
  BookOpenIcon,
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CodeIcon,
  EllipsisIcon,
} from "lucide-react";
import { useId } from "react";
import CourseActions from "./course-actions";
import CourseCodeDialog from "./course-code-dialog";

interface CoursesGridProps {
  data: Course[];
  table: any; // Using the same table instance for filter state persistence
  handleDeleteRows: () => void;
}

export default function CoursesGrid({
  data,
  table,
  handleDeleteRows,
}: CoursesGridProps) {
  const id = useId();

  // Get the filtered and sorted data from the table instance
  const rows = table.getRowModel().rows;

  return (
    <>
      {/* Custom Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rows?.length ? (
          rows.map((row: any) => {
            const course = row.original;
            return (
              <div
                key={course.id}
                className="group bg-card flex flex-col overflow-hidden rounded-lg border-[1.5px] shadow-sm transition-all duration-300 hover:shadow-md"
              >
                {/* Course Image with Overlay */}
                <div className="relative">
                  {/* Course Image */}
                  <div className="aspect-video w-full overflow-hidden">
                    {course.image ? (
                      <img
                        src={course.image}
                        alt={`${course.title} thumbnail`}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://via.placeholder.com/400x225?text=Course";
                        }}
                      />
                    ) : (
                      <div className="bg-muted text-muted-foreground flex h-full w-full items-center justify-center">
                        No image set
                      </div>
                    )}
                  </div>

                  {/* Course Code Badge */}
                  <div className="absolute top-2 right-2">
                    <CourseCodeDialog course={course}>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="gap-1.5 text-xs font-medium"
                      >
                        <CodeIcon className="h-3 w-3" />
                        {course.code}
                      </Button>
                    </CourseCodeDialog>
                  </div>
                </div>

                {/* Course Content */}
                <div className="flex flex-1 flex-col p-4">
                  <div className="mb-2 flex items-start justify-between">
                    <h3 className="line-clamp-1 font-semibold">
                      {course.title}
                    </h3>
                    <CourseCardActions course={course} />
                  </div>

                  <p className="text-muted-foreground mb-4 line-clamp-2 flex-grow text-sm">
                    {course.description
                      ? course.description
                      : "No description set."}
                  </p>

                  <div className="text-muted-foreground mt-auto flex items-center justify-between border-t pt-2 text-sm">
                    <div className="flex items-center gap-1">
                      <BookOpenIcon className="h-4 w-4" />
                      <span>{course.chapters_count || 0} chapters</span>
                    </div>
                    {course.status === "published" ? (
                      <Tooltip delayDuration={300}>
                        <TooltipTrigger asChild>
                          <div>{renderStatusBadge(course.status)}</div>
                        </TooltipTrigger>
                        <TooltipContent>
                          Published on{" "}
                          {new Date(course.published_at!).toLocaleDateString()}
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      renderStatusBadge(course.status)
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-10 text-center">
            No courses found.
          </div>
        )}
      </div>

      {/* Pagination - keep existing code */}
      <div className="mt-6 flex items-center justify-between gap-8">
        {/* Results per page */}
        <div className="flex items-center gap-3">
          <Label htmlFor={id} className="max-sm:sr-only">
            Items per page
          </Label>
          <Select
            value={table.getState().pagination.pageSize.toString()}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger id={id} className="w-fit whitespace-nowrap">
              <SelectValue placeholder="Select number of results" />
            </SelectTrigger>
            <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2">
              {[8, 12, 16, 24].map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Page number information */}
        <div className="text-muted-foreground flex grow justify-end text-sm whitespace-nowrap">
          <p
            className="text-muted-foreground text-sm whitespace-nowrap"
            aria-live="polite"
          >
            <span className="text-foreground">
              {table.getState().pagination.pageIndex *
                table.getState().pagination.pageSize +
                1}
              -
              {Math.min(
                Math.max(
                  table.getState().pagination.pageIndex *
                    table.getState().pagination.pageSize +
                    table.getState().pagination.pageSize,
                  0,
                ),
                table.getRowCount(),
              )}
            </span>{" "}
            of{" "}
            <span className="text-foreground">
              {table.getRowCount().toString()}
            </span>
          </p>
        </div>

        {/* Pagination buttons */}
        <div>
          <Pagination>
            <PaginationContent>
              {/* First page button */}
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.firstPage()}
                  disabled={!table.getCanPreviousPage()}
                  aria-label="Go to first page"
                >
                  <ChevronFirstIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
              {/* Previous page button */}
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  aria-label="Go to previous page"
                >
                  <ChevronLeftIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
              {/* Next page button */}
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  aria-label="Go to next page"
                >
                  <ChevronRightIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
              {/* Last page button */}
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.lastPage()}
                  disabled={!table.getCanNextPage()}
                  aria-label="Go to last page"
                >
                  <ChevronLastIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </>
  );
}

function renderStatusBadge(status: string) {
  let variant: "default" | "success" | "warning" | "danger" = "default";

  switch (status) {
    case "published":
      variant = "success";
      break;
    case "draft":
      variant = "warning";
      break;
    case "archived":
      variant = "default";
      break;
  }

  return (
    <Badge variant={variant} className="capitalize">
      {status}
    </Badge>
  );
}

function CourseCardActions({ course }: { course: Course }) {
  return (
    <CourseActions course={course}>
      <Button
        size="icon"
        variant="ghost"
        className="h-8 w-8 shadow-none"
        aria-label="Course actions"
      >
        <EllipsisIcon size={16} aria-hidden="true" />
      </Button>
    </CourseActions>
  );
}
