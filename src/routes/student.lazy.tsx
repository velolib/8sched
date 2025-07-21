import { createLazyFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Keyboard } from "lucide-react";
import { StudentScheduleItem } from "../components/student-schedule-item";
import { useLocalStorage, useSessionStorage } from "@uidotdev/usehooks";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "../components/ui/button";
import { days } from "@/lib/consts";
import { Card } from '@/components/ui/card';
import { useScheduleData } from "../hooks/useScheduleData";
import { useStudentSchedule } from '@/hooks/useStudentSchedule';
import { ComboBoxResponsive } from '@/components/ui/combo-box-responsive';

export const Route = createLazyFileRoute('/student')({
  component: StudentComponent,
})

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

function StudentComponent() {
  // Update hash in localStorage if it has changed
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

  const [currentDate, setCurrentDate] = useState(new Date());

  const handleClassChange = (newClass: string) => {
    setSelectedClass(newClass);
  };

  const handleDayChange = (newDay: string) => {
    setSelectedDay(newDay);
  };

  // Handle keyboard shortcuts for day and class selection
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
      // ArrowUp/ArrowDown to cycle classes (ComboBox)
      const classIndex = classes.indexOf(selectedClass);
      if (e.key === "ArrowUp") {
        e.preventDefault();
        const prevIndex = (classIndex - 1 + classes.length) % classes.length;
        setSelectedClass(classes[prevIndex]);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        const nextIndex = (classIndex + 1) % classes.length;
        setSelectedClass(classes[nextIndex]);
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [selectedClass, selectedDay]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000); // Update every minute
    const onFocus = () => setCurrentDate(new Date());
    window.addEventListener("focus", onFocus);
    return () => {
      clearInterval(intervalId);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  const [scheduleResult, teacherResult] = useScheduleData();
  const combinedSchedule = useStudentSchedule(
    scheduleResult.data,
    selectedDay,
    selectedClass
  );

  return (
    <>
      <Card className="mb-2 flex flex-col items-center gap-2 md:mb-4 md:flex-row p-4">
        <div className="flex w-full gap-2 md:w-auto">
          <ComboBoxResponsive
            options={classes.map((cls) => ({ value: cls, label: cls }))}
            value={selectedClass}
            onChange={handleClassChange}
            placeholder="Select a class"
            className="w-full md:w-[120px]"
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
              <p>↑/↓: Cycle classes</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="text-xs text-nowrap text-zinc-900 dark:text-zinc-50 text-center">
          {new Date(import.meta.env.VITE_GIT_COMMIT_DATE).toLocaleDateString(
            "en-GB",
            { month: "long", day: "2-digit", year: "numeric" }
          )}
        </div>
      </Card>
      <ScrollArea className="flex-1 h-0">
        <div className="grid min-h-0 grid-cols-1 gap-2 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
          {combinedSchedule.map(
            (row, index) =>
              row.period != "Selesai" && (
                <StudentScheduleItem
                  key={`${index}-${selectedClass}-${selectedDay}`}
                  row={row}
                  index={index}
                  teacherData={teacherResult.data ?? []}
                  day={selectedDay}
                  currentDate={currentDate}
                />
              ),
          )}
        </div>
      </ScrollArea>
    </>
  );
}

