import { Card } from "@/components/ui/card";
import { cn, formatSubject, getDuration } from "@/lib/utils";
import {
  Book,
  Coffee,
  ArrowRight,
  Sunrise,
  Sun,
  Moon,
  School,
} from "lucide-react";
import { type CSSProperties } from "react";
import type { TeacherRow, TeacherScheduleRow } from "@/types/schedule";
import { days } from "@/lib/consts";

interface TeacherScheduleItemProps {
  row: TeacherScheduleRow;
  index: number;
  teacherData: TeacherRow[];
  day: string;
  currentDate: Date;
}

// Hardcoded class styles for all 30 classes (X-A to XII-J)
const CLASS_STYLES = {
  // X
  "X-A": {
    gradient: "bg-gradient-to-br from-rose-400 to-red-500",
    text: "text-rose-400",
  },
  "X-B": {
    gradient: "bg-gradient-to-br from-red-400 to-orange-500",
    text: "text-red-400",
  },
  "X-C": {
    gradient: "bg-gradient-to-br from-orange-400 to-amber-500",
    text: "text-orange-400",
  },
  "X-D": {
    gradient: "bg-gradient-to-br from-amber-400 to-yellow-500",
    text: "text-amber-400",
  },
  "X-E": {
    gradient: "bg-gradient-to-br from-yellow-400 to-lime-500",
    text: "text-yellow-400",
  },
  "X-F": {
    gradient: "bg-gradient-to-br from-lime-400 to-green-500",
    text: "text-lime-400",
  },
  "X-G": {
    gradient: "bg-gradient-to-br from-green-400 to-emerald-500",
    text: "text-green-400",
  },
  "X-H": {
    gradient: "bg-gradient-to-br from-emerald-400 to-teal-500",
    text: "text-emerald-400",
  },
  "X-I": {
    gradient: "bg-gradient-to-br from-teal-400 to-cyan-500",
    text: "text-teal-400",
  },
  "X-J": {
    gradient: "bg-gradient-to-br from-cyan-400 to-sky-500",
    text: "text-cyan-400",
  },
  // XI
  "XI-A": {
    gradient: "bg-gradient-to-br from-sky-400 to-blue-500",
    text: "text-sky-400",
  },
  "XI-B": {
    gradient: "bg-gradient-to-br from-blue-400 to-indigo-500",
    text: "text-blue-400",
  },
  "XI-C": {
    gradient: "bg-gradient-to-br from-indigo-400 to-violet-500",
    text: "text-indigo-400",
  },
  "XI-D": {
    gradient: "bg-gradient-to-br from-violet-400 to-purple-500",
    text: "text-violet-400",
  },
  "XI-E": {
    gradient: "bg-gradient-to-br from-purple-400 to-fuchsia-500",
    text: "text-purple-400",
  },
  "XI-F": {
    gradient: "bg-gradient-to-br from-fuchsia-400 to-pink-500",
    text: "text-fuchsia-400",
  },
  "XI-G": {
    gradient: "bg-gradient-to-br from-pink-400 to-rose-500",
    text: "text-pink-400",
  },
  "XI-H": {
    gradient: "bg-gradient-to-br from-rose-400 to-red-500",
    text: "text-rose-400",
  },
  "XI-I": {
    gradient: "bg-gradient-to-br from-red-400 to-orange-500",
    text: "text-red-400",
  },
  "XI-J": {
    gradient: "bg-gradient-to-br from-orange-400 to-amber-500",
    text: "text-orange-400",
  },
  // XII
  "XII-A": {
    gradient: "bg-gradient-to-br from-amber-400 to-yellow-500",
    text: "text-amber-400",
  },
  "XII-B": {
    gradient: "bg-gradient-to-br from-yellow-400 to-lime-500",
    text: "text-yellow-400",
  },
  "XII-C": {
    gradient: "bg-gradient-to-br from-lime-400 to-green-500",
    text: "text-lime-400",
  },
  "XII-D": {
    gradient: "bg-gradient-to-br from-green-400 to-emerald-500",
    text: "text-green-400",
  },
  "XII-E": {
    gradient: "bg-gradient-to-br from-emerald-400 to-teal-500",
    text: "text-emerald-400",
  },
  "XII-F": {
    gradient: "bg-gradient-to-br from-teal-400 to-cyan-500",
    text: "text-teal-400",
  },
  "XII-G": {
    gradient: "bg-gradient-to-br from-cyan-400 to-sky-500",
    text: "text-cyan-400",
  },
  "XII-H": {
    gradient: "bg-gradient-to-br from-sky-400 to-blue-500",
    text: "text-sky-400",
  },
  "XII-I": {
    gradient: "bg-gradient-to-br from-blue-400 to-indigo-500",
    text: "text-blue-400",
  },
  "XII-J": {
    gradient: "bg-gradient-to-br from-indigo-400 to-violet-500",
    text: "text-indigo-400",
  },
  // Istirahat
  Istirahat: {
    gradient: "bg-gradient-to-br from-stone-400 to-zinc-500",
    text: "text-stone-400",
  },
  // fallback
  default: {
    gradient: "bg-gradient-to-br from-zinc-400 to-gray-500",
    text: "text-zinc-400",
  },
} as const;

