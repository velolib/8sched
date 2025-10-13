import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { checkIfReservedCode, cn, validateCode } from "@/lib/utils";
import { Teacher } from "@/types/schedule";
import { memo, useMemo } from "react";

type TeachersTableProps = {
  // Controlled source of truth
  teachers: Teacher[];
  // Called whenever any field changes for a given teacher
  onChange: (teacher: Teacher) => void;
  // Controlled row add/remove
  onAdd: () => void;
  onRemove: (id: number) => void;
  // Disable inputs and actions when pending
  isPending?: boolean;
};

export const TeachersTable = memo(function TeachersTable({
  teachers,
  onChange,
  onAdd,
  onRemove,
  isPending = false,
}: TeachersTableProps) {
  const sortedTeachers = useMemo(() => {
    return [...teachers].sort((a, b) => {
      const isNewA = a.id == null || a.id <= 0;
      const isNewB = b.id == null || b.id <= 0;

      if (isNewA && !isNewB) {
        return -1;
      }
      if (!isNewA && isNewB) {
        return 1;
      }

      return 0;
    });
  }, [teachers]);

  return (
    <div className="relative w-full overflow-x-auto rounded-md border">
      <table className="min-w-full border-collapse">
        <caption className="caption-top">
          <div className="bg-muted/50 flex items-center justify-start border-b p-3">
            <Button
              size="sm"
              onClick={onAdd}
              disabled={isPending}
              aria-label="Add teacher"
            >
              Add teacher
            </Button>
          </div>
        </caption>
        <thead>
          <tr className="bg-muted">
            <th className="text-muted-foreground px-4 py-2 text-left text-xs font-medium">
              Code
            </th>
            <th className="text-muted-foreground px-4 py-2 text-left text-xs font-medium">
              Name
            </th>
            <th className="text-muted-foreground px-4 py-2 text-left text-xs font-medium">
              Subject
            </th>
            <th className="text-muted-foreground px-4 py-2 text-left text-xs font-medium">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedTeachers.length === 0 ? (
            <tr className="border-t">
              <td
                colSpan={4}
                className="text-muted-foreground px-4 py-6 text-sm"
              >
                No teachers yet. Click “Add teacher” to create one.
              </td>
            </tr>
          ) : (
            sortedTeachers.map((t) => {
              const isNew = t.id == null || t.id <= 0;
              let codeError = "";
              if (isNew) {
                const reserved = checkIfReservedCode(t.code);
                codeError = reserved
                  ? "This code is reserved"
                  : (validateCode(t.code, teachers) ?? "");
              } else {
                codeError = validateCode(t.code, teachers) ?? "";
              }
              const codeHasError = Boolean(codeError);

              return (
                <tr key={t.id} className="border-t">
                  <td
                    className={cn(
                      "px-4 py-2 align-middle",
                      codeHasError && "bg-destructive/5",
                    )}
                  >
                    <div className="flex flex-col gap-1">
                      <Input
                        value={t.code}
                        onChange={(e) =>
                          onChange({ ...t, code: e.target.value })
                        }
                        placeholder="A1"
                        autoComplete="off"
                        inputMode="text"
                        aria-invalid={codeHasError}
                        aria-describedby={
                          codeHasError ? `code-error-${t.id}` : undefined
                        }
                        disabled={
                          isPending || (!isNew && checkIfReservedCode(t.code))
                        }
                        className={cn(
                          "min-w-[80px]",
                          codeHasError && "border-destructive",
                        )}
                      />
                      {codeHasError && (
                        <span
                          id={`code-error-${t.id}`}
                          className="text-destructive text-xs"
                        >
                          {codeError}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-2 align-middle">
                    <Input
                      value={t.name}
                      onChange={(e) => onChange({ ...t, name: e.target.value })}
                      placeholder="Full name"
                      autoComplete="off"
                      disabled={
                        isPending || (!isNew && checkIfReservedCode(t.code))
                      }
                      className="min-w-[150px]"
                    />
                  </td>

                  <td className="px-4 py-2 align-middle">
                    <Input
                      value={t.subject}
                      onChange={(e) =>
                        onChange({ ...t, subject: e.target.value })
                      }
                      placeholder="Subject"
                      autoComplete="off"
                      disabled={
                        isPending || (!isNew && checkIfReservedCode(t.code))
                      }
                      className="min-w-[120px]"
                    />
                  </td>

                  <td className="px-4 py-2 align-middle">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onRemove(t.id)}
                        disabled={
                          isPending || (!isNew && checkIfReservedCode(t.code))
                        }
                      >
                        Remove
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
});
