import { Teacher } from "@/types/schedule";
import { useSuspenseQuery } from "@tanstack/react-query";

export function useTeacherQuery() {
  return useSuspenseQuery({
    queryKey: ["teacher-data"],
    queryFn: async () => {
      const res = await fetch("/api/teachers");
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json() as Promise<Teacher[]>;
    },
  });
}
