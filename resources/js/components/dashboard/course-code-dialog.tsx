import { useState } from "react";
import { Course } from "@/types";
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
import { CodeIcon, CopyIcon, MaximizeIcon, MinimizeIcon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
interface CourseCodeDialogProps {
  course: Course;
  children?: React.ReactNode;
}

export default function CourseCodeDialog({ course, children }: CourseCodeDialogProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  
  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(course.code);
    toast.success("Course code copied to clipboard");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm" className="gap-2">
            <CodeIcon className="h-4 w-4" />
            View Code
          </Button>
        )}
      </DialogTrigger>
      <DialogContent 
        className={cn(
          "flex flex-col gap-4",
          isFullscreen && "max-w-full h-screen min-w-screen rounded-none p-8"
        )}
      >
        <DialogHeader>
          <DialogTitle>Course Enrollment Code</DialogTitle>
          <DialogDescription>
            Share this code with your students to allow them to join your course.
          </DialogDescription>
        </DialogHeader>
        <div className="bg-muted/60 border flex-1 h-full flex items-center justify-center p-12 rounded-md">
          <div className="text-center">
            <div className={(cn(
                "text-6xl font-mono font-bold tracking-widest mb-2",
                isFullscreen && "lg:text-8xl"
            ))}>
              {course.code}
            </div>
            <p className="text-muted-foreground text-sm">Course: {course.title}</p>
          </div>
        </div>
        <DialogFooter className="flex flex-row justify-between sm:justify-between">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit fullscreen" : "View fullscreen"}
            className="hidden lg:block"
          >
            {isFullscreen ? (
              <MinimizeIcon className="h-4 w-4" />
            ) : (
              <MaximizeIcon className="h-4 w-4" />
            )}
          </Button>
          
          <Button onClick={copyCodeToClipboard} className="gap-2">
            <CopyIcon className="h-4 w-4" />
            Copy Code
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}