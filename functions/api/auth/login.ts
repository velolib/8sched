import { signToken } from "../../utils/jwt.js";

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { username, password } = (await context.request.json()) as {
      username: string;
      password: string;
    };

    const isCorrectUsername = username === context.env.ADMIN_USERNAME;
    const isCorrectPassword = password === context.env.ADMIN_PASSWORD;
    console.log(username, context.env.ADMIN_USERNAME);
    console.log(password, context.env.ADMIN_PASSWORD);

    if (!isCorrectUsername || !isCorrectPassword) {
      return new Response("Invalid credentials", { status: 401 });
    }

    // Create the JWT with a simple payload
    const payload = { sub: username, role: "admin" };
    const token = await signToken(context.env, payload);

    // Set the JWT in a secure, HttpOnly cookie
    const cookie = `session-token=${token}; HttpOnly; Secure; Path=/; SameSite=Strict; Max-Age=86400`;

    const headers = new Headers();
    headers.set("Set-Cookie", cookie);

    return new Response(JSON.stringify({ success: true }), { headers });
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 400 });
  }
};
