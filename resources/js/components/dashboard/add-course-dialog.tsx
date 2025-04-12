import { PlusIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

interface Props {
  showText: boolean;
}

function AddCourseDialog(p: Props) {
  return (
    <Dialog>
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
       ): (
        <Button size="icon" className="shrink-0">
                <PlusIcon className="size-4" aria-hidden="true" />
              </Button>
       )}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new course</DialogTitle>
          <DialogDescription>
            Fill in the required information below in order to create a new
            course.
          </DialogDescription>
          <div className="mt-4 min-h-44 rounded-lg bg-gray-100"></div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default AddCourseDialog;
