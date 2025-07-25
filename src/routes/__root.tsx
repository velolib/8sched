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
      <div className="container mx-auto flex h-dvh flex-col px-4 py-4">
        <div className="bg-card mb-2 flex items-center rounded-lg border p-4 shadow-sm md:mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center">
            <h1 className="text-xl font-bold text-zinc-900 sm:text-2xl dark:text-zinc-50">
              8Sched
            </h1>
            <span className="mt-1 text-xs text-zinc-900 sm:ml-2 sm:text-sm dark:text-zinc-50">
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
          </div>
          <ModeToggle className="ml-auto md:ml-2" />
          {/* Mobile navigation: Drawer */}
          <div className="ml-2 flex gap-2 md:hidden">
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
          </div>
        </div>
        <Outlet />
      </div>
      <TanStackRouterDevtools />
    </>
  ),
});
