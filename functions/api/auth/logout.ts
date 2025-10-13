export const onRequestPost: PagesFunction = async () => {
  // To log out, we send back a cookie with the same name but with an expiration date in the past.
  const sessionCookie = `session-token=; HttpOnly; Secure; Path=/; SameSite=Strict; Expires=Thu, 01 Jan 1970 00:00:00 GMT;`;

  const headers = new Headers();
  headers.set("Set-Cookie", sessionCookie);

  return new Response(JSON.stringify({ success: true }), { headers });
};
