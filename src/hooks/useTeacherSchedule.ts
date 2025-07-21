import { useMemo } from "react";
import type { ScheduleRow, TeacherScheduleRow } from "@/types/schedule";
import { days } from "@/lib/consts";

export function useTeacherSchedule(
  scheduleData: ScheduleRow[] | undefined,
  selectedDay: string,
  teacherCodes: string[],
) {
  return useMemo(() => {
    if (!scheduleData || !teacherCodes.length) return [];

    // Split schedule data into days
    const daysSchedules = [];
    let currentDayRows: ScheduleRow[] = [];
    for (const row of scheduleData) {
      if (row.time === "06:30" && currentDayRows.length) {
        daysSchedules.push(currentDayRows);
        currentDayRows = [];
      }
      currentDayRows.push(row);
    }
    if (currentDayRows.length) daysSchedules.push(currentDayRows);

    // Check if the selected day exists in the schedule (MONDAY-FRIDAY)
    const todayRows = daysSchedules[days.indexOf(selectedDay)] ?? [];

    // For each period, check if the teacher is teaching, otherwise mark as gap
    const teacherBlocks = todayRows.map((row) => {
      const match = Object.entries(row).find(
        ([key, value]) =>
          key !== "time" &&
          key !== "period" &&
          teacherCodes.includes(value as string),
      );
      if (match) {
        const [className, code] = match;
        return { ...row, className, code };
      } else {
        // Gap: teacher not teaching this period, fill with Istirahat
        return { ...row, className: "Istirahat", code: "ISTIRAHAT" };
      }
    });

    // Combine consecutive periods with the same code and class (including Istirahat)
    const combined = [];
    let block = null;
    for (let i = 0; i < teacherBlocks.length; i++) {
      const curr = teacherBlocks[i];
      const next = teacherBlocks[i + 1];
      if (
        !block ||
        curr.code !== block.code ||
        curr.className !== block.className
      ) {
        if (block)
          combined.push({
            endTime: block.endTime,
            endPeriod: block.endPeriod,
            className: block.className,
            code: block.code,
            time: block.time,
            period: block.period,
          });
        block = {
          className: curr.className,
          code: curr.code,
          time: curr.time,
          period: curr.period,
          endTime: next ? next.time : "15:00",
          endPeriod: curr.period,
        };
      } else {
        block.endTime = next ? next.time : "15:00";
        block.endPeriod = curr.period;
      }
    }
    if (block) combined.push(block);

    if (combined[combined.length - 1].time === "15:00") {
      combined.pop(); // Remove last block if it ends at 15:00, crude!
    }

    // No need to prune Istirahat blocks, return all
    return combined as TeacherScheduleRow[];
  }, [scheduleData, selectedDay, teacherCodes]);
}