function getClassGradient(className: string | undefined) {
  if (!className) return CLASS_STYLES.default;
  return (
    CLASS_STYLES[className as keyof typeof CLASS_STYLES] || CLASS_STYLES.default
  );
}

const getTimeIcon = (time: string) => {
  const hour = Number.parseInt(time.split(":")[0]);
  if (hour < 10)
    return <Sunrise className="mt-0.5 size-4 flex-shrink-0 text-orange-400" />;
  if (hour < 15)
    return <Sun className="mt-0.5 size-4 flex-shrink-0 text-yellow-400" />;
  return <Moon className="mt-0.5 size-4 flex-shrink-0 text-blue-400" />;
};

export function TeacherScheduleItem({
  row,
  index,
  day,
  currentDate,
  teacherData,
}: TeacherScheduleItemProps) {
  // Find the class this teacher is teaching in this row
  const teacherInfo = teacherData.find((teacher) => teacher.code === row.code);
  const className = row.className;
  const isRegularClass = !isNaN(Number.parseInt(row.period));
  const parsedStartTime = row.time.split(":").map(Number);
  const parsedEndTime = row.endTime.split(":").map(Number);
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

  const classStyles = getClassGradient(className);
  const isIstirahat = className === "Istirahat" || row.code === "ISTIRAHAT";

  return (
    <Card
      className={cn(
        "motion-preset-expand motion-duration-400 group h-44 flex-row gap-0 overflow-hidden py-0 transition-all sm:h-40 md:h-36",
        isNow && className ? classStyles.gradient : "bg-card",
      )}
      style={{ "--motion-delay": `${index * 50}ms` } as CSSProperties}
    >
      {/* Left Side - Accent */}
      <div
        className={cn(
          "group relative flex w-24 flex-col items-center justify-center overflow-hidden p-4 text-center",
          isNow ? "" : classStyles.gradient,
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-white/10 opacity-0 transition-opacity",
            isNow ? "" : "group-hover:opacity-100",
          )}
        />
        {isIstirahat ? (
          <Coffee className="size-8 flex-shrink-0 text-white" />
        ) : isRegularClass ? (
          <div className="flex flex-col items-center text-white">
            <span className="text-3xl font-bold tracking-tight">
              {row.period}
            </span>
            {row.endPeriod !== row.period && (
              <div className="mt-1 flex items-center gap-px text-sm">
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
        className={cn(
          "bg-card flex flex-1 flex-col justify-center p-4 px-6",
          isNow
            ? ""
            : "transition-colors hover:bg-zinc-200/10 dark:hover:bg-zinc-100/10",
        )}
      >
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold capitalize">
              {isIstirahat ? (
                <div className="flex items-center gap-2">
                  <Coffee
                    className={cn("size-5 flex-shrink-0", classStyles.text)}
                  />
                  <span
                    className={cn(
                      "bg-clip-text text-transparent",
                      classStyles.gradient,
                    )}
                  >
                    Istirahat
                  </span>
                </div>
              ) : isRegularClass && className ? (
                <div className="flex items-center gap-2">
                  <School
                    className={cn("size-5 flex-shrink-0", classStyles.text)}
                  />
                  <span
                    className={cn(
                      "bg-clip-text text-transparent",
                      classStyles.gradient,
                    )}
                  >
                    {className}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Coffee className={cn("size-5 flex-shrink-0")} />
                  <span
                    className={cn(
                      "bg-clip-text text-transparent capitalize",
                      classStyles.gradient,
                    )}
                  >
                    {className || "-"}
                  </span>
                </div>
              )}
            </h3>
          </div>

          <div className="flex flex-col gap-2 text-sm">
            <div className="text-muted-foreground flex items-start gap-2">
              {getTimeIcon(row.time)}
              <span className={cn("text-primary tabular-nums")}>
                {row.time} - {row.endTime} {getDuration(row.time, row.endTime)}
              </span>
            </div>
            {!isIstirahat && (
              <div className="text-muted-foreground flex items-start gap-2">
                <Book
                  className={cn("text-foreground mt-0.5 size-4 flex-shrink-0")}
                />
                <span className={cn("text-foreground capitalize")}>
                  {teacherInfo ? formatSubject(teacherInfo.subject) : "Unknown"}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
