import {
  Book,
  User,
  Coffee,
  Moon,
  Sun,
  Sunrise,
  ArrowRight,
  Star,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn, formatTeacherName } from "@/lib/utils";
import { type CSSProperties } from "react";
import type { StudentScheduleRow, TeacherRow } from "@/types/schedule";
import { days } from "@/lib/consts";
import { getDuration, formatSubject } from "@/lib/utils";

interface ScheduleItemProps {
  row: StudentScheduleRow;
  index: number;
  teacherData: TeacherRow[];
  day: string;
  currentDate: Date;
}

// Combined subject styling configuration
const SUBJECT_STYLES = {
  // Sciences - Purple/Violet family
  matematika: {
    gradient: "bg-gradient-to-br from-violet-400 to-purple-500",
    text: "text-violet-400",
  },
  fisika: {
    gradient: "bg-gradient-to-br from-purple-400 to-violet-500",
    text: "text-purple-400",
  },
  biologi: {
    gradient: "bg-gradient-to-br from-fuchsia-400 to-purple-500",
    text: "text-fuchsia-400",
  },
  kimia: {
    gradient: "bg-gradient-to-br from-purple-400 to-fuchsia-500",
    text: "text-purple-400",
  },

  // Languages - Blue family
  "bahasa indonesia": {
    gradient: "bg-gradient-to-br from-blue-400 to-indigo-500",
    text: "text-blue-400",
  },
  "bahasa inggris": {
    gradient: "bg-gradient-to-br from-sky-400 to-blue-500",
    text: "text-sky-400",
  },
  "bahasa jerman": {
    gradient: "bg-gradient-to-br from-indigo-400 to-blue-500",
    text: "text-indigo-400",
  },

  // Social Studies - Green family
  ppkn: {
    gradient: "bg-gradient-to-br from-emerald-400 to-green-500",
    text: "text-emerald-400",
  },
  sejarah: {
    gradient: "bg-gradient-to-br from-green-400 to-emerald-500",
    text: "text-green-400",
  },
  ekonomi: {
    gradient: "bg-gradient-to-br from-teal-400 to-emerald-500",
    text: "text-teal-400",
  },
  sosiologi: {
    gradient: "bg-gradient-to-br from-emerald-400 to-teal-500",
    text: "text-emerald-400",
  },
  geografi: {
    gradient: "bg-gradient-to-br from-cyan-400 to-teal-500",
    text: "text-cyan-400",
  },

  // Religious Studies - Orange/Yellow family
  "pend. agama islam": {
    gradient: "bg-gradient-to-br from-amber-400 to-orange-500",
    text: "text-amber-400",
  },
  "pend. agama kristen": {
    gradient: "bg-gradient-to-br from-yellow-400 to-amber-500",
    text: "text-yellow-400",
  },
  "pend. agama katolik": {
    gradient: "bg-gradient-to-br from-orange-400 to-amber-500",
    text: "text-orange-400",
  },

  // Arts and Physical Education - Pink/Red family
  "seni budaya": {
    gradient: "bg-gradient-to-br from-pink-400 to-rose-500",
    text: "text-pink-400",
  },
  pjok: {
    gradient: "bg-gradient-to-br from-rose-400 to-pink-500",
    text: "text-rose-400",
  },

  // Technology and Stuff - Cyan/Blue family
  informatika: {
    gradient: "bg-gradient-to-br from-cyan-400 to-blue-500",
    text: "text-cyan-400",
  },
  pkwu: {
    gradient: "bg-gradient-to-br from-blue-400 to-cyan-500",
    text: "text-blue-400",
  },

  // Counseling - Warm gray family
  "bimbingan konseling": {
    gradient: "bg-gradient-to-br from-stone-400 to-zinc-500",
    text: "text-stone-400",
  },

  // Default fallback
  default: {
    gradient: "bg-gradient-to-br from-zinc-400 to-gray-500",
    text: "text-zinc-400",
  },
} as const;

const getSubjectStyles = (subject: string | undefined) => {
  if (!subject) subject = "default";
  const subjectKey = subject.toLowerCase() as keyof typeof SUBJECT_STYLES;
  return SUBJECT_STYLES[subjectKey] || SUBJECT_STYLES.default;
};

