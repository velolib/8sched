import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useScheduleData } from '@/hooks/useScheduleData'
import { useTeacherSchedule } from '@/hooks/useTeacherSchedule'
import { days } from '@/lib/consts'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Toggle } from '@/components/ui/toggle'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { createLazyFileRoute } from '@tanstack/react-router'
import { LayoutGrid, Keyboard } from 'lucide-react'
import { useState, useMemo } from 'react'
import { formatTeacherName } from '@/lib/utils'
import type { ScheduleRow, TeacherRow } from '@/types/schedule'
import { TeacherScheduleItem } from '@/components/teacher-schedule-item'
import { ScrollArea } from '@radix-ui/react-scroll-area'

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
  const [compact, setCompact] = useState(false)
  const [selectedDay, setSelectedDay] = useState(days[0])

  function handleTeacherChange(value: string) {
    setSelectedTeacher(value)
  }
  function handleDayChange(value: string) {
    setSelectedDay(value)
  }

  const teacherSchedule = useTeacherSchedule(scheduleResult?.data as ScheduleRow[] | undefined, selectedDay, teacherMap[selectedTeacher] || [])

  console.log(teacherSchedule)

  return (
    <>
      <Card className="mb-2 flex flex-col items-center gap-2 md:mb-4 md:flex-row p-4">
        <div className="flex w-full gap-2 md:w-auto">
          <Select onValueChange={handleTeacherChange} value={selectedTeacher}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Select a teacher" />
            </SelectTrigger>
            <SelectContent>
              <div className="grid grid-cols-2 gap-2 p-2">
                {teachers.map((teacher) => (
                  <SelectItem
                    key={teacher}
                    value={teacher}
                    className="flex items-center justify-center rounded-md p-2 pr-8"
                  >
                    {formatTeacherName(teacher)}
                  </SelectItem>
                ))}
              </div>
            </SelectContent>
          </Select>
          <Toggle
            aria-label="Toggle compact"
            pressed={compact}
            onPressedChange={setCompact}
            variant="outline"
          >
            <LayoutGrid className="size-4 text-zinc-900 dark:text-zinc-50" />
          </Toggle>
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
              <p>↑/↓: Cycle classes</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="text-xs text-nowrap text-zinc-900 dark:text-zinc-50">
          Last updated:{" "}
          {new Date(import.meta.env.VITE_GIT_COMMIT_DATE).toLocaleDateString(
            "en-GB",
            { month: "long", day: "2-digit", year: "numeric" },
          )}
        </div>
      </Card>
      <ScrollArea className="flex-1 h-0">
        <div className='grid min-h-0 grow grid-cols-1 gap-2 md:grid-cols-2 md:gap-4 lg:grid-cols-3'>
          {teacherSchedule.map((item, idx) => (
            <TeacherScheduleItem
              key={idx}
              row={item}
              index={idx}
              compact={compact}
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
