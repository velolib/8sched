import { useState, useMemo } from "react"
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Book, User, Coffee, Sun, Moon, Sunrise, Code } from "lucide-react"
import Papa from "papaparse"

interface ScheduleRow {
  Time: string
  Period: string
  Class_A: string
  Class_B: string
  Class_C: string
  Class_D: string
  Class_E: string
  Class_F: string
  Class_G: string
  Class_H: string
  Class_I: string
  Class_J: string
}

interface TeacherRow {
  Code: string
  Name: string
  Subject: string
}

interface CombinedScheduleRow extends ScheduleRow {
  EndTime: string
  EndPeriod: string
}

const classes = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"]

function ScheduleViewer() {
  const [selectedClass, setSelectedClass] = useState("A")
  const [selectedDay, setSelectedDay] = useState("Senin")

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

  const getCardStyle = (timeSlot: string): string => {
    if (timeSlot.includes("Istirahat")) return "bg-yellow-100 border-yellow-300"
    if (timeSlot.includes("Selesai")) return "bg-gray-100 border-gray-300"
    if (timeSlot.includes("Tadarus")) return "bg-blue-100 border-blue-300"
    if (timeSlot.includes("Kerohanian")) return "bg-green-100 border-green-300"
    return "bg-white border-gray-200"
  }

  const getTimeIcon = (time: string) => {
    const hour = Number.parseInt(time.split(":")[0])
    if (hour < 10) return <Sunrise className="w-4 h-4 text-orange-500" />
    if (hour < 15) return <Sun className="w-4 h-4 text-yellow-500" />
    return <Moon className="w-4 h-4 text-indigo-500" />
  }



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

  const combinedSchedule = useMemo(() => {
    if (!scheduleData) return []
    const combineSchedule = (schedule: ScheduleRow[]): CombinedScheduleRow[] => {
      const combined: CombinedScheduleRow[] = []
      let current: CombinedScheduleRow | null = null

      for (let i = 0; i < schedule.length; i++) {
        const row = schedule[i]
        const nextRow = i < schedule.length - 1 ? schedule[i + 1] : null

        if (!current || row[`Class_${selectedClass}` as keyof ScheduleRow] !== current[`Class_${selectedClass}` as keyof ScheduleRow] || !row.Period) {
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
          <h1 className="text-xl sm:text-2xl font-bold">8Sched</h1>
          <span className="text-xs sm:text-sm text-muted-foreground sm:ml-2 mt-1">by <a href="https://velolib.github.io/" target='_blank' rel='noopener noreferrer' className='underline text-blue-500'>malik / velo</a></span>
        </div>
        <a href="https://github.com/velolib/8sched" target='_blank' rel='noopener noreferrer' className='ml-auto text-xs sm:text-sm text-muted-foreground flex items-center gap-2'><Code className='size-4' /> <span className='hidden md:inline'>Source Code</span></a>
      </div>
      <div className="flex space-x-4 mb-4">
        <Select onValueChange={setSelectedClass} defaultValue={selectedClass}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a class" />
          </SelectTrigger>
          <SelectContent>
            {classes.map((cls) => (
              <SelectItem key={cls} value={cls}>
                XI-{cls}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={setSelectedDay} defaultValue={selectedDay}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a day" />
          </SelectTrigger>
          <SelectContent>
            {days.map((day) => (
              <SelectItem key={day} value={day}>
                {day}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 grow min-h-0">
          {combinedSchedule.map((row, index) => {
            const teacherInfo = teacherData.find((teacher) => teacher.Code === row[`Class_${selectedClass}` as keyof ScheduleRow])
            const isRegularClass = !isNaN(Number.parseInt(row.Period))
            return (
              <Card key={index} className={`${getCardStyle(row.Time)} transition-all hover:shadow-md`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-md font-medium">
                    {isRegularClass && teacherInfo ? (
                                          <div className="flex items-center space-x-2">
                                          <Book className="w-5 h-5 text-blue-500" />
                                          <span className="text-bold capitalize">{teacherInfo.Subject.toLowerCase()}</span>
                                        </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                       <Coffee className="w-5 h-5 text-orange-500" />
                        <span className="text-bold capitalize">{row[`Class_${selectedClass}` as keyof ScheduleRow]}</span>
                      </div>
          )}
                  </CardTitle>
                  {isRegularClass && (
                    <span className="text-xs text-muted-foreground">
                      Jam ke-{row.Period}
                      {row.EndPeriod !== row.Period ? `-${row.EndPeriod}` : ""}
                    </span>
                  )}
                </CardHeader>
                <CardContent>
                  {isRegularClass && teacherInfo ? (
                    <>

                      <div className="flex items-center space-x-2">
                        {getTimeIcon(row.Time)}
                        <span className='text-sm'>
                          {row.Time} - {row.EndTime}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-green-500" />
                        <span className="text-sm capitalize">{teacherInfo.Name.split(",")[0].toLowerCase()}<span className='normal-case'>,{teacherInfo.Name.split(",")[1]}</span></span>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center space-x-2">
                    {getTimeIcon(row.Time)}
                    <span className='text-sm'>
                      {row.Time} - {row.EndTime}
                    </span>
                  </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}

const queryClient = new QueryClient()

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ScheduleViewer />
    </QueryClientProvider>
  )
}

