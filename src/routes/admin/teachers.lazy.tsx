import { Card } from "@/components/ui/card";
import { TeachersTable } from "@/components/admin/teachers-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Teacher } from "@/types/schedule";
import { useState, useMemo, useEffect } from "react";
import { useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { validateCode } from "@/lib/utils";
import { checkIfReservedCode } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

export const Route = createLazyFileRoute("/admin/teachers")({
  component: RouteComponent,
  pendingComponent: () => (
    <div className="flex h-32 items-center justify-center">
      <Spinner className="size-8" />
    </div>
  ),
});

function RouteComponent() {
  // State & Queries
  const [editedTeachersMap, setEditedTeachersMap] = useState<
    Record<number, Teacher>
  >({});
  const [removedTeacherIds, setRemovedTeacherIds] = useState<Set<number>>(
    new Set(),
  );
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [removeId, setRemoveId] = useState<number | null>(null);
  const [recapCounts, setRecapCounts] = useState<{
    added: number;
    edited: number;
    removed: number;
  }>({ added: 0, edited: 0, removed: 0 });

  // Data query
  const teachersQuery = useQuery({
    queryKey: ["teachers"],
    queryFn: async () => {
      const res = await fetch("/api/teachers");
      if (!res.ok) throw new Error("Network response was not ok");
      return (await res.json()) as Teacher[];
    },
    staleTime: Infinity,
  });

  // Derived Data
  const baseTeachers = useMemo(
    () => (Array.isArray(teachersQuery.data) ? teachersQuery.data : []),
    [teachersQuery.data],
  );

  const teachers = useMemo(() => {
    const editedValues = Object.values(editedTeachersMap);
    const baseMap = new Map(baseTeachers.map((t) => [t.id, t]));

    if (editedValues.length > 0) {
      editedValues.forEach((t) => {
        if (t.id != null) {
          baseMap.set(t.id, t);
        }
      });
    }

    const allTeachers = Array.from(baseMap.values());
    return allTeachers.filter((t) => !removedTeacherIds.has(t.id));
  }, [baseTeachers, editedTeachersMap, removedTeacherIds]);

  const allValid =
    teachers.length > 0 &&
    teachers.every((t) => isTeacherValid(t, teachers)) &&
    teachers
      .filter((t) => t.id == null || t.id <= 0)
      .every((t) => !checkIfReservedCode(t.code));

  // Handlers
  const handleAdd = useCallback(() => {
    const currentTeachers = teachers;
    const minId = Math.min(0, ...currentTeachers.map((t) => t.id ?? 0));
    const newTeacher = { id: minId - 1, code: "", name: "", subject: "" };
    setEditedTeachersMap((prev) => ({
      ...prev,
      [newTeacher.id]: newTeacher,
    }));
  }, [teachers]);

  const handleRemove = useCallback((id: number) => {
    setRemoveId(id);
    setIsRemoveDialogOpen(true);
  }, []);

  const confirmRemove = () => {
    if (removeId === null) return;

    // If it's a new teacher (negative ID), just remove it from the edits
    if (removeId < 0) {
      setEditedTeachersMap((prev) => {
        const newMap = { ...prev };
        delete newMap[removeId];
        return newMap;
      });
    } else {
      // If it's an existing teacher, add its ID to the removed set
      setRemovedTeacherIds((prev) => new Set(prev).add(removeId));
      // Also remove it from the edited map if it's there
      setEditedTeachersMap((prev) => {
        const newMap = { ...prev };
        delete newMap[removeId];
        return newMap;
      });
    }

    setIsRemoveDialogOpen(false);
    setRemoveId(null);
  };

  const handleChange = useCallback((teacher: Teacher) => {
    setEditedTeachersMap((prev) => ({
      ...prev,
      [teacher.id]: teacher,
    }));
  }, []);

  const handleDiscard = () => {
    setEditedTeachersMap({});
    setRemovedTeacherIds(new Set());
  };

  const handleSave = () => {
    const { added, edited, removed } = getChangedTeachers();
    setRecapCounts({
      added: added.length,
      edited: edited.length,
      removed: removed.length,
    });
    setIsConfirmDialogOpen(true);
  };

  const confirmSave = () => {
    setIsConfirmDialogOpen(false);
    saveMutation.mutate();
  };

  // Helpers
  function isTeacherValid(teacher: Teacher, teachers: Teacher[]) {
    if (!teacher.name.trim()) return false;
    if (!teacher.subject.trim()) return false;
    if (validateCode(teacher.code, teachers)) return false;
    return true;
  }

  const getChangedTeachers = useCallback(() => {
    const added = Object.values(editedTeachersMap).filter((t) => t.id < 0);

    const removed = baseTeachers.filter((t) => removedTeacherIds.has(t.id));

    const edited = Object.values(editedTeachersMap).filter((t) => {
      if (t.id <= 0) return false;
      const orig = baseTeachers.find((b) => b.id === t.id);
      return (
        orig &&
        (t.code !== orig.code ||
          t.name !== orig.name ||
          t.subject !== orig.subject)
      );
    });
    return { added, edited, removed };
  }, [editedTeachersMap, baseTeachers, removedTeacherIds]);

  // Derived value: are there any unsaved changes?
  const hasChanges = useMemo(() => {
    const { added, edited, removed } = getChangedTeachers();
    return added.length > 0 || edited.length > 0 || removed.length > 0;
  }, [getChangedTeachers]);

  // Mutations
  const saveMutation = useMutation({
    mutationFn: async () => {
      const { added, edited, removed } = getChangedTeachers();

      const res = await fetch("/api/teachers/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          added: added.map(({ id: _, ...rest }) => rest), // remove temporary negative id
          edited,
          removed: removed.map((t) => t.id),
        }),
      });

      if (!res.ok) {
        const errorData = await res
          .json()
          .catch(() => ({ message: "Failed to save changes" }));
        throw new Error(errorData.message || "An unknown error occurred");
      }
    },
    onSuccess: async () => {
      await teachersQuery.refetch();
      setEditedTeachersMap({});
      setRemovedTeacherIds(new Set());
      toast.success("Teacher changes saved successfully");
    },
    onError: (err) => {
      console.error("Error saving changes:", err);
      toast.error((err as Error).message || "Failed to save teacher changes");
    },
  });

  // Effects
  // Warn before leaving page if editing
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
  if (teachersQuery.isLoading) {
    return (
      <div className="flex h-32 items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (teachersQuery.isError) {
    return <div>Error: {(teachersQuery.error as Error).message}</div>;
  }

  return (
    <>
      <Card className="mb-4 gap-0 p-4">
        <h1 className="text-2xl font-semibold tracking-tight text-pretty">
          Teachers Table
        </h1>
        <p className="text-muted-foreground mt-1 text-base">
          Easily view, edit, and manage teachers for <b>8Sched</b>. Add, edit,
          or remove teachers as needed.
        </p>
      </Card>
      <Card className="p-4">
        <TeachersTable
          teachers={teachers}
          onChange={handleChange}
          onAdd={handleAdd}
          onRemove={handleRemove}
          isPending={saveMutation.isPending}
        />

        {hasChanges && (
          <div
            className="fixed right-4 bottom-4 z-50 flex items-center justify-center gap-2"
            style={{ pointerEvents: "auto" }}
          >
            <Button
              disabled={saveMutation.isPending}
              variant="default"
              onClick={handleDiscard}
            >
              Discard Changes
            </Button>
            <Button
              variant="default"
              onClick={handleSave}
              disabled={saveMutation.isPending || !allValid}
            >
              Save Changes
            </Button>
          </div>
        )}
        <Dialog
          open={isConfirmDialogOpen}
          onOpenChange={setIsConfirmDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Save</DialogTitle>
              <DialogDescription>
                You are about to save changes to the teachers list.
                <br />
                <b>{recapCounts.added}</b> added, <b>{recapCounts.edited}</b>{" "}
                edited, <b>{recapCounts.removed}</b> deleted.
                <br />
                Do you want to continue?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={confirmSave} disabled={saveMutation.isPending}>
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={isRemoveDialogOpen} onOpenChange={setIsRemoveDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Removal</DialogTitle>
              <DialogDescription>
                Are you sure you want to remove this teacher?
                <br />
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button variant="destructive" onClick={confirmRemove}>
                Remove
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>
    </>
  );
}
