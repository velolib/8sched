import { createLazyFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Keyboard } from "lucide-react";
import { StudentScheduleItem } from "../../components/student-schedule-item";
import { useLocalStorage, useSessionStorage } from "@uidotdev/usehooks";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "../../components/ui/button";
import { classes, days } from "@/lib/consts";
import { Card } from "@/components/ui/card";
import { useScheduleQuery } from "../../hooks/useScheduleQuery";
import { useStudentSchedule } from "@/hooks/useStudentSchedule";
import { ComboBoxResponsive } from "@/components/ui/combo-box-responsive";
import { useTeacherQuery } from "@/hooks/useTeacherQuery";
import { Spinner } from "@/components/ui/spinner";

export const Route = createLazyFileRoute("/_user/student")({
  component: StudentComponent,
  pendingComponent: () => (
    <div className="flex h-32 items-center justify-center">
      <Spinner className="size-8" />
    </div>
  ),
});

function StudentComponent() {
  const [selectedClass, setSelectedClass] = useLocalStorage(
    "selectedClass",
    "X-A",
  );
  // Use number for selectedDay (0-4)
  const defaultDayIndex = Math.max(0, Math.min(4, new Date().getDay() - 1));
  const [selectedDay, setSelectedDay] = useSessionStorage(
    "selectedDay",
    defaultDayIndex,
  );

  const [currentDate, setCurrentDate] = useState(new Date());

  const handleClassChange = (newClass: string) => {
    setSelectedClass(newClass);
  };

  const handleDayChange = (newDayIndex: number | string) => {
    // Tabs will pass string, so convert to number
    setSelectedDay(Number(newDayIndex));
  };

  // Handle keyboard shortcuts for day and class selection
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Number keys 1-5 for days
      if (e.key >= "1" && e.key <= "5") {
        const index = Number.parseInt(e.key) - 1;
        if (index < days.length) {
          setSelectedDay(index);
        }
      }
      // ArrowLeft/ArrowRight to cycle days
      if (e.key === "ArrowLeft") {
        const prevIndex = (selectedDay - 1 + days.length) % days.length;
        setSelectedDay(prevIndex);
      } else if (e.key === "ArrowRight") {
        const nextIndex = (selectedDay + 1) % days.length;
        setSelectedDay(nextIndex);
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
  }, [selectedClass, selectedDay, setSelectedClass, setSelectedDay]);

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

  const scheduleQuery = useScheduleQuery();
  const teacherQuery = useTeacherQuery();

  // Pass day name to useStudentSchedule
  const combinedSchedule = useStudentSchedule(
    scheduleQuery.data,
    teacherQuery.data,
    selectedDay,
    selectedClass,
  );

  if (scheduleQuery.isLoading || teacherQuery.isLoading) {
    return (
      <div className="flex h-32 items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  // console.log(combinedSchedule);

  return (
    <>
      <Card className="mb-4 gap-0 p-4">
        <h1 className="text-2xl font-semibold tracking-tight text-pretty">
          Student Schedule
        </h1>
        <p className="text-muted-foreground mt-1 text-base">
          View a class's schedule by selecting a class and day to see the
          timetable.
        </p>
      </Card>
      <Card className="mb-4 flex flex-col items-center gap-2 p-4 md:flex-row">
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
          value={String(selectedDay)}
          onValueChange={handleDayChange}
          className="w-full"
        >
          <TabsList className="w-full flex-wrap justify-start">
            {days.map((day, idx) => (
              <TabsTrigger key={day} value={String(idx)} className="flex-1">
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
        {/* <div className="text-center text-xs text-nowrap text-zinc-900 dark:text-zinc-50">
          {new Date(import.meta.env.VITE_GIT_COMMIT_DATE).toLocaleDateString(
            "en-GB",
            { month: "long", day: "2-digit", year: "numeric" },
          )}
        </div> */}
      </Card>
      <div className="grid min-h-0 grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {combinedSchedule?.map((block, index) => (
          <StudentScheduleItem
            key={`${index}-${selectedClass}-${days[selectedDay]}`}
            index={index}
            block={block}
            day={days[selectedDay]}
            currentDate={currentDate}
          />
        ))}
      </div>
    </>
  );
}
