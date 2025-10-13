import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_user/")({
  component: Index,
});

type CardLinkProps = {
  href: string;
  title: string;
  description: string;
  external?: boolean;
  className?: string;
};

function CardLink({
  href,
  title,
  description,
  external = false,
  className,
}: CardLinkProps) {
  const Comp = external ? "a" : Link;
  return (
    <Comp
      {...(external ? { href } : { to: href })}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      aria-label={title}
      className={cn(
        "group focus-visible:ring-ring block rounded-[var(--radius-lg)] focus:outline-none focus-visible:ring-2",
        className,
      )}
    >
      <Card className="hover:bg-accent transition-colors p-4">
        <CardHeader className='p-0'>
          <CardTitle className="text-balance">{title}</CardTitle>
          <CardDescription className="text-pretty">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className='p-0'>
          <span className="text-muted-foreground group-hover:text-foreground inline-flex items-center text-sm transition-colors">
            {"Open"}
            <span aria-hidden className="ml-2">
              {"→"}
            </span>
          </span>
        </CardContent>
      </Card>
    </Comp>
  );
}

function Index() {
  return (
    <>
      <Card className="mb-4 gap-0 p-4">
        <h1 className="text-2xl font-semibold tracking-tight text-pretty">
          8Sched
        </h1>
        <p className="text-muted-foreground mt-1 text-base">
          8Sched is a simple web app that compiles my school’s class schedules
          into an easy-to-use website. It lets students and teachers quickly
          check daily timetables, see subject and teacher assignments, and keep
          track of changes when the schedule is updated. The goal is to make
          accessing the school schedule straightforward and convenient for
          everyone.
        </p>
      </Card>
      <section
        aria-label="Primary navigation cards"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        <CardLink
          href="/student"
          title="Student Schedule"
          description="See the student-facing daily schedule, periods, and details."
        />
        <CardLink
          href="/teacher"
          title="Teacher Schedule"
          description="Review teacher schedules and class times in one place."
        />
        <CardLink
          href={"https://forms.gle/EDniF5DhqSox1Kr37"}
          title="Give Feedback"
          description="Found a bug or have an idea? Let us know."
          external
          className="sm:col-span-2"
        />
      </section>
    </>
  );
}
