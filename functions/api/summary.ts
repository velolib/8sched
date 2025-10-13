export const onRequestGet: PagesFunction<{ DB: D1Database }> = async (
  context,
) => {
  try {
    const db = context.env.DB;

    const teachersCountPromise = db
      .prepare("SELECT COUNT(*) as count FROM teachers")
      .first<{ count: number }>();
    const schedulesCountPromise = db
      .prepare("SELECT COUNT(*) as count FROM schedules")
      .first<{ count: number }>();
    const conflictsPromise = db
      .prepare(
        `
      SELECT COUNT(*) as total_conflicts
      FROM schedules s
      WHERE s.teacher_code IS NOT NULL
        AND NOT (
          (s.teacher_code LIKE 'Z%' OR s.teacher_code LIKE 'X%')
          AND LENGTH(s.teacher_code) > 1
          AND TRIM(SUBSTR(s.teacher_code, 2), '0123456789') = ''
        )
        AND EXISTS (
          SELECT 1
          FROM schedules s2
          WHERE s2.day = s.day
            AND s2.time_slot = s.time_slot
            AND s2.teacher_code = s.teacher_code
          GROUP BY s2.day, s2.time_slot, s2.teacher_code
          HAVING COUNT(*) > 1
        )
    `,
      )
      .first<{ total_conflicts: number }>();
    const subjectsCoveredPromise = db
      .prepare("SELECT COUNT(DISTINCT subject) as count FROM teachers")
      .first<{ count: number }>();

    const [
      teachersCountResult,
      schedulesCountResult,
      conflictsResult,
      subjectsCoveredResult,
    ] = await Promise.all([
      teachersCountPromise,
      schedulesCountPromise,
      conflictsPromise,
      subjectsCoveredPromise,
    ]);

    const summary = {
      teachersCount: teachersCountResult?.count ?? 0,
      scheduleSlotsCount: schedulesCountResult?.count ?? 0,
      scheduleConflictsCount: conflictsResult?.total_conflicts ?? 0,
      subjectsCoveredCount: subjectsCoveredResult?.count ?? 0,
      links: {
        teachers: "/admin/teachers",
        schedules: "/admin/schedules",
      },
      lastUpdated: new Date().toISOString(),
    };

    return new Response(JSON.stringify(summary), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching summary data:", error);
    return new Response("Error fetching summary data", { status: 500 });
  }
};
