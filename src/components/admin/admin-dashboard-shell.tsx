"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  HandCoins,
  CalendarDays,
  FileText,
  Images,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Settings,
  Users,
} from "lucide-react";

type AdminDashboardShellProps = {
  admin: {
    name: string;
    email: string;
    role: string;
  };
  children: React.ReactNode;
};

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/dashboard/members", label: "Members", icon: Users },
  { href: "/admin/dashboard/donations", label: "Donations", icon: HandCoins },
  { href: "/admin/dashboard/press-releases", label: "Press Releases", icon: FileText },
  { href: "/admin/dashboard/media-gallery", label: "Media Gallery", icon: Images },
  { href: "/admin/dashboard/events", label: "Events", icon: CalendarDays },
  { href: "/admin/dashboard/support", label: "Support", icon: LifeBuoy },
  { href: "/admin/dashboard/settings", label: "Settings", icon: Settings },
] as const;

export default function AdminDashboardShell({ admin, children }: AdminDashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    await fetch("/api/admin/auth/sign-out", { method: "POST" });
    router.replace("/admin/sign-in");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#f7f7f4] text-brand-black">
      <div className="mx-auto grid min-h-screen w-[min(100%-1.5rem,96rem)] gap-6 py-6 lg:grid-cols-[18rem_1fr]">
        <aside className="flex flex-col rounded-[8px] border border-black/10 bg-white p-5 shadow-[0_22px_38px_-24px_rgb(0_0_0/0.34)] lg:sticky lg:top-6 lg:h-[calc(100dvh-3rem)] lg:overflow-auto">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-red">
              OK Movement Admin
            </p>
            <h1 className="mt-3 text-xl font-semibold text-brand-black">Control Center</h1>
            <p className="mt-1 text-xs text-black/60">Manage members, events and press updates.</p>
          </div>

          <nav className="mt-6 space-y-2">
            {links.map((link) => {
              const Icon = link.icon;
              const active =
                link.href === "/admin/dashboard"
                  ? pathname === link.href
                  : pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 rounded-[8px] px-3 py-2.5 text-sm font-medium transition ${
                    active
                      ? "bg-brand-green text-white"
                      : "text-black/70 hover:bg-brand-green/10 hover:text-brand-black"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-8">
            <div className="rounded-[8px] border border-black/10 bg-[#f7f7f4] p-3">
            <p className="text-sm font-semibold text-brand-black">{admin.name}</p>
            <p className="text-xs text-black/60">{admin.email}</p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-green">
              {admin.role}
            </p>
            <button
              type="button"
              onClick={handleSignOut}
              className="mt-3 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-[8px] bg-brand-black px-4 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-brand-red"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
            </div>
          </div>
        </aside>

        <section className="space-y-6 pb-8">{children}</section>
      </div>
    </div>
  );
}
