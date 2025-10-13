import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useScheduleQuery } from "@/hooks/useScheduleQuery";
import { useTeacherSchedule } from "@/hooks/useTeacherSchedule";
import { days } from "@/lib/consts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { createLazyFileRoute } from "@tanstack/react-router";
import { Keyboard } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ComboBoxResponsive } from "@/components/ui/combo-box-responsive";
import { useTeacherQuery } from "@/hooks/useTeacherQuery";
import { useSessionStorage } from "@uidotdev/usehooks";
import { TeacherScheduleItem } from "@/components/teacher-schedule-item";
import { Spinner } from "@/components/ui/spinner";

export const Route = createLazyFileRoute("/_user/teacher")({
  component: RouteComponent,
  pendingComponent: () => (
    <div className="flex h-32 items-center justify-center">
      <Spinner className="size-8" />
    </div>
  ),
});

function RouteComponent() {
  const scheduleQuery = useScheduleQuery();
  const teacherQuery = useTeacherQuery();

  const uniqueTeacherNames = useMemo(() => {
    return teacherQuery.data
      ? [...new Set(teacherQuery.data.map((t) => t.name))].sort()
      : [];
  }, [teacherQuery.data]);

  // Adapted to use teacherResult.data as TeacherRow[] | undefined
  const [selectedTeacherName, setSelectedTeacherName] = useState<string>("");
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    if (uniqueTeacherNames.length > 0 && !selectedTeacherName) {
      setSelectedTeacherName(uniqueTeacherNames[0]);
    }
  }, [uniqueTeacherNames, selectedTeacherName]);

  const defaultDayIndex = Math.max(0, Math.min(4, new Date().getDay() - 1));
  const [selectedDay, setSelectedDay] = useSessionStorage(
    "selectedDay",
    defaultDayIndex,
  );

  function handleTeacherChange(value: string) {
    setSelectedTeacherName(value);
  }

  function handleDayChange(value: number | string) {
    setSelectedDay(Number(value));
  }

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

  const combinedSchedule = useTeacherSchedule(
    scheduleQuery.data,
    teacherQuery.data,
    selectedDay,
    selectedTeacherName,
  );

  // console.log(combinedSchedule);

  // Keyboard shortcuts: 1-5 for days, arrows for cycling
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
      // ArrowUp/ArrowDown to cycle teachers (ComboBox)
      const teacherIndex = uniqueTeacherNames.indexOf(selectedTeacherName);
      if (e.key === "ArrowUp") {
        e.preventDefault();
        const prevIndex =
          (teacherIndex - 1 + uniqueTeacherNames.length) %
          uniqueTeacherNames.length;
        setSelectedTeacherName(uniqueTeacherNames[prevIndex]);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        const nextIndex = (teacherIndex + 1) % uniqueTeacherNames.length;
        setSelectedTeacherName(uniqueTeacherNames[nextIndex]);
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [selectedDay, selectedTeacherName, uniqueTeacherNames, setSelectedDay]);

  if (scheduleQuery.isLoading || teacherQuery.isLoading) {
    return (
      <div className="flex h-32 items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  return (
    <>
      <Card className="mb-4 gap-0 p-4">
        <h1 className="text-2xl font-semibold tracking-tight text-pretty">
          Teacher Schedule
        </h1>
        <p className="text-muted-foreground mt-1 text-base">
          View a teacher's schedule by selecting a name and day to see the
          timetable.
        </p>
      </Card>
      <Card className="mb-2 flex flex-col items-center gap-2 p-4 md:mb-4 md:flex-row">
        <div className="flex w-full gap-2 md:w-auto">
          <ComboBoxResponsive
            options={uniqueTeacherNames.map((name) => ({
              value: name,
              label: name,
            }))}
            value={selectedTeacherName}
            onChange={handleTeacherChange}
            placeholder="Select a teacher"
            className="w-full md:w-[180px]"
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
              <p>↑/↓: Cycle teachers</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="text-center text-xs text-nowrap text-zinc-900 dark:text-zinc-50">
          {/* {new Date(import.meta.env.VITE_GIT_COMMIT_DATE).toLocaleDateString(
            "en-GB",
            { month: "long", day: "2-digit", year: "numeric" },
          )} */}
        </div>
      </Card>
      <ScrollArea className="flex-1">
        <div className="grid min-h-0 grid-cols-1 gap-2 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
          {combinedSchedule?.map((block, index) => (
            <TeacherScheduleItem
              key={`${index}-${selectedTeacherName}-${days[selectedDay]}`}
              index={index}
              block={block}
              day={days[selectedDay]}
              currentDate={currentDate}
            />
          ))}
        </div>
      </ScrollArea>
    </>
  );
}
