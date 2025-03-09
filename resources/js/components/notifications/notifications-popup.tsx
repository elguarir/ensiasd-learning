import { Bell } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

type Props = {};

function NotificationsPopup({}: Props) {
  return (
    <Popover>
      <PopoverTrigger>
        <div className="relative">
          <Button variant="ghost" size="icon">
            <Bell className="size-4" />
          </Button>
          <span className="absolute top-2 right-2 size-1 rounded-full bg-red-500" />
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-[calc(100vw-50px)] max-w-[330px] px-0 pt-px shadow-sm"
        align="end"
        sideOffset={10}
      >
        <div className="flex h-[300px] max-h-[calc(100dvh-300px)] w-full flex-col space-y-1">
          <div className="flex items-center justify-between border-b py-1 pr-2 pl-3">
            <h3 className="text-sm font-medium">Notifications</h3>
            <Button variant="ghost" size="sm" className="text-xs">
              Mark all as read
            </Button>
          </div>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="text-foreground h-auto w-full justify-start gap-2 rounded-none border-b bg-transparent px-1 pt-px">
              <TabsTrigger
                value="all"
                className="text-muted-foreground hover:bg-accent hover:text-foreground data-[state=active]:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                value="messages"
                className="text-muted-foreground hover:bg-accent hover:text-foreground data-[state=active]:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Messages
              </TabsTrigger>
              <TabsTrigger
                value="assignments"
                className="text-muted-foreground hover:bg-accent hover:text-foreground data-[state=active]:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Assignments
              </TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <div className="space-y-2 p-2">
                <p className="text-muted-foreground text-xs">
                  You have 3 new notifications
                </p>
                <div className="hover:bg-accent/50 cursor-pointer rounded border p-2 text-sm">
                  <p className="font-medium">New message from John Smith</p>
                  <p className="text-muted-foreground text-xs">
                    10 minutes ago
                  </p>
                </div>
                <div className="hover:bg-accent/50 cursor-pointer rounded border p-2 text-sm">
                  <p className="font-medium">
                    Assignment "Physics Lab" due soon
                  </p>
                  <p className="text-muted-foreground text-xs">1 hour ago</p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="messages">
              <div className="space-y-2 p-2">
                <p className="text-muted-foreground text-xs">
                  You have 1 unread message
                </p>
                <div className="hover:bg-accent/50 cursor-pointer rounded border p-2 text-sm">
                  <p className="font-medium">New message from John Smith</p>
                  <p className="text-muted-foreground text-xs">
                    10 minutes ago
                  </p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="assignments">
              <div className="space-y-2 p-2">
                <p className="text-muted-foreground text-xs">
                  You have 2 upcoming assignments
                </p>
                <div className="hover:bg-accent/50 cursor-pointer rounded border p-2 text-sm">
                  <p className="font-medium">
                    Assignment "Physics Lab" due soon
                  </p>
                  <p className="text-muted-foreground text-xs">Due in 2 days</p>
                </div>
                <div className="hover:bg-accent/50 cursor-pointer rounded border p-2 text-sm">
                  <p className="font-medium">
                    New assignment "Math Quiz" posted
                  </p>
                  <p className="text-muted-foreground text-xs">Due next week</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default NotificationsPopup;
