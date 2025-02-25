import { useMemo, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Code, Keyboard, LayoutGrid } from "lucide-react"
import type { ScheduleRow, TeacherRow, CombinedScheduleRow } from "./types/schedule"
import Papa from "papaparse"
import { ScheduleItem } from "./components/schedule-item"
import { useLocalStorage, useSessionStorage } from "@uidotdev/usehooks"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ModeToggle } from './components/mode-toggle'
import { Button } from './components/ui/button'
import { Toggle } from './components/ui/toggle'

const classes = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"]

export function ScheduleViewer() {
  const [selectedClass, setSelectedClass] = useLocalStorage("selectedClass", "A")
  const [selectedDay, setSelectedDay] = useSessionStorage("selectedDay", days[new Date().getDay() - 1] || "Senin")
  const [compact, setCompact] = useLocalStorage("compact", false)

  const handleClassChange = (newClass: string) => {
    setSelectedClass(newClass)
  }

  const handleDayChange = (newDay: string) => {
    setSelectedDay(newDay)
  }

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Number keys 1-5 for days
      if (e.key >= "1" && e.key <= "5") {
        const index = Number.parseInt(e.key) - 1
        if (index < days.length) {
          setSelectedDay(days[index])
        }
      }
      // Letters A-J for classes
      const classIndex = classes.indexOf(e.key.toUpperCase())
      if (classIndex !== -1) {
        setSelectedClass(classes[classIndex])
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [setSelectedClass, setSelectedDay])

  const {
    data: scheduleData,
    isLoading: scheduleLoading,
    error: scheduleError,
    isSuccess: scheduleSuccess,
  } = useQuery<ScheduleRow[]>({
    queryKey: ["scheduleData"],
    queryFn: async () => {
      const response = await fetch("/data.csv")
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      const text = await response.text()
      const rows = Papa.parse(text, { delimiter: "," }).data as string[][]
      return rows.map((row) => ({
        Time: row[0] || "",
        Period: row[1] || "",
        Class_A: row[2] || "",
        Class_B: row[3] || "",
        Class_C: row[4] || "",
        Class_D: row[5] || "",
        Class_E: row[6] || "",
        Class_F: row[7] || "",
        Class_G: row[8] || "",
        Class_H: row[9] || "",
        Class_I: row[10] || "",
        Class_J: row[11] || "",
      }))
    },
  })

  const {
    data: teacherData,
    isLoading: teacherLoading,
    error: teacherError,
    isSuccess: teacherSuccess,
  } = useQuery<TeacherRow[]>({
    queryKey: ["teacherData"],
    queryFn: async () => {
      const response = await fetch("/data_guru.csv")
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      const text = await response.text()
      const rows = Papa.parse(text, { delimiter: "," }).data as string[][]
      return rows.map((row) => ({
        Code: row[0] || "",
        Name: row[1] || "",
        Subject: row[2] || "",
      }))
    },
  })

  const combinedSchedule = useMemo(() => {
    const splitSchedules = (data: ScheduleRow[]) => {
      const result: ScheduleRow[][] = []
      let currentDay: ScheduleRow[] = []
  
      data.forEach((item) => {
        if (item.Time === "06:30") {
          if (currentDay.length > 0) {
            result.push(currentDay)
          }
          currentDay = []
        }
        currentDay.push(item)
      })
  
      if (currentDay.length > 0) {
        result.push(currentDay)
      }
  
      return result
    }

    if (!scheduleData) return []
    const combineSchedule = (schedule: ScheduleRow[]): CombinedScheduleRow[] => {
      const combined: CombinedScheduleRow[] = []
      let current: CombinedScheduleRow | null = null

      for (let i = 0; i < schedule.length; i++) {
        const row = schedule[i]
        const nextRow = i < schedule.length - 1 ? schedule[i + 1] : null

        if (
          !current ||
          row[`Class_${selectedClass}` as keyof ScheduleRow] !==
            current[`Class_${selectedClass}` as keyof ScheduleRow] ||
          !row.Period
        ) {
          if (current) {
            combined.push(current)
          }
          current = {
            ...row,
            EndTime: nextRow ? nextRow.Time : "Selesai",
            EndPeriod: row.Period,
          }
        } else {
          current.EndTime = nextRow ? nextRow.Time : "Selesai"
          current.EndPeriod = row.Period
        }
      }

      if (current) {
        combined.push(current)
      }

      return combined
    }
    const filteredSchedule = splitSchedules(scheduleData)[days.indexOf(selectedDay)]
    return combineSchedule(filteredSchedule)
  }, [scheduleData, selectedDay, selectedClass])

  if (scheduleLoading || teacherLoading) return <div className="p-4 text-center">Loading...</div>
  if (scheduleError || !scheduleSuccess || teacherError || !teacherSuccess)
    return <div className="p-4 text-center text-red-500">Error: {(scheduleError as Error).message}</div>

  return (
    <div className="container mx-auto p-4 px-8 h-dvh flex flex-col">
      <div className="flex mb-4 items-center">
        <div className="flex sm:items-center sm:flex-row flex-col">
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-50">8Sched</h1>
          <span className="text-xs sm:text-sm text-zinc-900 dark:text-zinc-50 sm:ml-2 mt-1">
            by{" "}
            <a
              href="https://velolib.github.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-500"
            >
              malik / velo
            </a>
          </span>
        </div>
        <Button variant={'outline'} className='ml-auto hidden md:block'>
          <a
            href="https://github.com/velolib/8sched"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <Code className="size-4" /> <span>Source Code</span>
          </a>
        </Button>
        <Button variant={'outline'} className='ml-auto md:hidden flex items-center justify-center' size='icon'>
          <a
            href="https://github.com/velolib/8sched"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center"
          >
            <Code className="size-4" />
          </a>
        </Button>
        <ModeToggle className='ml-2' />
      </div>
      <div className="flex flex-col items-center md:flex-row gap-2 mb-4">
        <div className="flex gap-2 w-full md:w-auto">
          <Select onValueChange={handleClassChange} value={selectedClass}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Select a class" />
            </SelectTrigger>
            <SelectContent>
              <div className="grid grid-cols-2 gap-2 p-2">
                {classes.map((cls) => (
                  <SelectItem
                    key={cls}
                    value={cls}
                    className="flex items-center justify-center rounded-md p-2 pr-8"
                  >
                    XI-{cls}
                  </SelectItem>
                ))}
              </div>
            </SelectContent>
          </Select>
          <Toggle aria-label="Toggle compact" pressed={compact} onPressedChange={setCompact} variant='outline'>
            <LayoutGrid className="h-4 w-4 text-zinc-900 dark:text-zinc-50" />
          </Toggle>
        </div>

        <Tabs value={selectedDay} onValueChange={handleDayChange} className="w-full">
          <TabsList className="w-full justify-start flex-wrap">
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
              <button className="p-2 text-zinc-900 dark:text-zinc-50 hover:text-foreground hidden md:block">
                <Keyboard className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Keyboard shortcuts:</p>
              <p>1-5: Select day</p>
              <p>A-J: Select class</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 grow min-h-0">
          {combinedSchedule.map((row, index) => (
            row.Period != "Selesai" && <ScheduleItem
            key={`${index}-${selectedClass}-${selectedDay}`}
            row={row}
            index={index}
            selectedClass={selectedClass}
            teacherData={teacherData}
            compact={compact}
          />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
