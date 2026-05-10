import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_SESSION_COOKIE = "ok_admin_session";
export const ADMIN_DEVICE_COOKIE = "ok_admin_device";

type SessionPayload = {
  sub: string;
  email: string;
  role: string;
  name: string;
  exp: number;
};

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;
const DEVICE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

function getSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("Missing ADMIN_SESSION_SECRET environment variable.");
  }
  return secret;
}

function base64UrlEncode(input: string) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function base64UrlDecode(input: string) {
  const base = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base + "=".repeat((4 - (base.length % 4)) % 4);
  return Buffer.from(padded, "base64").toString("utf8");
}

function sign(data: string) {
  return createHmac("sha256", getSessionSecret()).update(data).digest("base64url");
}

export function createAdminSessionToken(payload: Omit<SessionPayload, "exp">) {
  const fullPayload: SessionPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS,
  };

  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));
  const signature = sign(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

export function verifyAdminSessionToken(token: string): SessionPayload | null {
  const [payloadPart, signaturePart] = token.split(".");
  if (!payloadPart || !signaturePart) {
    return null;
  }

  const expected = sign(payloadPart);
  const signatureBuffer = Buffer.from(signaturePart);
  const expectedBuffer = Buffer.from(expected);

  if (signatureBuffer.length !== expectedBuffer.length) {
    return null;
  }

  if (!timingSafeEqual(signatureBuffer, expectedBuffer)) {
    return null;
  }

  try {
    const payload = JSON.parse(base64UrlDecode(payloadPart)) as SessionPayload;
    if (payload.exp <= Math.floor(Date.now() / 1000)) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export function getSessionMaxAge() {
  return SESSION_MAX_AGE_SECONDS;
}

export function getDeviceMaxAge() {
  return DEVICE_MAX_AGE_SECONDS;
}

export type { SessionPayload };
