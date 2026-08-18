import { Globe2 } from "lucide-react";
import DiasporaCountryInsights from "@/components/admin/diaspora-country-insights";
import MembersManager from "@/components/admin/members-manager";
import { connectToDatabase } from "@/lib/db";
import { MemberModel } from "@/lib/models/member";

export default async function AdminDiasporaPage() {
  await connectToDatabase();
  const [total, countries] = await Promise.all([
    MemberModel.countDocuments({ isDiaspora: true }),
    MemberModel.aggregate<{ _id: string; count: number }>([
      { $match: { isDiaspora: true } },
      { $project: { country: { $trim: { input: { $ifNull: ["$country", ""] } } } } },
      { $match: { country: { $ne: "" } } },
      { $group: { _id: "$country", count: { $sum: 1 } } },
      { $sort: { count: -1, _id: 1 } },
    ]),
  ]);
  const countryStats = countries.slice(0, 15).map((item) => ({ state: item._id, members: item.count }));

  return <>
    <header className="rounded-[8px] border border-black/10 bg-white px-6 py-6 shadow-[0_22px_38px_-24px_rgb(0_0_0/0.34)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-red">Global community</p>
      <h2 className="mt-3 text-3xl font-semibold text-brand-black">Diaspora registrations</h2>
      <p className="mt-2 text-sm text-black/65">Registrations submitted through the Diaspora page.</p>
    </header>
    <div className="grid gap-4 sm:grid-cols-2">
      <section className="rounded-[8px] border border-black/10 bg-white p-5 shadow-[0_20px_34px_-24px_rgb(0_0_0/0.3)]"><span className="inline-flex h-11 w-11 items-center justify-center rounded-[8px] bg-brand-green/10 text-brand-green"><Globe2 className="h-5 w-5" /></span><p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-black/55">Registered diaspora members</p><p className="mt-1 text-3xl font-semibold text-brand-black">{total.toLocaleString()}</p></section>
      <DiasporaCountryInsights countriesRepresented={countries.length} data={countryStats} />
    </div>
    <MembersManager diasporaOnly />
  </>;
}
