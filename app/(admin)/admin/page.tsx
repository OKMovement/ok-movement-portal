import { redirect } from "next/navigation";
import { getAdminSessionFromCookies } from "@/lib/server/admin-session";

export default async function AdminEntryPage() {
  const session = await getAdminSessionFromCookies();
  if (session) {
    redirect("/admin/dashboard");
  }

  redirect("/admin/sign-in");
}
