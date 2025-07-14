import { useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Code, Keyboard, LayoutGrid } from "lucide-react";
import type {
  ScheduleRow,
  TeacherRow,
  CombinedScheduleRow,
} from "./types/schedule";
import Papa from "papaparse";
import { ScheduleItem } from "./components/schedule-item";
import { useLocalStorage, useSessionStorage } from "@uidotdev/usehooks";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ModeToggle } from "./components/mode-toggle";
import { Button } from "./components/ui/button";
import { Toggle } from "./components/ui/toggle";
import { days } from "@/lib/consts";

const classes = [
  "X-A",
  "X-B",
  "X-C",
  "X-D",
  "X-E",
  "X-F",
  "X-G",
  "X-H",
  "X-I",
  "X-J",
  "XI-A",
  "XI-B",
  "XI-C",
  "XI-D",
  "XI-E",
  "XI-F",
  "XI-G",
  "XI-H",
  "XI-I",
  "XI-J",
  "XII-A",
  "XII-B",
  "XII-C",
  "XII-D",
  "XII-E",
  "XII-F",
  "XII-G",
  "XII-H",
  "XII-I",
  "XII-J",
];

export function ScheduleViewer() {
  useEffect(() => {
    const storedHash = localStorage.getItem("VITE_GIT_COMMIT_HASH");
    const currentHash = import.meta.env.VITE_GIT_COMMIT_HASH;

    console.log("Stored Commit Hash:", storedHash);
    console.log("Current Commit Hash:", currentHash);

    if (!storedHash) {
      console.log("No stored hash found. Setting initial commit hash.");
      localStorage.clear();
      localStorage.setItem("VITE_GIT_COMMIT_HASH", currentHash);
    }

    if (storedHash !== currentHash) {
      console.log("Commit hash changed! Updating localStorage...");
      localStorage.clear();
      localStorage.setItem("VITE_GIT_COMMIT_HASH", currentHash);
    } else {
      console.log("Commit hash is the same. No update needed.");
    }
  }, []);

  const [selectedClass, setSelectedClass] = useLocalStorage(
    "selectedClass",
    "X-A",
  );
  const [selectedDay, setSelectedDay] = useSessionStorage(
    "selectedDay",
    days[new Date().getDay() - 1] || "Senin",
  );
  const [compact, setCompact] = useLocalStorage("compact", false);

  const handleClassChange = (newClass: string) => {
    setSelectedClass(newClass);
  };

  const handleDayChange = (newDay: string) => {
    setSelectedDay(newDay);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Number keys 1-5 for days
      if (e.key >= "1" && e.key <= "5") {
        const index = Number.parseInt(e.key) - 1;
        if (index < days.length) {
          setSelectedDay(days[index]);
        }
      }
      // TODO: Reimplement this feature for more classes
      // Letters A-J for classes
      // const classIndex = classes.indexOf(e.key.toUpperCase());
      // if (classIndex !== -1) {
      //   setSelectedClass(classes[classIndex]);
      // }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [setSelectedClass, setSelectedDay]);

  const {
    data: scheduleData,
    isLoading: scheduleLoading,
    error: scheduleError,
    isSuccess: scheduleSuccess,
  } = useQuery<ScheduleRow[]>({
    queryKey: ["scheduleData"],
    queryFn: async () => {
      const response = await fetch("/data.csv");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const text = await response.text();
      const rows = Papa.parse(text, { delimiter: "," }).data as string[][];
      return rows.map((row) => ({
        time: row[0] || "",
        period: row[1] || "",
        "X-A": row[2] || "",
        "X-B": row[3] || "",
        "X-C": row[4] || "",
        "X-D": row[5] || "",
        "X-E": row[6] || "",
        "X-F": row[7] || "",
        "X-G": row[8] || "",
        "X-H": row[9] || "",
        "X-I": row[10] || "",
        "X-J": row[11] || "",
        "XI-A": row[12] || "",
        "XI-B": row[13] || "",
        "XI-C": row[14] || "",
        "XI-D": row[15] || "",
        "XI-E": row[16] || "",
        "XI-F": row[17] || "",
        "XI-G": row[18] || "",
        "XI-H": row[19] || "",
        "XI-I": row[20] || "",
        "XI-J": row[21] || "",
        "XII-A": row[22] || "",
        "XII-B": row[23] || "",
        "XII-C": row[24] || "",
        "XII-D": row[25] || "",
        "XII-E": row[26] || "",
        "XII-F": row[27] || "",
        "XII-G": row[28] || "",
        "XII-H": row[29] || "",
        "XII-I": row[30] || "",
        "XII-J": row[31] || "",
      }));
    },
  });

  const {
    data: teacherData,
    isLoading: teacherLoading,
    error: teacherError,
    isSuccess: teacherSuccess,
  } = useQuery<TeacherRow[]>({
    queryKey: ["teacherData"],
    queryFn: async () => {
      const response = await fetch("/data_guru.csv");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const text = await response.text();
      const rows = Papa.parse(text, { delimiter: "," }).data as string[][];
      return rows.map((row) => ({
        code: row[0] || "",
        name: row[1] || "",
        subject: row[2] || "",
      }));
    },
  });

  // Group schedule by day
  const combinedSchedule = useMemo(() => {
    const groupSchedules = (data: ScheduleRow[]) => {
      const result: ScheduleRow[][] = [];
      let currentDay: ScheduleRow[] = [];

      data.forEach((item) => {
        if (item.time === "06:30") {
          if (currentDay.length > 0) {
            result.push(currentDay);
          }
          currentDay = [];
        }
        currentDay.push(item);
      });

      if (currentDay.length > 0) {
        result.push(currentDay);
      }

      return result;
    };

    if (!scheduleData) return [];

    const combineSchedule = (
      schedule: ScheduleRow[],
    ): CombinedScheduleRow[] => {
      const combined: CombinedScheduleRow[] = [];
      let current: CombinedScheduleRow | null = null;

      for (let i = 0; i < schedule.length; i++) {
        const row = schedule[i];
        const nextRow = i < schedule.length - 1 ? schedule[i + 1] : null;

        if (!row[selectedClass as keyof ScheduleRow]) {
          continue;
        }

        if (
          !current ||
          row[selectedClass as keyof ScheduleRow] !==
            current[selectedClass as keyof ScheduleRow] ||
          !row.period
        ) {
          if (current) {
            combined.push(current);
          }
          current = {
            ...row,
            endTime: nextRow ? nextRow.time : "Selesai",
            endPeriod: row.period,
          };
        } else {
          current.endTime = nextRow ? nextRow.time : "Selesai";
          current.endPeriod = row.period;
        }
      }

      if (current) {
        combined.push(current);
      }

      return combined;
    };

    // Filter schedule by selected day
    const filteredSchedule =
      groupSchedules(scheduleData)[days.indexOf(selectedDay)];

    return combineSchedule(filteredSchedule);
  }, [scheduleData, selectedDay, selectedClass]);

  if (scheduleLoading || teacherLoading)
    return <div className="p-4 text-center">Loading...</div>;
  if (scheduleError || !scheduleSuccess || teacherError || !teacherSuccess)
    return (
      <div className="p-4 text-center text-red-500">
        Error: {(scheduleError as Error).message}
      </div>
    );

  return (
    <div className="container mx-auto flex h-dvh flex-col p-4 px-8">
      <div className="mb-4 flex items-center">
        <div className="flex flex-col sm:flex-row sm:items-center">
          <h1 className="text-xl font-bold text-zinc-900 sm:text-2xl dark:text-zinc-50">
            8Sched
          </h1>
          <span className="mt-1 text-xs text-zinc-900 sm:ml-2 sm:text-sm dark:text-zinc-50">
            by{" "}
            <a
              href="https://velolib.github.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              malik
            </a>
          </span>
        </div>
        <Button variant={"outline"} className="ml-auto hidden md:flex" asChild>
          <a
            href="https://github.com/velolib/8sched"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Code className="size-4" /> <span>Source Code</span>
          </a>
        </Button>
        <Button
          variant={"outline"}
          className="ml-auto flex items-center justify-center md:hidden"
          size="icon"
        >
          <a
            href="https://github.com/velolib/8sched"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center"
          >
            <Code className="size-4" />
          </a>
        </Button>
        <ModeToggle className="ml-2" />
      </div>
      <div className="mb-2 flex flex-col items-center gap-2 md:mb-4 md:flex-row">
        <div className="flex w-full gap-2 md:w-auto">
          <Select onValueChange={handleClassChange} value={selectedClass}>
            <SelectTrigger className="w-full md:w-[120px]">
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
                    {cls}
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
                <Keyboard className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Keyboard shortcuts:</p>
              <p>1-5: Select day</p>
              <p>A-J: Select class</p>
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
      </div>
      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="grid min-h-0 grow grid-cols-1 gap-2 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
          {combinedSchedule.map(
            (row, index) =>
              row.period != "Selesai" && (
                <ScheduleItem
                  key={`${index}-${selectedClass}-${selectedDay}`}
                  row={row}
                  index={index}
                  selectedClass={selectedClass}
                  teacherData={teacherData}
                  compact={compact}
                  day={selectedDay}
                />
              ),
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
