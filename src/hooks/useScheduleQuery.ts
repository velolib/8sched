import { Schedule } from "@/types/schedule";
import { useSuspenseQuery } from "@tanstack/react-query";

export function useScheduleQuery() {
  return useSuspenseQuery({
    queryKey: ["schedule-data"],
    queryFn: async () => {
      const res = await fetch("/api/schedules");
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json() as Promise<Schedule[]>;
    },
  });
}
