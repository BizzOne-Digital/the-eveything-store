import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const SESSION_COOKIE = "tes_admin_session";
const SECRET = process.env.ADMIN_SESSION_SECRET as string;

export interface AdminSessionPayload {
  id: string;
  email: string;
  name: string;
  role: string;
}

export function signAdminToken(payload: AdminSessionPayload): string {
  if (!SECRET) throw new Error("ADMIN_SESSION_SECRET is not set");
  return jwt.sign(payload, SECRET, { expiresIn: "7d" });
}

export function verifyAdminToken(token: string): AdminSessionPayload | null {
  if (!SECRET) return null;
  try {
    return jwt.verify(token, SECRET) as AdminSessionPayload;
  } catch {
    return null;
  }
}

export async function setAdminSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAdminSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getAdminSession(): Promise<AdminSessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

export { SESSION_COOKIE };
