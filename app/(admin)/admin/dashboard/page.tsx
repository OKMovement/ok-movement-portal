import Link from "next/link";
import { CalendarDays, Code2, FileText, Images, LifeBuoy, Users } from "lucide-react";
import { connectToDatabase } from "@/lib/db";
import { MemberModel } from "@/lib/models/member";
import { TechVolunteerModel } from "@/lib/models/tech-volunteer";
import { PressReleaseModel } from "@/lib/models/press-release";
import { EventModel } from "@/lib/models/event";
import { MediaItemModel } from "@/lib/models/media-item";
import { ContactSubmissionModel } from "@/lib/models/contact-submission";
import StateStatsBarChart from "@/components/admin/state-stats-bar-chart";

export default async function AdminDashboardPage() {
  await connectToDatabase();

  const [members, techVolunteers, pressReleases, mediaItems, events, supportSubmissions, membersByState] = await Promise.all([
    MemberModel.countDocuments({}),
    TechVolunteerModel.countDocuments({}),
    PressReleaseModel.countDocuments({}),
    MediaItemModel.countDocuments({}),
    EventModel.countDocuments({}),
    ContactSubmissionModel.countDocuments({}),
    MemberModel.aggregate<{ _id: string; count: number }>([
      { $match: { isDiaspora: false } },
      { $project: { state: { $trim: { input: { $ifNull: ["$votingState", ""] } } } } },
      { $match: { state: { $ne: "" } } },
      { $group: { _id: "$state", count: { $sum: 1 } } },
      { $sort: { count: -1, _id: 1 } },
    ]),
  ]);

  const stateStats = membersByState.slice(0, 15).map((item) => ({
    state: item._id,
    members: item.count,
  }));

  const cards = [
    {
      label: "Members Registered",
      value: members,
      helper: "People from Get Involved form",
      icon: Users,
      href: "/admin/dashboard/members",
      tone: "bg-brand-green/10 text-brand-green",
    },
    {
      label: "Tech Volunteers",
      value: techVolunteers,
      helper: "Applicants from tech volunteer form",
      icon: Code2,
      href: "/admin/dashboard/tech-volunteers",
      tone: "bg-brand-black/10 text-brand-black",
    },
    {
      label: "Press Releases",
      value: pressReleases,
      helper: "Create and publish updates",
      icon: FileText,
      href: "/admin/dashboard/press-releases",
      tone: "bg-brand-red/10 text-brand-red",
    },
    {
      label: "Media Gallery",
      value: mediaItems,
      helper: "Manage images, news and videos",
      icon: Images,
      href: "/admin/dashboard/media-gallery",
      tone: "bg-brand-black/10 text-brand-black",
    },
    {
      label: "Events",
      value: events,
      helper: "Manage event publishing",
      icon: CalendarDays,
      href: "/admin/dashboard/events",
      tone: "bg-black/8 text-brand-black",
    },
    {
      label: "Support Submissions",
      value: supportSubmissions,
      helper: "Messages from Contact Us",
      icon: LifeBuoy,
      href: "/admin/dashboard/support",
      tone: "bg-brand-green/10 text-brand-green",
    },
  ] as const;

  return (
    <>
      <header className="rounded-[8px] border border-black/10 bg-white px-6 py-6 shadow-[0_22px_38px_-24px_rgb(0_0_0/0.34)]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-red">Overview</p>
        <h2 className="mt-3 text-3xl font-semibold text-brand-black">Dashboard</h2>
        <p className="mt-2 text-sm text-black/65">
          Quick access to your operational areas for membership, events, and messaging.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              href={card.href}
              key={card.label}
              className="rounded-[8px] border border-black/10 bg-white p-5 shadow-[0_20px_34px_-24px_rgb(0_0_0/0.3)] transition hover:-translate-y-0.5 hover:shadow-[0_25px_40px_-22px_rgb(0_0_0/0.32)]"
            >
              <span className={`inline-flex h-11 w-11 items-center justify-center rounded-[8px] ${card.tone}`}>
                <Icon className="h-5 w-5" />
              </span>
              <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-black/55">{card.label}</p>
              <p className="mt-1 text-3xl font-semibold text-brand-black">{card.value.toLocaleString()}</p>
              <p className="mt-2 text-sm text-black/60">{card.helper}</p>
            </Link>
          );
        })}
      </div>

      <section className="rounded-[8px] border border-black/10 bg-white p-5 shadow-[0_20px_34px_-24px_rgb(0_0_0/0.3)] sm:p-6">
        <div className="mb-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-red">Member Geography</p>
          <h3 className="mt-1 text-xl font-semibold text-brand-black">Registrations by State</h3>
          <p className="mt-1 text-sm text-black/60">
            Top 15 Nigerian states by member registrations.
          </p>
        </div>
        <div className="h-[32rem]">
          <StateStatsBarChart data={stateStats} />
        </div>
      </section>
    </>
  );
}
