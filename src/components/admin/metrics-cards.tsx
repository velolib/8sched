import { Spinner } from "@/components/ui/spinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export type SummaryResponse = {
  teachersCount: number;
  scheduleSlotsCount: number;
  scheduleConflictsCount: number;
  subjectsCoveredCount: number;
};

type MetricsCardsProps = {
  data: SummaryResponse | undefined;
  isLoading: boolean;
  error: Error | null;
};

export function MetricsCards({ data, isLoading, error }: MetricsCardsProps) {
  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Schedule Slots"
        value={data?.scheduleSlotsCount.toLocaleString() ?? "—"}
        description="Total number of schedule slots"
        isLoading={isLoading}
        error={error}
      >
        <CardFooter className="pt-0 p-0">
          <Button asChild variant="link" className="px-0">
            <Link to="/admin/schedules">View schedules</Link>
          </Button>
        </CardFooter>
      </MetricCard>

      <MetricCard
        title="Teachers"
        value={data?.teachersCount.toLocaleString() ?? "—"}
        description="Total number of teachers"
        isLoading={isLoading}
        error={error}
      >
        <CardFooter className="pt-0 p-0">
          <Button asChild variant="link" className="px-0">
            <Link to="/admin/teachers">View teachers</Link>
          </Button>
        </CardFooter>
      </MetricCard>

      <MetricCard
        title="Schedule Conflicts"
        value={data?.scheduleConflictsCount.toLocaleString() ?? "—"}
        description="Detected overlapping or invalid assignments"
        isLoading={isLoading}
        error={error}
      />

      <MetricCard
        title="Subjects Covered"
        value={data?.subjectsCoveredCount.toLocaleString() ?? "—"}
        description="Unique subjects assigned to teachers"
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}

function MetricCard({
  title,
  value,
  description,
  children,
  isLoading,
  error,
}: {
  title: string;
  value: string;
  description: string;
  children?: React.ReactNode;
  isLoading: boolean;
  error: Error | null;
}) {
  return (
    <Card className='p-4'>
      <CardHeader className="pb-3 p-0">
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription className="sr-only">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0 p-0">
        <div className="flex h-10 items-center text-3xl font-semibold tracking-tight">
          {isLoading ? <Spinner className="size-6" /> : error ? "Error" : value}
        </div>
        <p className="text-muted-foreground mt-1 text-sm">
          {isLoading ? "Loading..." : description}
        </p>
      </CardContent>
      {children}
    </Card>
  );
}
