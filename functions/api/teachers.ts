// GET /api/teachers - Fetches all teachers for the lookup table
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const db = context.env.DB;
  const stmt = db.prepare(
    `SELECT id, code, name, subject FROM Teachers ORDER BY code`,
  );
  const { results } = await stmt.all();
  return new Response(JSON.stringify(results), {
    headers: { "Content-Type": "application/json" },
  });
};
