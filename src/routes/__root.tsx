import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { BookOpenText, Code, School } from "lucide-react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Menu } from "lucide-react";

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="size-full px-4">
        <div className="container mx-auto h-full min-h-dvh border-r border-l border-dashed">
          <div className="mx-auto border-b border-dashed p-4">
            <div className="bg-card flex items-center rounded-lg border p-4 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center">
                <h1 className="text-foreground text-xl font-bold sm:text-2xl">
                  8Sched
                </h1>
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
                <Button variant={"outline"} asChild>
                  <Link to="/student">
                    <BookOpenText className="size-4.5" />
                    <span>Student</span>
                  </Link>
                </Button>
                <Button variant={"outline"} asChild>
                  <Link to="/teacher">
                    <School className="size-4.5" />
                    <span>Teacher</span>
                  </Link>
                </Button>
                <Button variant={"outline"} asChild>
                  <a
                    href="https://github.com/velolib/8sched"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Code className="size-4.5" />
                    <span>Source Code</span>
                  </a>
                </Button>
                <ModeToggle className="hidden md:flex" />
              </div>

              {/* Mobile navigation: Drawer */}
              <div className="ml-auto flex gap-2 md:hidden">
                <Drawer>
                  <DrawerTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Menu className="size-5" />
                      <span className="sr-only">Open navigation</span>
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent className="p-4">
                    <div className="mt-4 flex flex-col gap-2">
                      <Button variant="outline" asChild>
                        <Link to="/student">
                          <BookOpenText className="size-4.5" />
                          <span>Student</span>
                        </Link>
                      </Button>
                      <Button variant="outline" asChild>
                        <Link to="/teacher">
                          <School className="size-4.5" />
                          <span>Teacher</span>
                        </Link>
                      </Button>
                      <Button variant="outline" asChild>
                        <a
                          href="https://github.com/velolib/8sched"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Code className="size-4.5" />
                          <span>Source Code</span>
                        </a>
                      </Button>
                    </div>
                  </DrawerContent>
                </Drawer>
                <ModeToggle className="ml-1" />
              </div>
            </div>
          </div>
          {/* Main content with container padding */}
          <div className="mx-auto h-full p-4">
            <Outlet />
          </div>
        </div>
      </div>
      <TanStackRouterDevtools />
    </>
  ),
});
