import { createLazyFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  MetricsCards,
  type SummaryResponse,
} from "@/components/admin/metrics-cards";
import { Card } from "@/components/ui/card";

export const Route = createLazyFileRoute("/admin/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data, isLoading, error } = useQuery<SummaryResponse>({
    queryKey: ["admin-summary"],
    queryFn: async () => {
      const res = await fetch("/api/summary");
      if (!res.ok) {
        throw new Error("Failed to fetch summary");
      }
      return res.json();
    },
  });

  return (
    <>
      <Card className="mb-4 gap-0 p-4">
        <h1 className="text-2xl font-semibold tracking-tight text-pretty">
          Admin Overview
        </h1>
        <p className="text-muted-foreground mt-1">Key metrics</p>
      </Card>
      <MetricsCards
        data={data}
        isLoading={isLoading}
        error={error as Error | null}
      />
    </>
  );
}
