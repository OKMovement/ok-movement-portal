import { NextResponse, type NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { AdminUserModel } from "@/lib/models/admin-user";
import { createRandomToken, hashToken, normalizeEmail } from "@/lib/server/auth";
import { setAdminDeviceToken, setAdminSession } from "@/lib/server/admin-session";
import { ADMIN_DEVICE_COOKIE } from "@/lib/server/session";

const MAX_TWO_FACTOR_ATTEMPTS = 5;

function clearPendingTwoFactor(admin: {
  twoFactorCodeHash?: string | null;
  twoFactorCodeExpiresAt?: Date | null;
  twoFactorChallengeHash?: string | null;
  twoFactorChallengeExpiresAt?: Date | null;
  twoFactorCodeAttempts?: number;
}) {
  admin.twoFactorCodeHash = undefined;
  admin.twoFactorCodeExpiresAt = undefined;
  admin.twoFactorChallengeHash = undefined;
  admin.twoFactorChallengeExpiresAt = undefined;
  admin.twoFactorCodeAttempts = 0;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { email?: string; code?: string; challengeToken?: string };
    const email = body.email ? normalizeEmail(body.email) : "";
    const code = (body.code ?? "").trim();
    const challengeToken = (body.challengeToken ?? "").trim();

    if (!email || !code || !challengeToken) {
      return NextResponse.json({ error: "Email, code, and challenge token are required." }, { status: 400 });
    }

    await connectToDatabase();

    const admin = await AdminUserModel.findOne({ email });
    if (!admin) {
      return NextResponse.json({ error: "Invalid verification request." }, { status: 401 });
    }

    if (
      !admin.twoFactorCodeHash ||
      !admin.twoFactorChallengeHash ||
      !admin.twoFactorCodeExpiresAt ||
      !admin.twoFactorChallengeExpiresAt
    ) {
      return NextResponse.json({ error: "Verification session expired. Please sign in again." }, { status: 401 });
    }

    if ((admin.twoFactorCodeAttempts ?? 0) >= MAX_TWO_FACTOR_ATTEMPTS) {
      clearPendingTwoFactor(admin);
      await admin.save();
      return NextResponse.json({ error: "Too many failed attempts. Please sign in again." }, { status: 429 });
    }

    const now = new Date();
    if (admin.twoFactorCodeExpiresAt <= now || admin.twoFactorChallengeExpiresAt <= now) {
      clearPendingTwoFactor(admin);
      await admin.save();
      return NextResponse.json({ error: "Verification code expired. Please sign in again." }, { status: 401 });
    }

    if (hashToken(challengeToken) !== admin.twoFactorChallengeHash) {
      return NextResponse.json({ error: "Invalid verification session. Please sign in again." }, { status: 401 });
    }

    if (hashToken(code) !== admin.twoFactorCodeHash) {
      admin.twoFactorCodeAttempts = (admin.twoFactorCodeAttempts ?? 0) + 1;
      await admin.save();
      return NextResponse.json({ error: "Invalid verification code." }, { status: 401 });
    }

    const currentDeviceToken = request.cookies.get(ADMIN_DEVICE_COOKIE)?.value ?? "";
    const currentDeviceHash = currentDeviceToken ? hashToken(currentDeviceToken) : "";
    const trustedDevices = admin.trustedDevices;
    const nowUserAgent = request.headers.get("user-agent") ?? "Unknown device";
    const trustedIndex = currentDeviceHash
      ? trustedDevices.findIndex((item: { deviceHash?: string }) => item.deviceHash === currentDeviceHash)
      : -1;

    if (trustedIndex >= 0) {
      trustedDevices[trustedIndex].lastSeenAt = now;
      trustedDevices[trustedIndex].userAgent = nowUserAgent;
    } else {
      const newDeviceToken = createRandomToken();
      const nextDevice = trustedDevices.create({
        deviceHash: hashToken(newDeviceToken),
        userAgent: nowUserAgent,
        firstSeenAt: now,
        lastSeenAt: now,
      });
      trustedDevices.push(nextDevice);
      await setAdminDeviceToken(newDeviceToken);
    }

    while (trustedDevices.length > 20) {
      trustedDevices.shift();
    }
    admin.lastLoginAt = now;
    clearPendingTwoFactor(admin);
    await admin.save();

    await setAdminSession({
      id: String(admin._id),
      email: admin.email,
      role: admin.role,
      name: admin.name,
    });

    return NextResponse.json({
      ok: true,
      admin: {
        id: String(admin._id),
        name: admin.name,
        email: admin.email,
        role: admin.role,
        mustChangePassword: admin.mustChangePassword,
      },
    });
  } catch (error) {
    console.error("Admin verify code failed:", error);
    return NextResponse.json({ error: "Unable to verify code right now." }, { status: 500 });
  }
}
