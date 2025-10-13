import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Toaster } from "@/components/ui/sonner";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useLocalStorage } from "@uidotdev/usehooks";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const [firstTime, setFirstTime] = useLocalStorage("firstTime", true);

  return (
    <>
      <Dialog open={firstTime} onOpenChange={() => setFirstTime(false)}>
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
      </Dialog>
      <Outlet />
      <Toaster position="top-center" />
      <TanStackRouterDevtools />
    </>
  );
}
