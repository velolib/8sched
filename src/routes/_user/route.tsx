import { createFileRoute } from "@tanstack/react-router";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Link, Outlet } from "@tanstack/react-router";
import {
  BookOpenText,
  Code,
  MessageCircle,
  School,
  ShieldUser,
} from "lucide-react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Menu } from "lucide-react";
import { ErrorMessage } from "@/components/error-message";

// Navigation buttons component
const NavButtons = () => (
  <>
    <Button asChild>
      <Link to="/student">
        <BookOpenText className="size-4.5" />
        <span>Student</span>
      </Link>
    </Button>
    <Button asChild>
      <Link to="/teacher">
        <School className="size-4.5" />
        <span>Teacher</span>
      </Link>
    </Button>
    <Button asChild>
      <Link to="/admin">
        <ShieldUser className="size-4.5" />
        <span>Admin</span>
      </Link>
    </Button>
    <Button asChild>
      <a
        href="https://forms.gle/EDniF5DhqSox1Kr37"
        target="_blank"
        rel="noopener noreferrer"
      >
        <MessageCircle className="size-4.5" />
        <span>Feedback</span>
      </a>
    </Button>
    <Button className="flex md:hidden lg:flex" asChild>
      <a
        href="https://github.com/velolib/8sched"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Code className="size-4.5" />
        <span>Source Code</span>
      </a>
    </Button>
    <Button size={"icon"} className="hidden md:flex lg:hidden" asChild>
      <a
        href="https://github.com/velolib/8sched"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Code className="size-4.5" />
      </a>
    </Button>
  </>
);

export const Route = createFileRoute("/_user")({
  component: RouteComponent,
  errorComponent: ({ error }) => (
    <RouteComponent>
      <ErrorMessage
        message={error.message ? error.message : "An unknown error occured."}
      />
    </RouteComponent>
  ),
});

type RouteComponentProps = {
  children?: React.ReactNode;
};

function RouteComponent({ children }: RouteComponentProps) {
  return (
    <div className="size-full px-4">
      <div className="container mx-auto h-full min-h-dvh border-r border-l border-dashed">
        <div className="mx-auto border-b border-dashed p-4">
          <div className="bg-card flex items-center rounded-lg border p-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center">
              <Link
                to="/"
                className="text-foreground text-xl font-bold hover:underline sm:text-2xl"
              >
                8Sched
              </Link>
              <span className="text-foreground mt-1 text-xs sm:ml-2 sm:text-sm">
                by{" "}
                <a
                  href="https://velolib.github.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  malik
                </a>
              </span>
            </div>
            <div className="ml-auto hidden gap-2 md:flex">
              <NavButtons />
              <ModeToggle className="hidden md:flex" />
            </div>
            {/* Mobile navigation: Drawer */}
            <div className="ml-auto flex gap-2 md:hidden">
              <Drawer>
                <DrawerTrigger asChild>
                  <Button size="icon">
                    <Menu className="size-4.5" />
                    <span className="sr-only">Open navigation</span>
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="p-4">
                  <div className="mt-4 flex flex-col gap-2">
                    <NavButtons />
                  </div>
                </DrawerContent>
              </Drawer>
              <ModeToggle className="ml-1" />
            </div>
          </div>
        </div>
        {/* Main content with container padding */}
        <div className="mx-auto h-full p-4">{children || <Outlet />}</div>
      </div>
    </div>
  );
}
