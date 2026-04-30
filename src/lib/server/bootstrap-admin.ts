import { connectToDatabase } from "@/lib/db";
import { AdminUserModel } from "@/lib/models/admin-user";
import { hashPassword, normalizeEmail } from "@/lib/server/auth";

export async function ensureBootstrapAdmin() {
  const bootstrapEmail = process.env.BOOTSTRAP_ADMIN_EMAIL;
  const bootstrapPassword = process.env.BOOTSTRAP_ADMIN_PASSWORD;
  const bootstrapName = process.env.BOOTSTRAP_ADMIN_NAME ?? "Super Admin";

  if (!bootstrapEmail || !bootstrapPassword) {
    return;
  }

  await connectToDatabase();

  const hasAnyAdmin = await AdminUserModel.exists({});
  if (hasAnyAdmin) {
    return;
  }

  const passwordHash = await hashPassword(bootstrapPassword);

  await AdminUserModel.create({
    name: bootstrapName,
    email: normalizeEmail(bootstrapEmail),
    passwordHash,
    role: "super",
    mustChangePassword: false,
  });
}
