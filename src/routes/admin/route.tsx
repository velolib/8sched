import {
  createFileRoute,
  redirect,
  useNavigate,
  Outlet,
} from "@tanstack/react-router";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { CalendarClock, Code, LogOut, ShieldUser, User } from "lucide-react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Menu } from "lucide-react";
import { ErrorMessage } from "@/components/error-message";

// Navigation buttons component
const NavButtons = ({ onLogout }: { onLogout: () => void }) => (
  <>
    <Button asChild>
      <Link to="/admin">
        <ShieldUser className="size-4.5" />
        <span>Admin</span>
      </Link>
    </Button>
    <Button asChild>
      <Link to="/admin/schedules">
        <CalendarClock className="size-4.5" />
        <span>Schedules</span>
      </Link>
    </Button>
    <Button asChild>
      <Link to="/admin/teachers">
        <User className="size-4.5" />
        <span>Teachers</span>
      </Link>
    </Button>
    <Button onClick={onLogout} className="cursor-pointer">
      <LogOut className="size-4.5" />
      <span>Log Out</span>
    </Button>
    <ModeToggle className="hidden md:flex" />
  </>
);

function AdminErrorComponent(props: { error: Error }) {
  const navigate = useNavigate();
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    navigate({ to: "/student" });
  };

  return (
    <AdminLayout onLogout={handleLogout}>
      <ErrorMessage
        message={
          props.error.message
            ? props.error.message
            : "An unknown error occured."
        }
      />
    </AdminLayout>
  );
}

export const Route = createFileRoute("/admin")({
  loader: async () => {
    const response = await fetch("/api/auth/status");
    if (!response.ok) {
      throw new Error("Failed to check auth status");
    }

    const data = await response.json();
    if (!data.loggedIn) {
      throw redirect({ to: "/login" });
    }
    return data;
  },
  component: AdminComponent,
  errorComponent: AdminErrorComponent,
});

type AdminLayoutProps = {
  children: React.ReactNode;
  onLogout: () => void;
};

function AdminLayout({ children, onLogout }: AdminLayoutProps) {
  return (
    <>
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
                <NavButtons onLogout={onLogout} />
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
                      <NavButtons onLogout={onLogout} />
                      <Button asChild>
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
          <div className="mx-auto h-full p-4">{children}</div>
        </div>
      </div>
      <TanStackRouterDevtools />
    </>
  );
}

function AdminComponent() {
  const navigate = useNavigate();
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    navigate({ to: "/student" });
  };

  return (
    <AdminLayout onLogout={handleLogout}>
      <Outlet />
    </AdminLayout>
  );
}
