import { useForm } from "@inertiajs/react";
import { ImageIcon, PlusIcon, Trash2, X } from "lucide-react";
import { useState } from "react";
import { useImageUpload } from "../../hooks/use-image-upload";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

interface Props {
  showText: boolean;
}

function AddCourseDialog(p: Props) {
  const [open, setOpen] = useState(false);
  const { data, setData, post, processing, errors, reset } = useForm({
    title: "",
    description: "",
    image: "",
    color: "#4DAB9A",
    category: "",
  });

  const {
    previewUrl,
    fileName,
    fileInputRef,
    handleThumbnailClick,
    handleFileChange,
    handleRemove,
  } = useImageUpload({
    onUpload: (url) => setData("image", url),
  });

  const colors = [
    { name: "Gray", value: "#9B9A97" },
    { name: "Brown", value: "#64473A" },
    { name: "Orange", value: "#D9730D" },
    { name: "Yellow", value: "#DFAB01" },
    { name: "Green", value: "#0F7B6C" },
    { name: "Blue", value: "#0B6E99" },
    { name: "Purple", value: "#6940A5" },
    { name: "Pink", value: "#AD1A72" },
    { name: "Red", value: "#E03E3E" },
  ];

  const categories = [
    "Programming",
    "Design",
    "Business",
    "Marketing",
    "Science",
    "Math",
    "Language",
    "Other",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route("courses.store"), {
      onSuccess: () => {
        reset();
        setOpen(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {p.showText ? (
          <Button className="ml-auto">
            <PlusIcon
              className="-ms-1 opacity-60"
              size={16}
              aria-hidden="true"
            />
            Add course
          </Button>
        ) : (
          <Button size="icon" className="shrink-0">
            <PlusIcon className="size-4" aria-hidden="true" />
          </Button>
        )}
      </DialogTrigger>

      <DialogContent
        showCloseButton={false}
        className="max-w-md border-none p-0"
      >
        <DialogTitle className="sr-only">Create Course</DialogTitle>
        <form onSubmit={handleSubmit} className="overflow-hidden rounded-lg">
          <div
            className="relative flex h-[180px] w-full flex-col items-start justify-end rounded-t-lg p-4"
            style={{
              backgroundColor: data.color,
              backgroundImage: previewUrl
                ? `url(${previewUrl})`
                : data.image
                  ? `url(${data.image})`
                  : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
              boxShadow:
                previewUrl || data.image
                  ? "inset 0 0 0 2000px rgba(0, 0, 0, 0.4)"
                  : "none",
            }}
          >
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                type="button"
                className="rounded-full bg-white/20 p-1 hover:bg-white/30"
                onClick={handleThumbnailClick}
                title="Upload image"
              >
                <ImageIcon className="size-4 text-white" />
              </button>
              {(previewUrl || data.image) && (
                <button
                  type="button"
                  className="rounded-full bg-white/20 p-1 hover:bg-white/30"
                  onClick={() => {
                    handleRemove();
                    setData("image", "");
                  }}
                  title="Remove image"
                >
                  <Trash2 className="size-4 text-white" />
                </button>
              )}
              <button
                type="button"
                className="rounded-full bg-white/20 p-1 hover:bg-white/30"
                onClick={() => setOpen(false)}
              >
                <X className="size-4 text-white" />
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />

            <input
              type="text"
              className="w-full bg-transparent text-3xl font-bold text-white placeholder-white/70 focus:outline-none"
              placeholder="Course title"
              value={data.title}
              onChange={(e) => setData("title", e.target.value)}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-white">{errors.title}</p>
            )}
          </div>

          <div className="space-y-4 p-4">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Description
              </label>
              <Textarea
                placeholder="Course description"
                className="w-full resize-none"
                rows={3}
                value={data.description}
                onChange={(e) => setData("description", e.target.value)}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.description}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Category</label>
              <Select
                value={data.category}
                onValueChange={(value) => setData("category", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-500">{errors.category}</p>
              )}
            </div>

            <div className="hidden">
              <div className="flex gap-2">
                <Input
                  type="hidden"
                  value={data.image}
                  onChange={(e) => setData("image", e.target.value)}
                  disabled={!!previewUrl}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Color</label>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    className={`h-8 w-8 rounded-full ${data.color === color.value ? "ring-primary ring-2 ring-offset-2" : ""}`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => setData("color", color.value)}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={processing}>
                Create Course
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddCourseDialog;
