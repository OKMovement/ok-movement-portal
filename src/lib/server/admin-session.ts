import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, createAdminSessionToken, getSessionMaxAge, verifyAdminSessionToken } from "@/lib/server/session";

type SessionUser = {
  id: string;
  email: string;
  role: string;
  name: string;
};

export async function setAdminSession(user: SessionUser) {
  const token = createAdminSessionToken({
    sub: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  });

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: getSessionMaxAge(),
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}

export async function getAdminSessionFromCookies() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyAdminSessionToken(token);
}
