// GET (Existing) - Fetches the schedule joined with teacher names
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const db = context.env.DB;
  const stmt = db.prepare(
    `SELECT Schedules.id, Schedules.day, Schedules.time_slot, Schedules.class_name, Schedules.teacher_code
    FROM Schedules
    ORDER BY Schedules.day, Schedules.time_slot, Schedules.class_name
    `,
  );
  const { results } = await stmt.all();
  return Response.json(results);
};

// POST (New) - Creates a brand new schedule entry
// export const onRequestPost: PagesFunction<Env> = async (context) => {
//   const db = context.env.DB;
//   // We expect the frontend to send the details for the new entry
//   const { day, time_slot, class_name, teacher_code } = await context.request.json() as {
//     day: number;
//     time_slot: string;
//     class_name: string;
//     teacher_code: string;
//   };

//   const stmt = db.prepare(
//     `INSERT INTO Schedules (day, time_slot, class_name, teacher_code) VALUES (?, ?, ?, ?)`
//   );
//   const { results } = await stmt.bind(day, time_slot, class_name, teacher_code).run();

//   return Response.json(results);
// };

// PUT (Batch) - Updates multiple schedules at once
export const onRequestPut: PagesFunction<Env> = async (context) => {
  const db = context.env.DB;
  const updates = (await context.request.json()) as {
    id: number;
    teacher_code?: string;
    class_name?: string;
    time_slot?: string;
    day?: number;
  }[];

  const txn = db.batch(
    updates.map((u) =>
      db
        .prepare(
          `UPDATE Schedules
           SET teacher_code = COALESCE(?, teacher_code),
               class_name = COALESCE(?, class_name),
               time_slot = COALESCE(?, time_slot),
               day = COALESCE(?, day)
           WHERE id = ?`,
        )
        .bind(u.teacher_code, u.class_name, u.time_slot, u.day, u.id),
    ),
  );

  await txn;
  return new Response(null, { status: 204 });
};

// DELETE (New) - Removes a schedule entry by its ID
// export const onRequestDelete: PagesFunction<Env> = async (context) => {
//   const db = context.env.DB;
//   const id = context.params.id as string;

//   const stmt = db.prepare(`DELETE FROM Schedules WHERE id = ?`);
//   await stmt.bind(id).run();

//   return new Response(null, { status: 204 });
// };
