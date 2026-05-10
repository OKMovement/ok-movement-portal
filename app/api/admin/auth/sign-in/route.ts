import { NextResponse, type NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { AdminUserModel } from "@/lib/models/admin-user";
import { createNumericCode, createRandomToken, hashToken, normalizeEmail, verifyPassword } from "@/lib/server/auth";
import { setAdminDeviceToken, setAdminSession } from "@/lib/server/admin-session";
import { ensureBootstrapAdmin } from "@/lib/server/bootstrap-admin";
import { sendAdminNewDeviceAlertEmail, sendAdminSignInCodeEmail } from "@/lib/server/mailer";
import { ADMIN_DEVICE_COOKIE } from "@/lib/server/session";

const TWO_FACTOR_TTL_MS = 1000 * 60 * 10;

function getClientIp(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "Unknown";
  }
  return request.headers.get("x-real-ip") ?? "Unknown";
}

function getClientUserAgent(request: NextRequest) {
  return request.headers.get("user-agent") ?? "Unknown device";
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { email?: string; password?: string };
    const email = body.email ? normalizeEmail(body.email) : "";
    const password = body.password ?? "";

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    await ensureBootstrapAdmin();
    await connectToDatabase();

    const admin = await AdminUserModel.findOne({ email });
    if (!admin) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const isValid = await verifyPassword(password, admin.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const loginCode = createNumericCode(6);
    const challengeToken = createRandomToken();
    const expiresAt = new Date(Date.now() + TWO_FACTOR_TTL_MS);
    const currentDeviceToken = request.cookies.get(ADMIN_DEVICE_COOKIE)?.value ?? "";
    const currentDeviceHash = currentDeviceToken ? hashToken(currentDeviceToken) : "";
    const trustedDevices = admin.trustedDevices;
    const isNewDevice =
      !currentDeviceHash ||
      !trustedDevices.some((device: { deviceHash?: string }) => device.deviceHash === currentDeviceHash);
    const bootstrapAdminEmail = process.env.BOOTSTRAP_ADMIN_EMAIL
      ? normalizeEmail(process.env.BOOTSTRAP_ADMIN_EMAIL)
      : "";
    const isBootstrapSuperAdmin =
      admin.role === "super" && Boolean(bootstrapAdminEmail) && admin.email === bootstrapAdminEmail;

    if (isBootstrapSuperAdmin) {
      const now = new Date();
      const userAgent = getClientUserAgent(request);

      if (isNewDevice) {
        const newDeviceToken = createRandomToken();
        trustedDevices.push(
          trustedDevices.create({
            deviceHash: hashToken(newDeviceToken),
            userAgent,
            firstSeenAt: now,
            lastSeenAt: now,
          }),
        );
        while (trustedDevices.length > 20) {
          trustedDevices.shift();
        }
        await setAdminDeviceToken(newDeviceToken);
      }

      admin.lastLoginAt = now;
      admin.twoFactorCodeHash = undefined;
      admin.twoFactorCodeExpiresAt = undefined;
      admin.twoFactorChallengeHash = undefined;
      admin.twoFactorChallengeExpiresAt = undefined;
      admin.twoFactorCodeAttempts = 0;
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
    }

    admin.twoFactorCodeHash = hashToken(loginCode);
    admin.twoFactorCodeExpiresAt = expiresAt;
    admin.twoFactorChallengeHash = hashToken(challengeToken);
    admin.twoFactorChallengeExpiresAt = expiresAt;
    admin.twoFactorCodeAttempts = 0;
    await admin.save();

    const ipAddress = getClientIp(request);
    const userAgent = getClientUserAgent(request);
    const expiresInMinutes = Math.floor(TWO_FACTOR_TTL_MS / (1000 * 60));

    await sendAdminSignInCodeEmail({
      email: admin.email,
      name: admin.name,
      code: loginCode,
      expiresInMinutes,
      ipAddress,
      userAgent,
      isNewDevice,
    });

    if (isNewDevice) {
      await sendAdminNewDeviceAlertEmail({
        email: admin.email,
        name: admin.name,
        ipAddress,
        userAgent,
        attemptedAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      ok: true,
      requiresTwoFactor: true,
      challengeToken,
      email: admin.email,
      message: "A verification code has been sent to your email.",
    });
  } catch (error) {
    console.error("Admin sign in failed:", error);
    return NextResponse.json({ error: "Unable to sign in right now." }, { status: 500 });
  }
}
