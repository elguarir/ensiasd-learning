import Heading from "@/components/heading";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Course } from "@/types";
import {
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  CircleAlertIcon,
  CircleXIcon,
  Columns3Icon,
  FilterIcon,
  LayoutGridIcon,
  ListFilterIcon,
  PlusIcon,
  SlidersHorizontal,
  TableIcon,
  TrashIcon,
} from "lucide-react";
import { useId, useMemo, useRef, useState } from "react";
import { Badge } from "../ui/badge";
import CoursesGrid from "./courses-grid";
import CoursesTable, { columns } from "./courses-table";
import AddCourseDialog from "./add-course-dialog";

// Mock data for demonstration
const mockCourses: Course[] = [
  {
    id: 1,
    instructor_id: 1,
    title: "Introduction to React",
    slug: "intro-to-react",
    description: "Learn the basics of React",
    image:
      "https://buildui.com/_next/image?url=https%3A%2F%2Fmedia.graphassets.com%2F7Q52yiQvSuiZfXl7vXqM&w=828&q=75",
    category: "Web Development",
    is_featured: true,
    level: "beginner",
    status: "published",
    tags: ["react", "javascript", "web"],
    published_at: "2024-03-01T00:00:00.000Z",
    created_at: "2024-02-28T00:00:00.000Z",
    updated_at: "2024-02-28T00:00:00.000Z",
    students_count: 156,
  },
  {
    id: 2,
    instructor_id: 1,
    title: "Advanced TypeScript",
    slug: "advanced-typescript",
    description: "Master TypeScript development",
    image:
      "https://buildui.com/_next/image?url=https%3A%2F%2Fmedia.graphassets.com%2FpG6MERWDRkK9IT5rRlBB&w=640&q=100",
    category: "Programming",
    is_featured: false,
    level: "advanced",
    status: "draft",
    tags: ["typescript", "javascript"],
    published_at: null,
    created_at: "2024-02-27T00:00:00.000Z",
    updated_at: "2024-02-27T00:00:00.000Z",
    students_count: 42,
  },
  {
    id: 3,
    instructor_id: 1,
    title: "Full Stack Web Development",
    slug: "full-stack-web-dev",
    description: "Learn both frontend and backend development",
    image:
      "https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200",
    category: "Web Development",
    is_featured: true,
    level: "intermediate",
    status: "published",
    tags: ["node", "react", "javascript", "fullstack"],
    published_at: "2024-02-15T00:00:00.000Z",
    created_at: "2024-02-10T00:00:00.000Z",
    updated_at: "2024-02-15T00:00:00.000Z",
    students_count: 89,
  },
  {
    id: 4,
    instructor_id: 1,
    title: "Database Design Fundamentals",
    slug: "database-design",
    description: "Learn how to design efficient database schemas",
    image:
      "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200",
    category: "Database",
    is_featured: false,
    level: "beginner",
    status: "archived",
    tags: ["sql", "database", "design"],
    published_at: "2023-10-05T00:00:00.000Z",
    created_at: "2023-10-01T00:00:00.000Z",
    updated_at: "2024-01-15T00:00:00.000Z",
    students_count: 23,
  },
  {
    id: 5,
    instructor_id: 1,
    title: "Cloud Computing with AWS",
    slug: "cloud-computing-aws",
    description: "Master Amazon Web Services",
    image:
      "https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200",
    category: "Cloud Computing",
    is_featured: true,
    level: "advanced",
    status: "published",
    tags: ["aws", "cloud", "devops"],
    published_at: "2024-01-20T00:00:00.000Z",
    created_at: "2024-01-10T00:00:00.000Z",
    updated_at: "2024-01-20T00:00:00.000Z",
    students_count: 67,
  },
];

type ViewMode = "table" | "grid";

