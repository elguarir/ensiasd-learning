import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { CourseThread } from "@/types";
import { MessageSquare, Users } from "lucide-react";

interface DiscussionTabProps {
  threads?: CourseThread[];
}

export default function DiscussionTab({ threads = [] }: DiscussionTabProps) {
  const handleCreateThread = () => {
    alert("Create new discussion thread");
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Discussion</h2>
        <Button>New Thread</Button>
      </div>

      {threads.length > 0 ? (
        <div className="space-y-4">
          <p>Thread list will be implemented here</p>
        </div>
      ) : (
        <EmptyState
          title="No discussions yet"
          description="Start a conversation with your instructor and classmates by creating a new discussion thread."
          icons={[MessageSquare, Users]}
          action={{
            label: "Start a discussion",
            onClick: handleCreateThread,
          }}
        />
      )}
    </div>
  );
}
