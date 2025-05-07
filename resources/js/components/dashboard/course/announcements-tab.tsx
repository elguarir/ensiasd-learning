import { EmptyState } from "@/components/empty-state";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Announcement, Course } from "@/types";
import { formatRelativeTime, getInitials } from "@/utils/course-utils";
import { Info, MessageSquare, Send } from "lucide-react";
import { useState } from "react";

interface AnnouncementsTabProps {
  announcements: Announcement[];
  instructor?: Course["instructor"];
}

export default function AnnouncementsTab({
  announcements,
}: AnnouncementsTabProps) {
  return (
    <div className="grid grid-cols-1 gap-6">
      <h2 className="text-xl font-bold">Announcements</h2>

      {announcements.length > 0 ? (
        <div className="space-y-8">
          {announcements.map((announcement) => (
            <AnnouncementCard
              key={announcement.id}
              announcement={announcement}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No announcements yet"
          description="There are no announcements for this course yet. Check back later for updates from your instructor."
          icons={[Info, MessageSquare]}
        />
      )}
    </div>
  );
}

function AnnouncementCard({ announcement }: { announcement: Announcement }) {
  const [comment, setComment] = useState("");
  const announcer = announcement.user;

  const handlePostComment = () => {
    if (!comment.trim()) return;
    alert(`Comment posted: ${comment}`);
    setComment("");
  };

  return (
    <Card className="overflow-hidden py-0">
      <div className="border-l-[6px] border-blue-500 pt-4 dark:border-blue-400">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={announcer?.avatar || undefined}
                alt={announcer?.name}
              />
              <AvatarFallback>
                {getInitials(announcer?.name || "")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="mb-0.5 text-base font-medium">{announcer?.name}</p>
              <p className="text-muted-foreground text-xs">
                Posted {formatRelativeTime(announcement.created_at)}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-base leading-relaxed whitespace-pre-line">
            {announcement.content}
          </p>
        </CardContent>

        {/* Comments section */}
        <div className="border-t border-neutral-200 dark:border-neutral-800">
          <div className="bg-neutral-50 p-4 dark:bg-neutral-900/30">
            <h4 className="mb-3 flex items-center gap-1.5 text-sm font-medium">
              <MessageSquare className="h-4 w-4" />
              Comments ({announcement.comments?.length || 0})
            </h4>

            {announcement.comments && announcement.comments.length > 0 ? (
              <div className="mb-4 space-y-4">
                {announcement.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={comment.user.avatar || undefined}
                        alt={comment.user.name}
                      />
                      <AvatarFallback>
                        {getInitials(comment.user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 rounded-lg bg-white p-3 shadow-sm dark:bg-neutral-800">
                      <div className="mb-1 flex items-center justify-between">
                        <p className="text-sm font-medium">
                          {comment.user.name}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {formatRelativeTime(comment.created_at)}
                        </p>
                      </div>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground mb-4 text-sm">
                No comments yet. Be the first to comment!
              </p>
            )}

            {/* Add comment form */}
            <div className="mt-4 flex w-full max-w-full gap-4">
              <Avatar className="h-10 w-10">
                <AvatarFallback>ST</AvatarFallback>
              </Avatar>
              <div className="flex flex-1 gap-2">
                <div className="flex-1">
                  <Input
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="h-10"
                  />
                </div>
                <Button
                  onClick={handlePostComment}
                  size="icon"
                  className="h-10 w-10"
                  variant="secondary"
                  disabled={!comment.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