export default function InstructorCourses() {
  const id = useId();
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: viewMode === "table" ? 10 : 12,
  });
  const inputRef = useRef<HTMLInputElement>(null);

  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "title",
      desc: false,
    },
  ]);

  const [data, setData] = useState<Course[]>(mockCourses);

  const handleDeleteRows = () => {
    const selectedRows = table.getSelectedRowModel().rows;
    const updatedData = data.filter(
      (item) => !selectedRows.some((row) => row.original.id === item.id),
    );
    setData(updatedData);
    table.resetRowSelection();
  };

  const toggleViewMode = (mode: ViewMode) => {
    // Adjust pagination size when switching views
    if (mode === "grid" && viewMode === "table") {
      setPagination((prev) => ({ ...prev, pageSize: 12 }));
    } else if (mode === "table" && viewMode === "grid") {
      setPagination((prev) => ({ ...prev, pageSize: 10 }));
    }
    setViewMode(mode);
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    enableSortingRemoval: false,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      sorting,
      pagination,
      columnFilters,
      columnVisibility,
    },
  });

  // Get unique status values
  const uniqueStatusValues = useMemo(() => {
    const statusColumn = table.getColumn("status");

    if (!statusColumn) return [];

    const values = Array.from(statusColumn.getFacetedUniqueValues().keys());

    return values.sort();
  }, [table.getColumn("status")?.getFacetedUniqueValues()]);

  const statusCounts = useMemo(() => {
    const statusColumn = table.getColumn("status");
    if (!statusColumn) return new Map();
    return statusColumn.getFacetedUniqueValues();
  }, [table.getColumn("status")?.getFacetedUniqueValues()]);

  const selectedStatuses = useMemo(() => {
    const filterValue = table.getColumn("status")?.getFilterValue() as string[];
    return filterValue ?? [];
  }, [table.getColumn("status")?.getFilterValue()]);

  const handleStatusChange = (checked: boolean, value: string) => {
    const filterValue = table.getColumn("status")?.getFilterValue() as string[];
    const newFilterValue = filterValue ? [...filterValue] : [];

    if (checked) {
      newFilterValue.push(value);
    } else {
      const index = newFilterValue.indexOf(value);
      if (index > -1) {
        newFilterValue.splice(index, 1);
      }
    }

    table
      .getColumn("status")
      ?.setFilterValue(newFilterValue.length ? newFilterValue : undefined);
  };

  return (
    <>
      <Heading
        title="My Courses"
        description="Manage your course catalog. Create new courses or modify existing ones."
      />
      <div>
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="hidden items-center gap-3 lg:flex">
              {/* Desktop filters */}
              {/* Filter by title or description */}
              <div className="relative">
                <Input
                  id={`${id}-input`}
                  ref={inputRef}
                  className={cn(
                    "peer min-w-60 ps-9",
                    Boolean(table.getColumn("title")?.getFilterValue()) &&
                      "pe-9",
                  )}
                  value={
                    (table.getColumn("title")?.getFilterValue() ?? "") as string
                  }
                  onChange={(e) =>
                    table.getColumn("title")?.setFilterValue(e.target.value)
                  }
                  placeholder="Filter by title or description..."
                  type="text"
                  aria-label="Filter by title or description"
                />
                <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                  <ListFilterIcon size={16} aria-hidden="true" />
                </div>
                {Boolean(table.getColumn("title")?.getFilterValue()) && (
                  <button
                    className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Clear filter"
                    onClick={() => {
                      table.getColumn("title")?.setFilterValue("");
                      if (inputRef.current) {
                        inputRef.current.focus();
                      }
                    }}
                  >
                    <CircleXIcon size={16} aria-hidden="true" />
                  </button>
                )}
              </div>
              {/* Filter by status */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <FilterIcon
                      className="-ms-1 opacity-60"
                      size={16}
                      aria-hidden="true"
                    />
                    Status
                    {selectedStatuses.length > 0 && (
                      <span className="bg-background text-muted-foreground/70 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
                        {selectedStatuses.length}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto min-w-36 px-3 py-2" align="start">
                  <div className="space-y-3">
                    <div className="text-muted-foreground text-xs font-medium">
                      Filters
                    </div>
                    <div className="space-y-3">
                      {uniqueStatusValues.map((value, i) => (
                        <div key={value} className="flex items-center gap-2">
                          <Checkbox
                            id={`${id}-${i}`}
                            checked={selectedStatuses.includes(value)}
                            onCheckedChange={(checked: boolean) =>
                              handleStatusChange(checked, value)
                            }
                          />
                          <Label
                            htmlFor={`${id}-${i}`}
                            className="flex grow justify-between gap-2 font-normal capitalize"
                          >
                            {value}{" "}
                            <span className="text-muted-foreground ms-2 text-xs">
                              {statusCounts.get(value)}
                            </span>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              {/* Toggle columns visibility */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Columns3Icon
                      className="-ms-1 opacity-60"
                      size={16}
                      aria-hidden="true"
                    />
                    Columns
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                      const labels = {
                        title: "Title",
                        description: "Description",
                        category: "Category",
                        status: "Status",
                        published_at: "Published",
                        students_count: "Students",
                      };

                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                          }
                          onSelect={(event) => event.preventDefault()}
                        >
                          {/* @ts-ignore */}
                          {labels[column.id] ?? column.id}
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
              {/* View toggle buttons */}
              <div className="flex items-center overflow-hidden rounded-md border">
                <Button
                  variant={viewMode === "table" ? "default" : "ghost"}
                  size="sm"
                  className="rounded-none px-3"
                  onClick={() => toggleViewMode("table")}
                >
                  <TableIcon size={16} className="mr-1" />
                  Table
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  className="rounded-none px-3"
                  onClick={() => toggleViewMode("grid")}
                >
                  <LayoutGridIcon size={16} className="mr-1" />
                  Grid
                </Button>
              </div>
            </div>

            {/* Mobile filters */}
            <div className="flex w-full items-center gap-3 lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <SlidersHorizontal className="-ms-1 mr-2 size-4" />
                    Filters
                    {(Boolean(table.getColumn("title")?.getFilterValue()) ||
                      selectedStatuses.length > 0) && (
                      <Badge variant="secondary" className="ml-auto">
                        {(Boolean(table.getColumn("title")?.getFilterValue())
                          ? 1
                          : 0) + selectedStatuses.length}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="w-full">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>
                      Filter and sort your courses
                    </SheetDescription>
                  </SheetHeader>
                  <div className="grid gap-6 p-4">
                    {/* Search input */}
                    <div className="flex flex-col gap-y-2.5">
                      <Label htmlFor={`${id}-mobile-input`}>Search</Label>
                      <Input
                        id={`${id}-mobile-input`}
                        autoFocus={false}
                        className={cn(
                          "w-full",
                          Boolean(table.getColumn("title")?.getFilterValue()) &&
                            "pe-9",
                        )}
                        value={
                          (table.getColumn("title")?.getFilterValue() ??
                            "") as string
                        }
                        onChange={(e) =>
                          table
                            .getColumn("title")
                            ?.setFilterValue(e.target.value)
                        }
                        placeholder="Filter by title or description..."
                      />
                    </div>
                    {/* Status filter */}
                    <div className="flex flex-col gap-y-2.5">
                      <Label>Status</Label>
                      <div className="space-y-2">
                        {uniqueStatusValues.map((value, i) => (
                          <div key={value} className="flex items-center gap-2">
                            <Checkbox
                              id={`${id}-mobile-${i}`}
                              checked={selectedStatuses.includes(value)}
                              onCheckedChange={(checked: boolean) =>
                                handleStatusChange(checked, value)
                              }
                            />
                            <Label
                              htmlFor={`${id}-mobile-${i}`}
                              className="flex grow justify-between gap-2 font-normal capitalize"
                            >
                              {value}{" "}
                              <span className="text-muted-foreground ms-2 text-xs">
                                {statusCounts.get(value)}
                              </span>
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* View mode */}
                    <div className="flex flex-col gap-y-2.5">
                      <Label>View Mode</Label>
                      <div className="flex w-full items-center overflow-hidden rounded-md border">
                        <Button
                          variant={viewMode === "table" ? "default" : "ghost"}
                          size="sm"
                          className="w-full rounded-none"
                          onClick={() => toggleViewMode("table")}
                        >
                          <TableIcon size={16} className="mr-2" />
                          Table
                        </Button>
                        <Button
                          variant={viewMode === "grid" ? "default" : "ghost"}
                          size="sm"
                          className="w-full rounded-none"
                          onClick={() => toggleViewMode("grid")}
                        >
                          <LayoutGridIcon size={16} className="mr-2" />
                          Grid
                        </Button>
                      </div>
                    </div>
                  </div>
                  <SheetFooter>
                    <SheetClose asChild>
                      <Button type="submit" className="w-full">
                        Apply Filters
                      </Button>
                    </SheetClose>
                  </SheetFooter>
                </SheetContent>
              </Sheet>

              {/* Add course button remains visible */}
              <AddCourseDialog showText={false} />
            </div>

            {/* Desktop actions */}
            <div className="hidden items-center gap-3 lg:flex">
              {/* Delete button */}
              {table.getSelectedRowModel().rows.length > 0 && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className="ml-auto" variant="outline">
                      <TrashIcon
                        className="-ms-1 opacity-60"
                        size={16}
                        aria-hidden="true"
                      />
                      Delete
                      <span className="bg-background text-muted-foreground/70 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
                        {table.getSelectedRowModel().rows.length}
                      </span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
                      <div
                        className="flex size-9 shrink-0 items-center justify-center rounded-full border"
                        aria-hidden="true"
                      >
                        <CircleAlertIcon className="opacity-80" size={16} />
                      </div>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete {table.getSelectedRowModel().rows.length}{" "}
                          selected{" "}
                          {table.getSelectedRowModel().rows.length === 1
                            ? "row"
                            : "rows"}
                          .
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteRows}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              {/* Add course button */}
                <AddCourseDialog showText />
            </div>
          </div>

          {/* Render either Table or Grid view based on viewMode */}
          {viewMode === "table" ? (
            <CoursesTable
              data={data}
              table={table}
              handleDeleteRows={handleDeleteRows}
            />
          ) : (
            <CoursesGrid
              data={data}
              table={table}
              handleDeleteRows={handleDeleteRows}
            />
          )}
        </div>
      </div>
    </>
  );
}
