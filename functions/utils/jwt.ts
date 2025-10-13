import * as jose from "jose";

// This interface must include any secrets needed by the functions
interface Env {
  JWT_SECRET: string;
}

// Function to sign a new JWT
export async function signToken(env: Env, payload: jose.JWTPayload) {
  const secret = new TextEncoder().encode(env.JWT_SECRET);
  const jwt = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" }) // Algorithm for signing
    .setIssuedAt() // Sets the token issuance time
    .setExpirationTime("24h") // Token will be valid for 24 hours
    .sign(secret);

  return jwt;
}

// Function to verify an existing JWT
export async function verifyToken(env: Env, token: string) {
  if (!token) {
    throw new Error("No token provided");
  }
  const secret = new TextEncoder().encode(env.JWT_SECRET);
  const { payload } = await jose.jwtVerify(token, secret);
  console.log("Verified JWT payload:", payload);
  return payload;
}
