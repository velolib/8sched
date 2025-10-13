import { ComboBoxResponsive } from "@/components/ui/combo-box-responsive";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { days } from "@/lib/consts";
import { Schedule } from "@/types/schedule";
import { SchedulesTable } from "@/components/admin/schedules-table";
import { checkIfTeacherCode } from "@/lib/utils";
import { toast } from "sonner";
import { useQueries, useMutation } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { useCallback } from "react";

export const Route = createLazyFileRoute("/admin/schedules")({
  component: RouteComponent,
  pendingComponent: () => (
    <div className="flex h-32 items-center justify-center">
      <Spinner className="size-8" />
    </div>
  ),
});

function RouteComponent() {
  // State & Queries
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState("Senin");
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null,
  );
  const [selectedTeacherCode, setSelectedTeacherCode] = useState<string | null>(
    null,
  );
  const [editedSchedulesMap, setEditedSchedulesMap] = useState<
    Record<number, Schedule>
  >({});
  const [originalSchedulesCodes, setOriginalSchedulesCodes] = useState<
    Record<number, string>
  >({});
  const [recapCount, setRecapCount] = useState(0);

  // Data queries
  const results = useQueries({
    queries: [
      {
        queryKey: ["schedules"],
        queryFn: async () => {
          const res = await fetch("/api/schedules");
          if (!res.ok) throw new Error("Network response was not ok");
          return (await res.json()) as Schedule[];
        },
      },
      {
        queryKey: ["teachers"],
        queryFn: async () => {
          const res = await fetch("/api/teachers");
          if (!res.ok) throw new Error("Network response was not ok");
          return await res.json();
        },
      },
    ],
  });
  const schedulesQuery = results[0];
  const teachersQuery = results[1];

  // Derived Data
  const dayIndex = days.indexOf(selectedDay);
  const baseSchedules = useMemo(() => {
    return Array.isArray(schedulesQuery.data)
      ? schedulesQuery.data.filter((item: Schedule) => item.day === dayIndex)
      : [];
  }, [schedulesQuery.data, dayIndex]);

  const filteredSchedules = useMemo(() => {
    const editedScheduleValues = Object.values(editedSchedulesMap);
    if (editedScheduleValues.length === 0) {
      return baseSchedules;
    }
    const baseScheduleMap = new Map(baseSchedules.map((s) => [s.id, s]));
    editedScheduleValues.forEach((s) => {
      baseScheduleMap.set(s.id, s);
    });
    return Array.from(baseScheduleMap.values());
  }, [baseSchedules, editedSchedulesMap]);

  // Update originalSchedulesCodes when baseSchedules change
  useEffect(() => {
    const codes: Record<number, string> = {};
    baseSchedules.forEach((s: Schedule) => {
      codes[s.id] = s.teacher_code;
    });
    setOriginalSchedulesCodes(codes);
  }, [baseSchedules]);

  // Mutations
  const saveMutation = useMutation({
    mutationFn: async (changes: Schedule[]) => {
      const res = await fetch("/api/schedules", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(changes),
      });
      if (!res.ok) throw new Error("Failed to save changes");
      return res;
    },
    onSuccess: async () => {
      await schedulesQuery.refetch();
      setEditedSchedulesMap({});
      toast.success("Schedule changes saved successfully");
    },
    onError: (err) => {
      console.error("Error saving changes:", err);
      toast.error("Failed to save schedule changes");
    },
  });

  // Handlers
  const handleDayChange = (day: string) => {
    setSelectedDay(day);
  };

  const handleCellClick = useCallback((schedule: Schedule | null) => {
    setIsDialogOpen(true);
    setSelectedSchedule(schedule);
    setSelectedTeacherCode(schedule?.teacher_code ?? null);
  }, []);

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setSelectedSchedule(null);
      setSelectedTeacherCode(null);
    }
  };

  const handleSubmit = () => {
    if (selectedSchedule && selectedTeacherCode) {
      const changedSchedule = {
        ...selectedSchedule,
        teacher_code: selectedTeacherCode,
      };
      setEditedSchedulesMap((prev) => ({
        ...prev,
        [changedSchedule.id]: changedSchedule,
      }));
    }
    setIsDialogOpen(false);
    setSelectedSchedule(null);
    setSelectedTeacherCode(null);
  };

  const handleSave = () => {
    const changes = getChangedSchedules();
    if (changes.length === 0) {
      setEditedSchedulesMap({});
      return;
    }
    setRecapCount(changes.length);
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmSave = () => {
    setIsConfirmDialogOpen(false);
    saveMutation.mutate(getChangedSchedules());
  };

  // Helpers
  const getChangedSchedules = useCallback(() => {
    return Object.values(editedSchedulesMap).filter((s) => {
      return (
        s.id &&
        originalSchedulesCodes[s.id] !== undefined &&
        s.teacher_code !== originalSchedulesCodes[s.id]
      );
    });
  }, [editedSchedulesMap, originalSchedulesCodes]);

  // Derived value: are there any unsaved changes?
  const hasChanges = useMemo(
    () => getChangedSchedules().length > 0,
    [getChangedSchedules],
  );

  // Warn before leaving page if there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasChanges]);

  // Render
  if (schedulesQuery.isLoading || teachersQuery.isLoading) {
    return (
      <div className="flex h-32 items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (schedulesQuery.isError || teachersQuery.isError) {
    return (
      <div>
        Error:{" "}
        {schedulesQuery.isError
          ? (schedulesQuery.error as Error).message
          : (teachersQuery.error as Error).message}
      </div>
    );
  }

  return (
    <>
      <Card className="mb-4 gap-0 p-4">
        <h1 className="text-2xl font-semibold tracking-tight text-pretty">
          Schedules Table
        </h1>
        <p className="text-muted-foreground mt-1 text-base">
          Easily view, edit, and manage class schedules for <b>8Sched</b>.
          Select a day to get started.
        </p>
      </Card>
      <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Schedule</DialogTitle>
            <DialogDescription>
              Select a teacher for <b>{selectedSchedule?.class_name}</b> at{" "}
              <b>{selectedSchedule?.time_slot}</b>.
            </DialogDescription>
          </DialogHeader>
          <ComboBoxResponsive
            options={teachersQuery.data
              .filter((teacher: { code: string; name: string }) =>
                checkIfTeacherCode(teacher.code),
              )
              .map((teacher: { code: string; name: string }) => ({
                value: teacher.code,
                label: `${teacher.code} ${teacher.name}`,
              }))}
            value={selectedTeacherCode ?? ""}
            onChange={setSelectedTeacherCode}
            placeholder="Select a teacher"
            className="w-full"
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSubmit} disabled={!selectedTeacherCode}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Card className="mb-2 flex flex-col items-center gap-2 p-4 md:mb-4 md:flex-row">
        <Tabs
          value={selectedDay}
          onValueChange={hasChanges ? undefined : handleDayChange}
          className="w-full"
        >
          <TabsList className="w-full flex-wrap justify-start">
            {days.map((day) => (
              <TabsTrigger
                key={day}
                value={day}
                className="flex-1"
                disabled={hasChanges}
              >
                <span className="hidden sm:inline">{day}</span>
                <span className="sm:hidden">{day.slice(0, 3)}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </Card>
      <Card className="p-4">
        <SchedulesTable
          schedules={filteredSchedules}
          handleCellClick={handleCellClick}
          originalSchedulesCodes={originalSchedulesCodes}
          isPending={saveMutation.isPending}
          teachers={teachersQuery.data}
        />
      </Card>
      {hasChanges && (
        <>
          <div
            className="fixed right-4 bottom-4 z-50 flex items-center justify-center gap-2"
            style={{ pointerEvents: "auto" }}
          >
            {saveMutation.isPending ? (
              <Spinner className="mr-2 size-4" />
            ) : null}
            <Button
              disabled={saveMutation.isPending}
              variant="default"
              onClick={() => {
                setEditedSchedulesMap({});
              }}
            >
              Discard Changes
            </Button>
            <Button
              variant="default"
              onClick={handleSave}
              disabled={saveMutation.isPending}
            >
              Save Changes
            </Button>
          </div>
          <Dialog
            open={isConfirmDialogOpen}
            onOpenChange={setIsConfirmDialogOpen}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Save</DialogTitle>
                <DialogDescription>
                  You are about to save changes to the schedule.
                  <br />
                  <b>{recapCount}</b> schedule(s) will be updated.
                  <br />
                  Do you want to continue?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button
                  variant="default"
                  onClick={handleConfirmSave}
                  disabled={saveMutation.isPending}
                >
                  {saveMutation.isPending ? (
                    <Spinner className="mr-2 size-4" />
                  ) : null}
                  Confirm
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </>
  );
}
