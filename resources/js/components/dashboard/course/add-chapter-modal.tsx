import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "@inertiajs/react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle } from "lucide-react";

interface AddChapterModalProps {
  courseId: number;
  onChapterAdded?: () => void;
}

export function AddChapterModal({ courseId, onChapterAdded }: AddChapterModalProps) {
  const [open, setOpen] = useState(false);
  
  const { data, setData, post, processing, errors, reset } = useForm({
    title: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    post(route("courses.chapters.store", courseId), {
      preserveScroll: true,
      onError: () => {
        toast.error("Failed to add chapter");
      },
      onSuccess: () => {
        reset();
        setOpen(false);
        toast.success("Chapter added successfully");
        if (onChapterAdded) {
          onChapterAdded();
        }
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Chapter
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Chapter</DialogTitle>
          <DialogDescription>
            Create a new chapter for your course content
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="mb-1 block text-sm font-medium">
              Chapter Title
            </label>
            <Input
              id="title"
              placeholder="Enter chapter title"
              value={data.title}
              onChange={(e) => setData("title", e.target.value)}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="mb-1 block text-sm font-medium">
              Description (Optional)
            </label>
            <Textarea
              id="description"
              placeholder="Enter chapter description"
              value={data.description}
              onChange={(e) => setData("description", e.target.value)}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description}</p>
            )}
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
              {processing ? "Adding..." : "Add Chapter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 