import { verifyToken } from "../../utils/jwt.js";

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const cookieHeader = context.request.headers.get("Cookie") || "";
  const token = cookieHeader.match(/session-token=([^;]+)/)?.[1];

  if (!token) {
    return Response.json({ loggedIn: false });
  }

  try {
    // Verify the token is valid and not expired
    await verifyToken(context.env, token);
    return Response.json({ loggedIn: true });
  } catch {
    // If verification fails, the user is not logged in
    return Response.json({ loggedIn: false });
  }
};
