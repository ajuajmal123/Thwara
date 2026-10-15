import { cookies } from "next/headers";

const ADMIN_COOKIE_NAME = "thwara_admin_session";
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "thwara2026";

/**
 * Validates the provided passcode against the configured ADMIN_PASSWORD
 */
export function verifyPassword(password: string): boolean {
  if (!password) return false;
  const target = process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD;
  return password.trim() === target.trim();
}

/**
 * Checks if the current request has an active, valid admin session
 */
export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE_NAME);
  if (!session?.value) return false;

  // Simple secure session token check
  return session.value.startsWith("thwara_auth_");
}

/**
 * Sets the admin session cookie on successful login
 */
export async function setAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = `thwara_auth_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  cookieStore.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

/**
 * Clears the admin session cookie on logout
 */
export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}
