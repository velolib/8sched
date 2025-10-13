import { useMemo } from "react";
import { checkIfReservedCode } from "@/lib/utils";
import { Schedule, Teacher, StudentScheduleBlock } from "@/types/schedule";

export function useStudentSchedule(
  schedules: Schedule[] | undefined,
  teachers: Teacher[] | undefined,
  dayFilter: number,
  classFilter: string,
): StudentScheduleBlock[] {
  return useMemo(() => {
    if (!schedules?.length || !teachers?.length) return [];

    const classSchedules = schedules
      .filter((row) => row.class_name === classFilter && row.day === dayFilter)
      .sort((a, b) => a.time_slot.localeCompare(b.time_slot));

    // Precompute non-reserved 1-indexed positions
    const nonReservedPositions: number[] = [];
    let counter = 0;
    for (let i = 0; i < classSchedules.length; i++) {
      const row = classSchedules[i];
      const isReserved = checkIfReservedCode(row.teacher_code);
      if (isReserved) {
        nonReservedPositions[i] = -1;
      } else {
        counter += 1;
        nonReservedPositions[i] = counter;
      }
    }

    const getTeacher = (code: string): Teacher | undefined =>
      teachers.find((t) => t.code === code);

    const blocks: StudentScheduleBlock[] = [];
    let block: StudentScheduleBlock | null = null;

    for (let i = 0; i < classSchedules.length; i++) {
      const current = classSchedules[i];
      const next = classSchedules[i + 1];
      if (!current.teacher_code) continue;

      const teacher = getTeacher(current.teacher_code);
      const isReserved = checkIfReservedCode(current.teacher_code);
      const pos = nonReservedPositions[i];

      // Start new block when teacher changes
      if (!block || block.teacher.code !== current.teacher_code) {
        if (block) blocks.push(block);

        block = {
          teacher_code: current.teacher_code,
          teacher: teacher ?? {
            id: -1,
            code: current.teacher_code,
            name: "Unknown",
            subject: isReserved ? "Reserved" : "Unknown",
          },
          start_time: current.time_slot,
          end_time: next ? next.time_slot : "Selesai",
          start_index: isReserved ? -1 : pos,
          end_index: isReserved ? -1 : pos,
        };
      } else {
        // Extend block
        block.end_time = next ? next.time_slot : "Selesai";
        if (!checkIfReservedCode(block.teacher_code)) {
          const posForThisRow = nonReservedPositions[i];
          if (posForThisRow !== -1) block.end_index = posForThisRow;
        }
      }
    }

    if (block) blocks.push(block);
    return blocks;
  }, [schedules, teachers, dayFilter, classFilter]);
}
