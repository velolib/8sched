import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useScheduleData } from '@/hooks/useScheduleData'
import { useTeacherSchedule } from '@/hooks/useTeacherSchedule'
import { days } from '@/lib/consts'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Keyboard } from 'lucide-react'
import { useState, useMemo, useEffect } from 'react'
import { formatTeacherName } from '@/lib/utils'
import type { ScheduleRow, TeacherRow } from '@/types/schedule'
import { TeacherScheduleItem } from '@/components/teacher-schedule-item'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ComboBoxResponsive } from '@/components/ui/combo-box-responsive'

export const Route = createLazyFileRoute('/teacher')({
  component: RouteComponent,
})

function RouteComponent() {
  const [scheduleResult, teacherResult] = useScheduleData()
  // Build mapping from teacher name to array of codes
  const teacherMap: Record<string, string[]> = useMemo(() => {
    const map: Record<string, string[]> = {}
    const teacherData = teacherResult?.data as TeacherRow[] | undefined
    teacherData?.forEach((t: TeacherRow) => {
      if (!map[t.name]) map[t.name] = []
      map[t.name].push(t.code)
    })
    return map
  }, [teacherResult])

  // Get unique teacher names
  const teachers = Object.keys(teacherMap)
  const [selectedTeacher, setSelectedTeacher] = useState<string>(teachers[0] || '')
  const [selectedDay, setSelectedDay] = useState(days[0])

  function handleTeacherChange(value: string) {
    setSelectedTeacher(value)
  }
  function handleDayChange(value: string) {
    setSelectedDay(value)
  }

  const teacherSchedule = useTeacherSchedule(scheduleResult?.data as ScheduleRow[] | undefined, selectedDay, teacherMap[selectedTeacher] || [])

  console.log(teacherSchedule)

  // Keyboard shortcuts: 1-5 for days, arrows for cycling
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Number keys 1-5 for days
      if (e.key >= "1" && e.key <= "5") {
        const index = Number.parseInt(e.key) - 1;
        if (index < days.length) {
          setSelectedDay(days[index]);
        }
      }
      // ArrowLeft/ArrowRight to cycle days
      const dayIndex = days.indexOf(selectedDay);
      if (e.key === "ArrowLeft") {
        const prevIndex = (dayIndex - 1 + days.length) % days.length;
        setSelectedDay(days[prevIndex]);
      } else if (e.key === "ArrowRight") {
        const nextIndex = (dayIndex + 1) % days.length;
        setSelectedDay(days[nextIndex]);
      }
      // ArrowUp/ArrowDown to cycle teachers (ComboBox)
      const teacherIndex = teachers.indexOf(selectedTeacher);
      if (e.key === "ArrowUp") {
        e.preventDefault();
        const prevIndex = (teacherIndex - 1 + teachers.length) % teachers.length;
        setSelectedTeacher(teachers[prevIndex]);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        const nextIndex = (teacherIndex + 1) % teachers.length;
        setSelectedTeacher(teachers[nextIndex]);
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [selectedDay, selectedTeacher, teachers]);

  return (
    <>
      <Card className="mb-2 flex flex-col items-center gap-2 md:mb-4 md:flex-row p-4">
        <div className="flex w-full gap-2 md:w-auto">
          <ComboBoxResponsive
            options={teachers.map((t) => ({ value: t, label: formatTeacherName(t) }))}
            value={selectedTeacher}
            onChange={handleTeacherChange}
            placeholder="Select a teacher"
            className="w-full md:w-[180px]"
          />
        </div>
        <Tabs
          value={selectedDay}
          onValueChange={handleDayChange}
          className="w-full"
        >
          <TabsList className="w-full flex-wrap justify-start">
            {days.map((day) => (
              <TabsTrigger key={day} value={day} className="flex-1">
                <span className="hidden sm:inline">{day}</span>
                <span className="sm:hidden">{day.slice(0, 3)}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="hidden aspect-square items-center justify-center md:flex"
                type="button"
                size={"icon"}
                variant={"ghost"}
              >
                <Keyboard className="size-4 text-black dark:text-white" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Keyboard shortcuts:</p>
              <p>1-5: Select day</p>
              <p>←/→: Cycle days</p>
              <p>↑/↓: Cycle teachers</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="text-xs text-nowrap text-zinc-900 dark:text-zinc-50 text-center">
          {new Date(import.meta.env.VITE_GIT_COMMIT_DATE).toLocaleDateString(
            "en-GB",
            { month: "long", day: "2-digit", year: "numeric" },
          )}
        </div>
      </Card>
      <ScrollArea className="flex-1 h-0">
        <div className='grid min-h-0 grid-cols-1 gap-2 md:grid-cols-2 md:gap-4 lg:grid-cols-3'>
          {teacherSchedule.map((item, idx) => (
            <TeacherScheduleItem
              key={idx}
              row={item}
              index={idx}
              day={selectedDay}
              teacherData={teacherResult.data as TeacherRow[] || []}
              currentDate={new Date()}
            />
          ))}
        </div>
      </ScrollArea>
    </>
  )
}
