import { useForm } from "@inertiajs/react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { FileUploader } from "@/components/ui/file-uploader";
import { DatePicker } from "@/components/ui/date-picker";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QuizBuilder } from "@/components/quiz-builder";
import { PlusCircle } from "lucide-react";
import { Course } from "@/types";

interface CreateAssignmentDialogProps {
  course: Course;
}

interface QuizQuestion {
  question: string;
  points?: number;
  options: {
    text: string;
    is_correct: boolean;
  }[];
}

interface AssignmentFormData {
  title: string;
  description: string;
  instructions: string;
  type: "file" | "quiz";
  due_date: string;
  points_possible: number;
  allow_late_submissions: boolean;
  late_penalty_percentage: number;
  available_from: string;
  available_until: string;
  published: boolean;
  attachments: File[];
  questions: QuizQuestion[];
}

export function CreateAssignmentDialog({ course }: CreateAssignmentDialogProps) {
  const [open, setOpen] = useState(false);
  
  const { data, setData, post, processing, errors, reset } = useForm({
    title: "",
    description: "",
    instructions: "",
    type: "file",
    due_date: "",
    points_possible: 100,
    allow_late_submissions: false as boolean,
    late_penalty_percentage: 0,
    available_from: "",
    available_until: "",
    published: false as boolean,
    attachments: [] as File[],
    questions: [] as any[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    post(route("courses.assignments.store", course.id), {
      preserveScroll: true,
      forceFormData: true,
      onError: () => {
        toast.error("Failed to create assignment");
      },
      onSuccess: () => {
        reset();
        setOpen(false);
        toast.success("Assignment created successfully");
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Assignment
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Assignment</DialogTitle>
          <DialogDescription>
            Create a new assignment for your students
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={data.title as string}
                onChange={(e) => setData("title", e.target.value)}
                placeholder="Assignment title"
                required
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500">{errors.title}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={data.description as string}
                onChange={(e) => setData("description", e.target.value)}
                placeholder="Brief description of the assignment"
                rows={3}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">{errors.description}</p>
              )}
            </div>

            <div>
              <Label htmlFor="type">Assignment Type</Label>
              <Select
                value={data.type as string}
                onValueChange={(value: "file" | "quiz") => setData("type", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="file">File Submission</SelectItem>
                  <SelectItem value="quiz">Quiz</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Instructions */}
          <div>
            <Label>Instructions</Label>
            <RichTextEditor
              content={data.instructions as string}
              onChange={(content) => setData("instructions", content)}
              className="min-h-[200px]"
            />
            {errors.instructions && (
              <p className="mt-1 text-sm text-red-500">{errors.instructions}</p>
            )}
          </div>

          {/* Attachments */}
          <div>
            <Label>Attachments (Optional)</Label>
            <FileUploader
              value={data.attachments as File[]}
              onChange={(files) => setData("attachments", files)}
              maxFiles={5}
              maxSize={10 * 1024 * 1024}
              accept={["*"]}
              uploadText="Drag files here or click to upload"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Add any supplementary materials for the assignment
            </p>
          </div>

          {/* Quiz Questions (if quiz type) */}
          {data.type === "quiz" && (
            <div>
              <Label>Quiz Questions</Label>
              <QuizBuilder
                questions={data.questions}
                onChange={(questions) => setData("questions", questions)}
                setView={() => {}} // Not needed here
              />
            </div>
          )}

          {/* Settings */}
          <div className="space-y-4 rounded-lg border p-4">
            <h3 className="font-medium">Assignment Settings</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="points">Points Possible</Label>
                <Input
                  id="points"
                  type="number"
                  min="0"
                  value={data.points_possible as number}
                  onChange={(e) => setData("points_possible", parseInt(e.target.value))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="due_date">Due Date</Label>
                <DatePicker
                  value={data.due_date as string}
                  onChange={(date) => setData("due_date", date?.toISOString() || "")}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="late-submissions">Allow Late Submissions</Label>
                <p className="text-sm text-muted-foreground">
                  Students can submit after the due date
                </p>
              </div>
              <Switch
                id="late-submissions"
                checked={data.allow_late_submissions as boolean}
                onCheckedChange={(checked) => setData("allow_late_submissions", checked)}
              />
            </div>

            {data.allow_late_submissions && (
              <div>
                <Label htmlFor="penalty">Late Penalty (%)</Label>
                <Input
                  id="penalty"
                  type="number"
                  min="0"
                  max="100"
                  value={data.late_penalty_percentage as number}
                  onChange={(e) => setData("late_penalty_percentage", parseInt(e.target.value))}
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="available_from">Available From</Label>
                <DatePicker
                  value={data.available_from as string}
                  onChange={(date) => setData("available_from", date?.toISOString() || "")}
                />
              </div>

              <div>
                <Label htmlFor="available_until">Available Until</Label>
                <DatePicker
                  value={data.available_until as string}
                  onChange={(date) => setData("available_until", date?.toISOString() || "")}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="published">Publish Immediately</Label>
                <p className="text-sm text-muted-foreground">
                  Make assignment visible to students
                </p>
              </div>
              <Switch
                id="published"
                checked={data.published as boolean}
                onCheckedChange={(checked) => setData("published", checked)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={processing}>
              Create Assignment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
