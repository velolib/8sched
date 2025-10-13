import { classes } from "@/lib/consts";
import { Schedule, Teacher } from "@/types/schedule";
import { Button } from "../ui/button";
import { checkIfTeacherCode } from "@/lib/utils";
import { memo, useMemo } from "react";

export type SchedulesTableProps = {
  schedules: Schedule[];
  handleCellClick: (schedule: Schedule) => void;
  originalSchedulesCodes: Record<number, string>;
  isPending: boolean;
  teachers: Teacher[];
};

function groupSchedulesByTimeSlot(schedules: Schedule[]) {
  return schedules.reduce<Record<string, Schedule[]>>((acc, sched) => {
    (acc[sched.time_slot] ||= []).push(sched);
    return acc;
  }, {});
}

function getPeriodMap(
  timeSlots: string[],
  grouped: Record<string, Schedule[]>,
) {
  let period = 1;
  const map: Record<string, number | null> = {};
  for (const slot of timeSlots) {
    const hasTeacherCode = grouped[slot].some((s) =>
      checkIfTeacherCode(s.teacher_code),
    );
    map[slot] = hasTeacherCode ? period++ : null;
  }
  return map;
}

function getTeacherCodeCounts(schedules: Schedule[]) {
  const counts: Record<string, number> = {};
  for (const s of schedules) {
    if (checkIfTeacherCode(s.teacher_code)) {
      counts[s.teacher_code] = (counts[s.teacher_code] || 0) + 1;
    }
  }
  return counts;
}

type ButtonVariant =
  | "outline"
  | "destructive"
  | "secondary"
  | "link"
  | "default"
  | "ghost"
  | null
  | undefined;

function getButtonProps(
  found: Schedule | undefined,
  codeCounts: Record<string, number>,
  originalSchedulesCodes: Record<number, string>,
  teachers: Teacher[],
  isPending: boolean,
): {
  label: string;
  variant: ButtonVariant;
  disabled: boolean;
  isChanged: boolean;
} {
  if (!found)
    return { label: "-", variant: "outline", disabled: true, isChanged: false };
  const isTeacherCode = checkIfTeacherCode(found.teacher_code);
  const isConflict =
    isTeacherCode &&
    codeCounts[found.teacher_code] > 1 &&
    found.teacher_code !== "Z0";
  const isChanged = Boolean(
    found.id &&
      originalSchedulesCodes[found.id] !== undefined &&
      found.teacher_code !== originalSchedulesCodes[found.id],
  );
  let variant: ButtonVariant = "outline";
  let label: string;
  if (found.teacher_code == null) {
    variant = "destructive";
    label = "NULL";
  } else if (found.teacher_code === "Z0") {
    label = "Empty";
  } else if (isTeacherCode) {
    variant = isConflict ? "destructive" : "outline";
    label = found.teacher_code;
  } else {
    label =
      teachers.find((t) => t.code === found.teacher_code)?.name ??
      found.teacher_code;
  }
  const disabled = (found.teacher_code != null && !isTeacherCode) || isPending;
  return { label, variant, disabled, isChanged };
}

export const SchedulesTable = memo(function SchedulesTable({
  schedules,
  handleCellClick,
  originalSchedulesCodes,
  isPending,
  teachers,
}: SchedulesTableProps) {
  const grouped = useMemo(
    () => groupSchedulesByTimeSlot(schedules),
    [schedules],
  );
  const timeSlots = useMemo(() => Object.keys(grouped).sort(), [grouped]);
  const periodMap = useMemo(
    () => getPeriodMap(timeSlots, grouped),
    [timeSlots, grouped],
  );

  return (
    <div className="relative w-full overflow-x-auto rounded-md border">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-muted">
            <th className="bg-muted left-0 min-w-[96px] px-4 py-2 text-left text-xs md:sticky md:z-10">
              Period
            </th>
            <th className="bg-muted left-[96px] min-w-[96px] border-r px-4 py-2 text-left text-xs md:sticky md:z-10">
              Time
            </th>
            {classes.map((cls) => (
              <th
                key={cls}
                className="text-muted-foreground min-w-[120px] px-4 py-2 text-left text-xs font-medium"
              >
                {cls}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map((slot) => {
            const rowSchedules = grouped[slot];
            const period = periodMap[slot];
            const codeCounts = getTeacherCodeCounts(rowSchedules);
            return (
              <tr key={slot} className="border-t">
                <td className="bg-muted left-0 px-4 py-2 text-sm font-medium md:sticky md:z-10">
                  {period ?? ""}
                </td>
                <td className="bg-muted left-[96px] border-r px-4 py-2 text-sm font-medium md:sticky md:z-10">
                  {slot}
                </td>
                {classes.map((cls) => {
                  const found = rowSchedules.find((s) => s.class_name === cls);
                  const { label, variant, disabled, isChanged } =
                    getButtonProps(
                      found,
                      codeCounts,
                      originalSchedulesCodes,
                      teachers,
                      isPending,
                    );
                  return (
                    <td
                      key={cls}
                      className={`px-4 py-2 text-sm dark:border-input${isChanged ? "bg-primary/50" : ""}`}
                    >
                      {found ? (
                        <Button
                          variant={variant}
                          size="sm"
                          className="w-full justify-start"
                          disabled={disabled}
                          onClick={() => handleCellClick(found)}
                        >
                          {label}
                        </Button>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
});
