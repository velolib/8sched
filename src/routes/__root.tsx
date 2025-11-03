import { Toaster } from "@/components/ui/sonner";
import { createRootRoute, HeadContent, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
  component: RootComponent,
  head: () => ({
    meta: [
      {
        name: "description",
        content: "A simple web app that compiles SMA Negeri 8 Jakarta's class schedules into an easy-to-use website. Quickly check daily timetables, see subject and teacher assignments, and keep track of schedule updates — all in one place."
      },
      {
        name: "keywords",
        content: "8Sched, SMA Negeri 8 Jakarta, class schedules, timetables, school schedule, teacher assignments, schedule updates, 8sched",
      },
      {
        name: "author",
        content: "velolib",
      },
      {
        title: "8Sched by malik"
      }
    ]
  })
});

function RootComponent() {
  // const [firstTime, setFirstTime] = useLocalStorage("firstTime", true);

  return (
    <>
      {/* <Dialog open={firstTime} onOpenChange={() => setFirstTime(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Welcome to 8Sched 1.0.0!</DialogTitle>
            <DialogDescription>
              Thank you for trying out 8Sched! This is the first feature
              complete release of the app, so please expect some bugs and rough
              edges.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setFirstTime(false)}>Got it!</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
      <HeadContent/>
      <Outlet />
      <Toaster position="top-center" />
      <TanStackRouterDevtools />
    </>
  );
}
