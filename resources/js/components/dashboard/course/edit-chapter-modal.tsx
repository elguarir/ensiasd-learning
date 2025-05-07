import { useForm } from "@inertiajs/react";
import { useEffect } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Chapter } from "@/types";

interface EditChapterModalProps {
  chapter: Chapter;
  isOpen: boolean;
  onClose: () => void;
  onChapterUpdated?: () => void;
}

export function EditChapterModal({
  chapter,
  isOpen,
  onClose,
  onChapterUpdated,
}: EditChapterModalProps) {
  const { data, setData, put, processing, errors, reset } = useForm({
    title: chapter.title || "",
    description: chapter.description || "",
  });

  // Reset form data when chapter changes
  useEffect(() => {
    if (isOpen) {
      setData({
        title: chapter.title || "",
        description: chapter.description || "",
      });
    }
  }, [chapter, isOpen, setData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    put(route("chapters.update", chapter.id), {
      preserveScroll: true,
      onError: () => {
        toast.error("Failed to update chapter");
      },
      onSuccess: () => {
        onClose();
        toast.success("Chapter updated successfully");
        if (onChapterUpdated) {
          onChapterUpdated();
        }
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Chapter</DialogTitle>
          <DialogDescription>
            Update the details of this chapter
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="edit-title"
              className="mb-1 block text-sm font-medium"
            >
              Chapter Title
            </label>
            <Input
              id="edit-title"
              placeholder="Enter chapter title"
              value={data.title}
              onChange={(e) => setData("title", e.target.value)}
              required
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="edit-description"
              className="mb-1 block text-sm font-medium"
            >
              Description (Optional)
            </label>
            <Textarea
              id="edit-description"
              placeholder="Enter chapter description"
              value={data.description}
              onChange={(e) => setData("description", e.target.value)}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={processing}>
              {processing ? "Updating..." : "Update Chapter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditChapterModal;
