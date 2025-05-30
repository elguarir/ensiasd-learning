"use client";

import { useForm } from "@inertiajs/react";
import {
  Edit,
  HelpCircle,
  Link,
  Paperclip,
  Plus,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import FormField from "@/components/form-field";
import QuizGenerator from "@/components/quiz-generator";
import { Button } from "@/components/ui/button";
import { FileUploader } from "@/components/ui/file-uploader";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { QuizBuilder } from "../../quiz-builder";
// Define the type for our form data
type ResourceFormData = {
  chapter_id: number;
  title: string;
  resource_type: "attachment" | "rich_text" | "quiz" | "external";
  attachment: {
    files: File[];
  };
  rich_text: {
    content: string;
  };
  quiz: {
    questions: {
      id?: number;
      question: string;
      options: {
        id?: number;
        text: string;
        is_correct: boolean;
      }[];
    }[];
  };
  external: {
    external_url: string;
    link_title: string;
    link_description: string;
  };
};

export function AddResourceSheet({ chapterId }: { chapterId: number }) {
  const [open, setOpen] = useState(false);
  const [resourceType, setResourceType] = useState<
    "attachment" | "rich_text" | "quiz" | "external"
  >("attachment");
  const [view, setView] = useState<"quiz-builder" | "quiz-generator">(
    "quiz-builder",
  );

  const { data, setData, post, processing, errors, reset } =
    useForm<ResourceFormData>({
      chapter_id: chapterId,
      title: "",
      resource_type: "attachment",
      attachment: {
        files: [],
      },
      rich_text: {
        content: "",
      },
      quiz: {
        questions: [
          {
            question: "",
            options: [
              { text: "", is_correct: true },
              { text: "", is_correct: false },
              { text: "", is_correct: false },
              { text: "", is_correct: false },
            ],
          },
        ],
      },
      external: {
        external_url: "",
        link_title: "",
        link_description: "",
      },
    });

  // Helper to set resource type specific data
  const setResourceTypeData = (key: string, value: any) => {
    const resourceData = { ...data[resourceType] } as Record<string, any>;
    resourceData[key] = value;

    setData(resourceType as any, resourceData);
  };

  // Handle resource type change
  const handleResourceTypeChange = (value: string) => {
    const newType = value as "attachment" | "rich_text" | "quiz" | "external";
    setResourceType(newType);
    setData("resource_type", newType);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (resourceType !== "attachment") {
      setData("attachment", {
        files: [],
      });
    }

    post(route("resources.store"), {
      preserveScroll: true,
      forceFormData: resourceType === "attachment",
      onError: () => {
        toast.error("Failed to create resource!");
      },
      onSuccess: () => {
        reset();
        setOpen(false);
        toast.success("Resource created successfully!");
      },
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="mt-2">
          <Plus className="mr-1 h-4 w-4" />
          Add Resource
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md md:max-w-lg lg:max-w-xl">
        <SheetHeader>
          <SheetTitle>Add New Resource</SheetTitle>
          <SheetDescription>
            Create a new resource for this chapter. Choose the type of resource
            and fill in the details.
          </SheetDescription>
        </SheetHeader>

        <Tabs
          defaultValue="attachment"
          value={resourceType}
          onValueChange={handleResourceTypeChange}
          className="w-full px-4"
        >
          <div className="w-full overflow-x-auto pb-1">
            <TabsList className="text-foreground h-auto gap-2 rounded-none border-b bg-transparent">
              <TabsTrigger
                value="attachment"
                className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                <Paperclip
                  className="-ms-0.5 opacity-60"
                  size={16}
                  aria-hidden="true"
                />
                Attachment
              </TabsTrigger>
              <TabsTrigger
                value="rich_text"
                className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                <Edit
                  className="-ms-0.5 opacity-60"
                  size={16}
                  aria-hidden="true"
                />
                Rich Text
              </TabsTrigger>
              <TabsTrigger
                value="quiz"
                className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                <HelpCircle
                  className="-ms-0.5 opacity-60"
                  size={16}
                  aria-hidden="true"
                />
                Quiz
              </TabsTrigger>
              <TabsTrigger
                value="external"
                className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                <Link
                  className="-ms-0.5 opacity-60"
                  size={16}
                  aria-hidden="true"
                />
                External Link
              </TabsTrigger>
            </TabsList>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Common fields */}
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                type="text"
                required
                placeholder="Enter a title for the resource"
                value={data.title}
                onChange={(e) => setData("title", e.target.value)}
              />
              {errors?.title && (
                <p className="mt-1 text-sm text-red-500">{errors?.title}</p>
              )}
            </div>
            {/* Attachment-specific fields */}
            <TabsContent value="attachment" className="space-y-4">
              <FormField>
                <label htmlFor="files" className="text-sm font-medium">
                  Upload Files
                </label>
                <FileUploader
                  value={data.attachment.files}
                  onChange={(files) => setResourceTypeData("files", files)}
                  maxFiles={5}
                  accept={[
                    "image/*",
                    "application/pdf",
                    ".doc",
                    ".docx",
                    ".ppt",
                    ".pptx",
                  ]}
                  uploadText="Drag files here or click to upload"
                />
                <p className="text-muted-foreground mt-1 text-sm">
                  Supports: Images, PDF, DOC, DOCX, PPT, PPTX
                </p>
                {errors["attachment.files"] && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors["attachment.files"]}
                  </p>
                )}
              </FormField>
            </TabsContent>
            {/* Rich Text-specific fields */}
            <TabsContent value="rich_text" className="space-y-4">
              <FormField>
                <label htmlFor="content" className="text-sm font-medium">
                  Content
                </label>
                <RichTextEditor
                  content={data.rich_text.content}
                  onChange={(content) =>
                    setResourceTypeData("content", content)
                  }
                  className="min-h-[300px]"
                />
                {errors["rich_text.content"] && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors["rich_text.content"]}
                  </p>
                )}
              </FormField>
            </TabsContent>

            {/* Quiz-specific fields */}
            <TabsContent value="quiz" className="space-y-4">
              <FormField className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Quiz Questions</label>
                  <Tabs
                    defaultValue={view}
                    value={view}
                    onValueChange={(value) =>
                      setView(value as "quiz-builder" | "quiz-generator")
                    }
                  >
                    <TabsList className="gap-1 rounded-full bg-transparent">
                      <TabsTrigger
                        value="quiz-builder"
                        className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full data-[state=active]:shadow-none"
                      >
                        <Sparkles className="mr-1 h-4 w-4" />
                        Quiz Builder
                      </TabsTrigger>
                      <TabsTrigger
                        value="quiz-generator"
                        className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full data-[state=active]:shadow-none"
                      >
                        <Sparkles className="mr-1 h-4 w-4" />
                        Quiz Generator
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                {view === "quiz-builder" && (
                  <QuizBuilder
                    questions={data.quiz.questions}
                    onChange={(questions) =>
                      setResourceTypeData("questions", questions)
                    }
                    setView={setView}
                  />
                )}
                {view === "quiz-generator" && (
                  <QuizGenerator
                    onChange={(questions) =>
                      setResourceTypeData("questions", questions)
                    }
                    setView={setView}
                  />
                )}
                {errors["quiz.questions"] && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors["quiz.questions"]}
                  </p>
                )}
              </FormField>
            </TabsContent>

            {/* External Link-specific fields */}
            <TabsContent value="external" className="space-y-4">
              <FormField>
                <label htmlFor="external_url" className="text-sm font-medium">
                  External URL
                </label>
                <Input
                  id="external_url"
                  placeholder="https://example.com"
                  type="url"
                  value={data.external.external_url}
                  onChange={(e) =>
                    setResourceTypeData("external_url", e.target.value)
                  }
                />
                {errors["external.external_url"] && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors["external.external_url"]}
                  </p>
                )}
              </FormField>

              <FormField>
                <label htmlFor="link_title" className="text-sm font-medium">
                  Link Title (Optional)
                </label>
                <Input
                  id="link_title"
                  placeholder="Custom title for the link"
                  value={data.external.link_title}
                  onChange={(e) =>
                    setResourceTypeData("link_title", e.target.value)
                  }
                />
                <p className="text-muted-foreground mt-1 text-sm">
                  If left empty, we'll try to fetch the title from the URL.
                </p>
                {errors["external.link_title"] && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors["external.link_title"]}
                  </p>
                )}
              </FormField>

              <FormField>
                <label
                  htmlFor="link_description"
                  className="text-sm font-medium"
                >
                  Link Description (Optional)
                </label>
                <Textarea
                  id="link_description"
                  placeholder="Brief description of the external resource"
                  value={data.external.link_description}
                  onChange={(e) =>
                    setResourceTypeData("link_description", e.target.value)
                  }
                />
                {errors["external.link_description"] && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors["external.link_description"]}
                  </p>
                )}
              </FormField>
            </TabsContent>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={processing}>
                Add Resource
              </Button>
            </div>
          </form>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
