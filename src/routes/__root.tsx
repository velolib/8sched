import { ModeToggle } from '@/components/mode-toggle'
import { Button } from '@/components/ui/button'
import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { BookOpenText, Code, School } from 'lucide-react'

export const Route = createRootRoute({
  component: () => (
    <>
      <div className='container mx-auto flex h-dvh flex-col py-4 px-8'>
        <div className="mb-4 flex items-center bg-card p-4 border rounded-lg shadow-sm">
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
          <div className="flex ml-auto gap-2">
            <Button
              variant={"outline"}
              className="ml-auto hidden md:flex"
              asChild
            >
              <Link to="/student">
                <BookOpenText className="size-4" />
                <span>Student</span>
              </Link>
            </Button>
            <Button
              variant={"outline"}
              className="hidden md:flex"
              asChild
            >
              <Link to="/teacher">
                <School className="size-4" />
                <span>Teacher</span>
              </Link>
            </Button>
            <Button variant={"outline"} className="hidden md:flex" asChild>
              <a
                href="https://github.com/velolib/8sched"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Code className="size-4" />
                <span>Source Code</span>
              </a>
            </Button>
          </div>
          <Button
            variant={"outline"}
            className="ml-auto flex items-center justify-center md:hidden"
            size="icon"
          >
            <a
              href="https://github.com/velolib/8sched"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
            >
              <Code className="size-4" />
            </a>
          </Button>
          <ModeToggle className="ml-2" />
        </div>
        <Outlet />
      </div>
      <TanStackRouterDevtools />
    </>
  ),
})