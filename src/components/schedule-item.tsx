"use client"

import { Book, User, Coffee, Moon, Sun, Sunrise, ArrowRight, Star } from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { CSSProperties } from "react"
import type { CombinedScheduleRow, ScheduleRow, TeacherRow } from "@/types/schedule"

interface ScheduleItemProps {
  row: CombinedScheduleRow
  index: number
  selectedClass: string
  teacherData: TeacherRow[]
  compact: boolean
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
} as const


const UPPERCASE_SUBJECTS = new Set(["PPKN", "PJOK", "PKWU"])

const getSubjectStyles = (subject: string | undefined) => {
  if (!subject) subject = "default"
  const subjectKey = subject.toLowerCase() as keyof typeof SUBJECT_STYLES
  return SUBJECT_STYLES[subjectKey] || SUBJECT_STYLES.default
}

const getTimeIcon = (time: string) => {
  const hour = Number.parseInt(time.split(":")[0])
  if (hour < 10) return <Sunrise className="size-4 text-orange-400 flex-shrink-0 mt-0.5" />
  if (hour < 15) return <Sun className="size-4 text-yellow-400 flex-shrink-0 mt-0.5" />
  return <Moon className="size-4 text-blue-400 flex-shrink-0 mt-0.5" />
}

const formatSubject = (subject: string): string => {
  if (UPPERCASE_SUBJECTS.has(subject.toUpperCase())) {
    return subject.toUpperCase()
  }
  return subject.toLowerCase()
}

export function ScheduleItem({ row, index, selectedClass, teacherData, compact }: ScheduleItemProps) {
  const teacherInfo = teacherData.find((teacher) => teacher.code === row[selectedClass as keyof ScheduleRow])
  const isRegularClass = !isNaN(Number.parseInt(row.period))
  const subjectStyles = getSubjectStyles(teacherInfo?.subject)

  return (
    <Card
      className={cn("flex overflow-hidden transition-all hover:shadow-lg motion-preset-expand motion-duration-400 group", compact ? "h-24" : "h-44 sm:h-40 md:h-36")}
      style={{ "--motion-delay": `${index * 50}ms` } as CSSProperties}
    >
      {/* Left Side - Accent */}
      <div
        className={cn(
          "w-24 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden group",
          subjectStyles.gradient,
        )}
      >
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-white/10 transition-opacity" />
        {isRegularClass ? (
          <div className="flex flex-col items-center text-white">
            <span className="text-3xl font-bold tracking-tight">{row.period}</span>
            {row.endPeriod !== row.period && (
              <div className="flex items-center gap-px text-sm mt-1">
                {/* <div className="h-3 w-[1px] bg-white/60 rotate-12" /> */}
                <ArrowRight className="size-3 flex-shrink-0" />
                <span className="font-medium">{row.endPeriod}</span>
              </div>
            )}
          </div>
        ) : (
          <Coffee className="size-8 text-white flex-shrink-0" />
        )}
      </div>

      {/* Right Side - Content */}
      <div className={cn("flex flex-1 p-4 bg-card group-hover:bg-zinc-50 dark:group-hover:bg-zinc-900 transition-colors", compact ? "items-center" : "flex-col justify-center")}>
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold capitalize">
              {isRegularClass && teacherInfo ? (
                <div className="flex items-center gap-2">
                  <Book className={cn("size-5 flex-shrink-0", subjectStyles.text)} />
                  <span className={cn("bg-gradient-to-r bg-clip-text", subjectStyles.gradient, "text-transparent")}>
                    {formatSubject(teacherInfo.subject)}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {isRegularClass ? <Star className={cn("size-5 flex-shrink-0", subjectStyles.text)} /> : <Coffee className={cn("size-5 flex-shrink-0", subjectStyles.text)} />}
                  <span
                    className={cn(
                      "bg-gradient-to-r bg-clip-text capitalize",
                      getSubjectStyles(row[selectedClass as keyof ScheduleRow]).gradient,
                      "text-transparent",
                    )}
                  >
                    {row[selectedClass as keyof ScheduleRow]}
                  </span>
                </div>
              )}
            </h3>
          </div>

          {!compact && <div className="flex flex-col gap-2 text-sm">
            <div className="flex items-start gap-2 text-muted-foreground/80">
              {getTimeIcon(row.time)}
              <span className="tabular-nums">
                {row.time} - {row.endTime}
              </span>
            </div>

            {isRegularClass && teacherInfo && (
              <div className="flex items-start gap-2 text-muted-foreground/80">
                <User className="size-4 mt-0.5 text-primary/70 flex-shrink-0" />
                <span className="capitalize">
                  {teacherInfo.name.split(",")[0].toLowerCase()}
                  <span className="normal-case">,{teacherInfo.name.split(",")[1]}</span>
                </span>
              </div>
            )}
          </div>}
        </div>
      </div>
    </Card>
  )
}