const getTimeIcon = (time: string) => {
  const hour = Number.parseInt(time.split(":")[0]);
  if (hour < 10)
    return <Sunrise className="mt-0.5 size-4 flex-shrink-0 text-orange-400" />;
  if (hour < 15)
    return <Sun className="mt-0.5 size-4 flex-shrink-0 text-yellow-400" />;
  return <Moon className="mt-0.5 size-4 flex-shrink-0 text-blue-400" />;
};

export function StudentScheduleItem({
  row,
  index,
  teacherData,
  day,
  currentDate,
}: ScheduleItemProps) {
  const teacherInfo = teacherData.find((teacher) => teacher.code === row.code);

  // const currentDate = new Date(2025, 6, 18, 6, 45)
  const isRegularClass = !isNaN(Number.parseInt(row.period));
  const subjectStyles = getSubjectStyles(teacherInfo?.subject);

  const parsedStartTime = row.time.split(":").map(Number);
  const parsedEndTime = row.endTime.split(":").map(Number);

  // Improved isNow algorithm
  let currentDayIndex = currentDate.getDay() - 1;
  if (currentDate.getDay() === -1) currentDayIndex = 6;
  const scheduleDayIndex = days.indexOf(day);
  const currentMinutes = currentDate.getHours() * 60 + currentDate.getMinutes();
  const startMinutes = parsedStartTime[0] * 60 + parsedStartTime[1];
  const endMinutes = parsedEndTime[0] * 60 + parsedEndTime[1];
  const isNow =
    currentDayIndex === scheduleDayIndex &&
    currentMinutes >= startMinutes &&
    currentMinutes < endMinutes;

  return (
    <Card
      className={cn(
        "motion-preset-expand motion-duration-400 group h-44 flex-row gap-0 overflow-hidden py-0 transition-all sm:h-40 md:h-36",
        isNow ? subjectStyles.gradient : "bg-card",
      )}
      style={{ "--motion-delay": `${index * 50}ms` } as CSSProperties}
    >
      {/* Left Side - Accent */}
      <div
        className={cn(
          "group relative flex w-24 flex-col items-center justify-center overflow-hidden p-4 text-center",
          isNow ? "" : subjectStyles.gradient,
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-white/10 opacity-0 transition-opacity",
            isNow ? "" : "group-hover:opacity-100",
          )}
        />
        {isRegularClass ? (
          <div className="flex flex-col items-center text-white">
            <span className="text-3xl font-bold tracking-tight">
              {row.period}
            </span>
            {row.endPeriod !== row.period && (
              <div className="mt-1 flex items-center gap-px text-sm">
                {/* <div className="h-3 w-[1px] bg-white/60 rotate-12" /> */}
                <ArrowRight className="size-3 flex-shrink-0" />
                <span className="font-medium">{row.endPeriod}</span>
              </div>
            )}
          </div>
        ) : (
          <Coffee className="size-8 flex-shrink-0 text-white" />
        )}
      </div>

      {/* Right Side - Content */}
      <div
        className={cn("bg-card flex flex-1 flex-col justify-center p-4 px-6")}
      >
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold capitalize">
              {isRegularClass && teacherInfo ? (
                <div className="flex items-center gap-2">
                  <Book
                    className={cn("size-5 flex-shrink-0", subjectStyles.text)}
                  />
                  <span
                    className={cn(
                      "bg-clip-text text-transparent",
                      subjectStyles.gradient,
                    )}
                  >
                    {formatSubject(teacherInfo.subject)}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {isRegularClass ? (
                    <Star className={cn("size-5 flex-shrink-0")} />
                  ) : (
                    <Coffee className={cn("size-5 flex-shrink-0")} />
                  )}
                  <span
                    className={cn(
                      "bg-clip-text text-transparent capitalize",
                      subjectStyles.gradient,
                    )}
                  >
                    {row.code}
                  </span>
                </div>
              )}
            </h3>
          </div>

          <div className="flex flex-col gap-2 text-sm">
            <div className="text-foreground flex items-start gap-2">
              {getTimeIcon(row.time)}
              <span className={cn("text-primary tabular-nums")}>
                {row.time} - {row.endTime} {getDuration(row.time, row.endTime)}
              </span>
            </div>

            {isRegularClass && teacherInfo && (
              <div className="text-foreground flex items-start gap-2">
                <User
                  className={cn("text-foreground mt-0.5 size-4 flex-shrink-0")}
                />
                <span className={cn("text-foreground capitalize")}>
                  {formatTeacherName(teacherInfo.name)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
