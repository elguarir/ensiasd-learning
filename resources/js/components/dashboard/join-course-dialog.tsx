import { cn } from "@/lib/utils";
import { useForm } from "@inertiajs/react";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PasteIcon } from "../icons";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { Label } from "../ui/label";
import { Spinner } from "../ui/spinner";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
interface Props {
  showText?: boolean;
}

export function JoinCourseDialog({ showText = true }: Props) {
  const { data, setData, post, processing, reset } = useForm({
    code: "",
  });

  const [open, setOpen] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    post(route("courses.join"), {
      onSuccess: () => {
        toast.success("Course joined successfully");
        setOpen(false);
        reset();
      },
      onError: (error) => {
        toast.error(error[0]);
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          {showText && "Join Course"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Join a Course</DialogTitle>
            <DialogDescription>
              Enter the course code to join a course. You can get this from your
              instructor.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-4">
              <Label htmlFor="courseCode">Course Code</Label>
              <div className="flex w-full items-center justify-between gap-1.5">
                <InputOTP
                  maxLength={6}
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  autoFocus={false}
                  value={data.code}
                  onChange={(value) => setData("code", value)}
                >
                  <InputOTPGroup>
                    <InputOTPSlot className="size-10 sm:size-12" index={0} />
                    <InputOTPSlot className="size-10 sm:size-12" index={1} />
                    <InputOTPSlot className="size-10 sm:size-12" index={2} />
                    <InputOTPSlot className="size-10 sm:size-12" index={3} />
                    <InputOTPSlot className="size-10 sm:size-12" index={4} />
                    <InputOTPSlot className="size-10 sm:size-12" index={5} />
                  </InputOTPGroup>
                </InputOTP>
                <div className="flex items-center gap-1.5">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="size-10 sm:size-12"
                        type="button"
                        onClick={() => {
                          navigator.clipboard
                            .readText()
                            .then((text) => {
                              console.log(text);
                            })
                            .catch((err) => {
                              toast.error(
                                "Make sure you gave access to the clipboard",
                              );
                            });
                        }}
                      >
                        <PasteIcon className="text-muted-foreground size-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Paste code</TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={processing} className="relative">
              {processing && (
                <div className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
                  <Spinner size="sm" />
                </div>
              )}
              <span className={cn({ invisible: processing })}>Join Course</span>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
