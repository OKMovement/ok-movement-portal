import bcrypt from "bcryptjs";
import { createHash, randomBytes } from "node:crypto";

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function createRandomToken() {
  return randomBytes(32).toString("hex");
}

export function createNumericCode(length = 6) {
  let output = "";

  while (output.length < length) {
    output += String(randomBytes(1)[0] % 10);
  }

  return output.slice(0, length);
}

export function createTemporaryPassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$";
  let output = "";
  for (let i = 0; i < 14; i += 1) {
    const randomIndex = randomBytes(1)[0] % chars.length;
    output += chars[randomIndex];
  }
  return output;
}
