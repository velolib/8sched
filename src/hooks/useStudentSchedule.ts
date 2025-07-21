import { useMemo } from "react";
import type { ScheduleRow, StudentScheduleRow } from "../types/schedule";
import { days } from "@/lib/consts";

export function useStudentSchedule(
  scheduleData: ScheduleRow[] | undefined,
  selectedDay: string,
  selectedClass: string
): StudentScheduleRow[] {
  return useMemo(() => {
    if (!scheduleData) return [];

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
  
    // Combine schedule rows that are the same subject
    const combined: StudentScheduleRow[] = [];
    let block: StudentScheduleRow | null = null;

    for (let i = 0; i < todayRows.length; i++) {
      const row = todayRows[i];
      const nextRow = todayRows[i + 1];
      const subject = row[selectedClass as keyof ScheduleRow];
      if (!subject) continue;
      if (
        !block ||
        subject !== block.code ||
        !row.period
      ) {
        if (block) combined.push(block);
        block = {
          time: row.time,
          period: row.period,
          code: subject as string,
          endTime: nextRow ? nextRow.time : "Selesai",
          endPeriod: row.period,
        };
      } else {
        block.endTime = nextRow ? nextRow.time : "Selesai";
        block.endPeriod = row.period;
      }
    }
    if (block) combined.push(block);

    console.log("Combined schedule:", combined);
    return combined;
  }, [scheduleData, selectedDay, selectedClass]);
}
