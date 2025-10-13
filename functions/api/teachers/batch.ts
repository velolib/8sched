import type { Teacher } from "../../../src/types/schedule";

interface BatchUpdateBody {
  added: Omit<Teacher, "id">[];
  edited: Teacher[];
  removed: number[];
}

// POST /api/teachers/batch - Batch updates teachers
export const onRequestPost: PagesFunction<Env> = async (context) => {
  const db = context.env.DB;

  try {
    const {
      added = [],
      edited = [],
      removed = [],
    } = await context.request.json<BatchUpdateBody>();

    const statements = [];

    // Add new teachers
    if (added.length > 0) {
      const addStmt = db.prepare(
        `INSERT INTO Teachers (code, name, subject) VALUES (?, ?, ?)`,
      );
      const addBindings = added.map((t) => [t.code, t.name, t.subject]);
      statements.push(...addBindings.map((b) => addStmt.bind(...b)));
    }

    // Update existing teachers
    if (edited.length > 0) {
      const updateStmt = db.prepare(
        `UPDATE Teachers SET code = ?, name = ?, subject = ? WHERE id = ?`,
      );
      const updateBindings = edited.map((t) => [
        t.code,
        t.name,
        t.subject,
        t.id,
      ]);
      statements.push(...updateBindings.map((b) => updateStmt.bind(...b)));
    }

    // Remove teachers
    if (removed.length > 0) {
      const deleteStmt = db.prepare(`DELETE FROM Teachers WHERE id = ?`);
      statements.push(...removed.map((id) => deleteStmt.bind(id)));
    }

    if (statements.length > 0) {
      await db.batch(statements);
    }

    return new Response(
      JSON.stringify({ message: "Batch update successful" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Batch update failed:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(
      JSON.stringify({ message: "Batch update failed", error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};
