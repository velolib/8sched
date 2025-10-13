import { useMemo } from "react";
import type { Schedule, Teacher, TeacherScheduleBlock } from "@/types/schedule";

export function useTeacherSchedule(
  schedules: Schedule[] | undefined,
  teachers: Teacher[] | undefined,
  dayFilter: number,
  teacherNameFilter: string,
): TeacherScheduleBlock[] {
  return useMemo(() => {
    if (!schedules?.length || !teachers?.length || !teacherNameFilter) {
      return [];
    }

    const currentTeachers = teachers.filter(
      (t) => t.name === teacherNameFilter,
    );
    if (!currentTeachers.length) {
      return [];
    }

    const daySchedules = schedules.filter((s) => s.day === dayFilter);
    const uniqueTimes = Array.from(
      new Set(daySchedules.map((s) => s.time_slot)),
    ).sort((a, b) => a.localeCompare(b));

    if (!uniqueTimes.length) {
      return [];
    }

    const timelineSlots = uniqueTimes.map((time) => {
      const classesInSlot = daySchedules.filter(
        (s) =>
          s.time_slot === time &&
          currentTeachers.some((ct) => ct.code === s.teacher_code),
      );

      if (classesInSlot.length === 0) {
        // If no class, it's a break/free period.
        return { class_name: "Istirahat", teacher_code: null };
      } else {
        // If there are classes (including conflicts), join their names.
        // For simplicity, we'll just take the first class's info for the block.
        // The grouping logic will handle separating different subjects.
        return {
          class_name: classesInSlot.map((c) => c.class_name).join(" / "),
          teacher_code: classesInSlot[0].teacher_code, // Use the code to differentiate subjects
        };
      }
    });

    if (timelineSlots.length === 0) {
      return [];
    }

    const blocks: (Omit<TeacherScheduleBlock, "teacher" | "day"> & {
      teacher_code: string | null;
    })[] = [];
    let currentBlock: Omit<TeacherScheduleBlock, "teacher" | "day"> & {
      teacher_code: string | null;
    } = {
      class_name: timelineSlots[0].class_name,
      start_time: uniqueTimes[0],
      end_time: "", // Will be set later
      teacher_code: timelineSlots[0].teacher_code,
    };

    for (let i = 1; i < timelineSlots.length; i++) {
      if (
        timelineSlots[i].class_name === currentBlock.class_name &&
        timelineSlots[i].teacher_code === currentBlock.teacher_code
      ) {
        // If the class and subject are the same as the previous one, extend the current block.
        // No action needed, we just continue.
      } else {
        // If the class or subject changes, the previous block is complete.
        // The end time is the start of the *next* slot.
        currentBlock.end_time = uniqueTimes[i];
        blocks.push(currentBlock);

        // Start a new block.
        currentBlock = {
          class_name: timelineSlots[i].class_name,
          start_time: uniqueTimes[i],
          end_time: "",
          teacher_code: timelineSlots[i].teacher_code,
        };
      }
    }

    currentBlock.end_time = "Selesai";
    blocks.push(currentBlock);

    return blocks.map((block) => {
      const teacherForBlock =
        currentTeachers.find((t) => t.code === block.teacher_code) ||
        currentTeachers[0];
      return {
        class_name: block.class_name,
        start_time: block.start_time,
        end_time: block.end_time,
        teacher: teacherForBlock,
        day: dayFilter,
      };
    });
  }, [schedules, teachers, dayFilter, teacherNameFilter]);
}
