"use client";

import { useEffect, useMemo, useState, type ComponentType, type SVGProps } from "react";
import {
  ArrowRight,
  Bell,
  CalendarCheck2,
  CalendarDays,
  ChevronDown,
  Clock,
  Flag,
  Landmark,
  MapPin,
  Vote,
} from "lucide-react";
import HomeSiteHeader from "./home-site-header";
import HomeFooterSection from "./home-footer-section";
const heroImage = "/assets/Ballot-box_1778616430781.png";

type ElectionCategory = "general" | "off-cycle";

type ElectionEvent = {
  id: string;
  date: string;
  isoDate: string;
  type: string;
  coverage: string;
  category: ElectionCategory;
  cycle: "2026" | "2027";
  notes?: string;
  expected?: boolean;
};

const ELECTION_EVENTS: readonly ElectionEvent[] = [
  {
    id: "ekiti-2026",
    date: "June 20, 2026",
    isoDate: "2026-06-20",
    type: "Governorship Election",
    coverage: "Ekiti State",
    category: "off-cycle",
    cycle: "2026",
    expected: true,
    notes: "First off-cycle governorship poll of the 2026 calendar.",
  },
  {
    id: "osun-2026",
    date: "August 8, 2026",
    isoDate: "2026-08-08",
    type: "Governorship Election",
    coverage: "Osun State",
    category: "off-cycle",
    cycle: "2026",
    expected: true,
    notes: "Off-cycle governorship election following past judicial rulings.",
  },
  {
    id: "presidential-2027",
    date: "January 16, 2027",
    isoDate: "2027-01-16",
    type: "Presidential Election",
    coverage: "Nationwide",
    category: "general",
    cycle: "2027",
    notes: "Same-day vote with the National Assembly elections.",
  },
  {
    id: "nass-2027",
    date: "January 16, 2027",
    isoDate: "2027-01-16",
    type: "National Assembly Elections",
    coverage: "Nationwide",
    category: "general",
    cycle: "2027",
    notes: "Senate and House of Representatives across all 36 states & FCT.",
  },
  {
    id: "gov-2027",
    date: "February 6, 2027",
    isoDate: "2027-02-06",
    type: "Governorship Elections",
    coverage: "Nationwide (excl. off-cycle states)",
    category: "general",
    cycle: "2027",
    notes:
      "Excludes Anambra, Bayelsa, Edo, Ekiti, Imo, Kogi, Ondo, and Osun (off-cycle states).",
  },
  {
    id: "houses-2027",
    date: "February 6, 2027",
    isoDate: "2027-02-06",
    type: "State Houses of Assembly Elections",
    coverage: "Nationwide",
    category: "general",
    cycle: "2027",
    notes: "Same-day with the governorship elections.",
  },
  {
    id: "bayelsa-2027",
    date: "November 2027",
    isoDate: "2027-11-01",
    type: "Governorship Election",
    coverage: "Bayelsa State",
    category: "off-cycle",
    cycle: "2027",
    expected: true,
    notes: "Off-cycle election to align with January 2028 inauguration.",
  },
  {
    id: "imo-2027",
    date: "November 2027",
    isoDate: "2027-11-02",
    type: "Governorship Election",
    coverage: "Imo State",
    category: "off-cycle",
    cycle: "2027",
    expected: true,
    notes: "Off-cycle election to align with January 2028 inauguration.",
  },
  {
    id: "kogi-2027",
    date: "November 2027",
    isoDate: "2027-11-03",
    type: "Governorship Election",
    coverage: "Kogi State",
    category: "off-cycle",
    cycle: "2027",
    expected: true,
    notes: "Off-cycle election to align with January 2028 inauguration.",
  },
];

type FilterId = "all" | "general" | "off-cycle";

const FILTERS: ReadonlyArray<{
  id: FilterId;
  label: string;
  helper: string;
}> = [
  { id: "all", label: "All Upcoming Elections", helper: "Every poll on the INEC calendar" },
  { id: "general", label: "General Elections", helper: "Nationwide presidential, NASS, gov & assembly" },
  { id: "off-cycle", label: "Off-Cycle Elections", helper: "States on different cycles by court rulings" },
];

const OFF_CYCLE_STATES = [
  "Anambra",
  "Bayelsa",
  "Edo",
  "Ekiti",
  "Imo",
  "Kogi",
  "Ondo",
  "Osun",
] as const;

type Highlight = {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  value: string;
  hint: string;
};

const HIGHLIGHTS: readonly Highlight[] = [
  {
    icon: CalendarCheck2,
    label: "Presidential & NASS",
    value: "Jan 16, 2027",
    hint: "Same-day nationwide vote",
  },
  {
    icon: Landmark,
    label: "Governorship & Assembly",
    value: "Feb 6, 2027",
    hint: "Excludes 8 off-cycle states",
  },
  {
    icon: MapPin,
    label: "Off-cycle states",
    value: "8 states",
    hint: "On separate cycles by court order",
  },
  {
    icon: Clock,
    label: "Polls open",
    value: "8:30 AM",
    hint: "Voting closes 2:30 PM",
  },
];

type Milestone = {
  date: string;
  title: string;
  detail: string;
};

const PRE_ELECTION_MILESTONES: readonly Milestone[] = [
  {
    date: "Phase 3 CVR — May 2026",
    title: "Continuous Voter Registration (Phase 3)",
    detail:
      "INEC reopens online pre-registration and physical capture for new voters, transfers, and replacements.",
  },
  {
    date: "Q3 2026",
    title: "Display of provisional voter register",
    detail:
      "Each polling unit's preliminary register is published for claims and objections at INEC ward and LGA offices.",
  },
  {
    date: "Q4 2026",
    title: "Party primaries & candidate nominations",
    detail:
      "Political parties conduct primaries and submit candidate lists to INEC under the Electoral Act 2026 timeline.",
  },
  {
    date: "December 2026",
    title: "Final voter register published",
    detail:
      "INEC closes the register and finalises polling-unit allocations ahead of the January 2027 vote.",
  },
  {
    date: "Two weeks to election",
    title: "Campaign period ends",
    detail:
      "Public campaigning, rallies, and processions close 24 hours before each polling day, per INEC guidelines.",
  },
];

const ELECTION_DAY_TIMELINE: readonly { time: string; title: string; detail: string }[] = [
  {
    time: "8:00 AM",
    title: "Polling officials set up",
    detail:
      "INEC ad-hoc staff arrive, display ballot boxes empty, and configure the Bimodal Voter Accreditation System (BVAS).",
  },
  {
    time: "8:30 AM",
    title: "Accreditation & voting open",
    detail:
      "Voters in the queue are accredited via BVAS biometrics and immediately vote — accreditation and voting run together.",
  },
  {
    time: "2:30 PM",
    title: "Voting closes",
    detail:
      "Anyone already on the queue at 2:30 PM is allowed to vote. New arrivals after this time are turned away.",
  },
  {
    time: "After last vote",
    title: "Sorting & counting",
    detail:
      "Ballots are sorted, counted in public view, and totals announced at the polling unit.",
  },
  {
    time: "Same evening",
    title: "Results uploaded to IReV",
    detail:
      "Form EC8A polling-unit result sheets are scanned and uploaded to the INEC Result Viewing Portal.",
  },
];

const FAQS: readonly { q: string; a: string }[] = [
  {
    q: "Why are some states not included in the February 2027 governorship vote?",
    a: "Eight states (Anambra, Bayelsa, Edo, Ekiti, Imo, Kogi, Ondo, and Osun) hold their governorship elections on separate 'off-cycle' dates because of past court rulings that shifted their inauguration dates.",
  },
  {
    q: "Can I vote in both the January and February 2027 elections?",
    a: "Yes. If you are a registered voter, you are entitled to vote in every election that affects your polling unit — Presidential and NASS in January 2027, then Governorship and State Assembly in February 2027 (subject to whether your state is off-cycle).",
  },
  {
    q: "What time should I arrive at my polling unit?",
    a: "Polling units open at 8:30 AM nationwide. We recommend arriving at least 30 minutes early to beat the queue. Anyone in line by 2:30 PM closing time is allowed to vote.",
  },
  {
    q: "Where do I find my polling unit?",
    a: "Use the polling unit code printed on your PVC, or check the INEC Voter Verification Portal (cvr.inecnigeria.org/vvs) to confirm your assigned unit before election day.",
  },
  {
    q: "Are off-cycle dates final?",
    a: "Off-cycle governorship dates (Ekiti, Osun in 2026; Bayelsa, Imo, Kogi in 2027) are based on the most recent INEC schedule. INEC may adjust the exact day closer to the election — always confirm on inecnigeria.org.",
  },
];

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#00733a] text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.18),transparent_55%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -right-32 h-[420px] w-[420px] rounded-full bg-brand-red/30 blur-3xl"
      />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 sm:py-24 lg:grid-cols-2 lg:gap-16 lg:px-10">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] backdrop-blur">
            <CalendarDays aria-hidden="true" className="h-3.5 w-3.5" />
            Election Resource · Calendar
          </span>
          <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Every date that decides{" "}
            <span className="bg-white/15 px-2 py-1">Nigeria's next chapter.</span>
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/85">
            The official INEC election calendar at a glance — Presidential, National Assembly,
            Governorship, State Houses of Assembly and every off-cycle governorship vote between
            now and the end of 2027. Plan ahead, mark your diary, and never miss your chance to vote.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {HIGHLIGHTS.slice(0, 3).map((h) => (
              <div
                key={h.label}
                className="rounded-2xl border border-white/20 bg-white/[0.06] p-4 backdrop-blur"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/65">
                  {h.label}
                </p>
                <p className="mt-1 text-xl font-semibold leading-tight">{h.value}</p>
                <p className="mt-1 text-[12px] text-white/70">{h.hint}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="relative mx-auto aspect-[4/3] w-full max-w-xl overflow-hidden rounded-3xl bg-black/30 shadow-[0_30px_80px_-30px_rgb(0_0_0/0.55)] ring-1 ring-white/15">
            <img
              src={heroImage}
              alt="A voter casting a ballot into an INEC ballot box."
              className="h-full w-full object-cover"
              loading="eager"
            />
          </div>
          <div className="absolute -bottom-6 -left-4 hidden max-w-[280px] rounded-2xl bg-white p-4 text-brand-black shadow-[0_18px_40px_-16px_rgb(0_0_0/0.4)] sm:block">
            <div className="flex items-start gap-3">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#00733a]/10 text-[#00733a]">
                <Vote aria-hidden="true" className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#00733a]">
                  Save the date
                </p>
                <p className="mt-1 text-[13px] leading-snug text-brand-black/80">
                  16 January 2027 — Presidential & National Assembly Elections, nationwide.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function IntroSection() {
  return (
    <section id="intro" className="relative bg-[#fafaf7] text-brand-black">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#00733a]">
              <span aria-hidden="true" className="h-px w-6 bg-[#00733a]" />
              Official INEC calendar
            </span>
            <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              The Independent National Electoral Commission's revised timetable for 2026 & 2027.
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-brand-black/75">
              Following the enactment of the <strong>Electoral Act 2026</strong>, INEC released a
              revised timetable covering Nigeria's General Elections and the off-cycle governorship
              polls in eight states. These dates are sourced directly from INEC's most recent public
              schedule.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-brand-black/75">
              Use the filter below to switch between the full upcoming calendar, only the General
              Elections, or only the Off-Cycle governorship elections.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#calendar"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-black/15 bg-white px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-brand-black transition hover:border-[#00733a] hover:text-[#00733a]"
              >
                Jump to the calendar
              </a>
            </div>
          </div>
          <div className="lg:col-span-7">
            <div className="grid gap-4 sm:grid-cols-2">
              {HIGHLIGHTS.map((h) => (
                <div
                  key={h.label}
                  className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_18px_40px_-30px_rgb(0_0_0/0.25)]"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#00733a]/10 text-[#00733a]">
                    <h.icon aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-black/55">
                    {h.label}
                  </p>
                  <p className="mt-1 text-2xl font-semibold leading-tight">{h.value}</p>
                  <p className="mt-1 text-[13px] text-brand-black/65">{h.hint}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border-l-4 border-[#00733a] bg-white p-5 text-[14px] text-brand-black/80 shadow-[0_12px_30px_-20px_rgb(0_0_0/0.18)]">
              <p>
                <strong className="text-brand-black">Heads up:</strong> exact dates for the November
                2027 off-cycle governorship elections (Bayelsa, Imo, Kogi) will be confirmed by
                INEC closer to the polls. Always check{" "}
                <a
                  href="https://inecnigeria.org"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-[#00733a] underline-offset-4 hover:underline"
                >
                  inecnigeria.org
                </a>{" "}
                for the latest update.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CalendarSection() {
  const [active, setActive] = useState<FilterId>("all");

  const filteredEvents = useMemo(() => {
    if (active === "all") return ELECTION_EVENTS;
    return ELECTION_EVENTS.filter((e) => e.category === active);
  }, [active]);

  const grouped = useMemo(() => {
    const groupOrder: ReadonlyArray<{
      key: string;
      cycle: "2026" | "2027";
      category: ElectionCategory;
      heading: string;
    }> = [
      {
        key: "2026-off-cycle",
        cycle: "2026",
        category: "off-cycle",
        heading: "2026 Off-Cycle Governorship Elections",
      },
      {
        key: "2027-general",
        cycle: "2027",
        category: "general",
        heading: "2027 General Elections",
      },
      {
        key: "2027-off-cycle",
        cycle: "2027",
        category: "off-cycle",
        heading: "2027 Off-Cycle Governorship Elections",
      },
    ];

    return groupOrder
      .map((g) => ({
        ...g,
        events: filteredEvents.filter(
          (e) => e.cycle === g.cycle && e.category === g.category,
        ),
      }))
      .filter((g) => g.events.length > 0);
  }, [filteredEvents]);

  const counts = useMemo(
    () => ({
      all: ELECTION_EVENTS.length,
      general: ELECTION_EVENTS.filter((e) => e.category === "general").length,
      "off-cycle": ELECTION_EVENTS.filter((e) => e.category === "off-cycle").length,
    }),
    [],
  );

  return (
    <section id="calendar" className="relative bg-white text-brand-black">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#00733a]">
              <span aria-hidden="true" className="h-px w-6 bg-[#00733a]" />
              Filter the calendar
            </span>
            <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Pick a category and see every election scheduled in that bucket.
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-brand-black/70">
              Switch between the three views below. The list updates instantly with the dates,
              coverage, and important notes for each poll.
            </p>
          </div>
          <p className="text-[12px] uppercase tracking-[0.2em] text-brand-black/50">
            Showing <strong className="text-brand-black">{filteredEvents.length}</strong> of{" "}
            {ELECTION_EVENTS.length} elections
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Election calendar filter"
          className="mt-10 grid gap-3 sm:grid-cols-3"
        >
          {FILTERS.map((f) => {
            const isActive = active === f.id;
            return (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(f.id)}
                className={`group flex items-start justify-between gap-3 rounded-2xl border px-5 py-4 text-left transition ${
                  isActive
                    ? "border-[#00733a] bg-[#00733a] text-white shadow-[0_18px_40px_-20px_rgb(0_115_58/0.5)]"
                    : "border-black/[0.08] bg-white text-brand-black hover:border-[#00733a]/40 hover:bg-[#00733a]/[0.03]"
                }`}
              >
                <span>
                  <span
                    className={`block text-[10px] font-semibold uppercase tracking-[0.22em] ${
                      isActive ? "text-white/75" : "text-[#00733a]"
                    }`}
                  >
                    {f.helper}
                  </span>
                  <span className="mt-1 block text-[15px] font-semibold leading-tight">
                    {f.label}
                  </span>
                </span>
                <span
                  className={`inline-flex h-7 min-w-[28px] items-center justify-center rounded-full px-2 text-[12px] font-semibold ${
                    isActive ? "bg-white/20 text-white" : "bg-[#00733a]/10 text-[#00733a]"
                  }`}
                >
                  {counts[f.id]}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-10 space-y-12">
          {grouped.map((group) => (
            <div key={group.key}>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-black/55">
                    {group.cycle} Calendar
                  </p>
                  <h3 className="mt-1 text-2xl font-semibold tracking-tight">
                    {group.heading}
                  </h3>
                </div>
                <span className="hidden text-[12px] uppercase tracking-[0.2em] text-brand-black/50 sm:block">
                  {group.events.length} {group.events.length === 1 ? "event" : "events"}
                </span>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {group.events.map((e) => (
                  <ElectionCard key={e.id} event={e} />
                ))}
              </div>
            </div>
          ))}
          {filteredEvents.length === 0 && (
            <div className="rounded-3xl border border-dashed border-black/15 bg-white p-12 text-center text-brand-black/60">
              No elections match this filter yet.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function ElectionCard({ event }: { event: ElectionEvent }) {
  const isGeneral = event.category === "general";
  return (
    <article
      className={`relative overflow-hidden rounded-2xl border p-6 shadow-[0_18px_40px_-30px_rgb(0_0_0/0.25)] ${
        isGeneral ? "border-[#00733a]/25 bg-[#00733a]/[0.03]" : "border-brand-red/25 bg-brand-red/[0.03]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${
            isGeneral ? "bg-[#00733a]/10 text-[#00733a]" : "bg-brand-red/10 text-brand-red"
          }`}
        >
          {isGeneral ? (
            <Flag aria-hidden="true" className="h-5 w-5" />
          ) : (
            <Landmark aria-hidden="true" className="h-5 w-5" />
          )}
        </span>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${
            isGeneral ? "bg-[#00733a] text-white" : "bg-brand-red text-white"
          }`}
        >
          {isGeneral ? "General" : "Off-cycle"}
        </span>
      </div>
      <h4 className="mt-4 text-lg font-semibold leading-snug tracking-tight">{event.type}</h4>
      <p className="mt-1 text-[13px] uppercase tracking-[0.18em] text-brand-black/55">
        {event.coverage}
      </p>
      <div className="mt-5 flex items-center gap-2 rounded-xl bg-white/80 p-3 ring-1 ring-black/[0.05]">
        <CalendarDays aria-hidden="true" className="h-4 w-4 shrink-0 text-brand-black/60" />
        <p className="text-[14px] font-semibold text-brand-black">
          {event.date}
          {event.expected && (
            <span className="ml-2 inline-flex rounded-full bg-brand-black/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-black/65">
              Expected
            </span>
          )}
        </p>
      </div>
      {event.notes && (
        <p className="mt-3 text-[13px] leading-relaxed text-brand-black/70">{event.notes}</p>
      )}
    </article>
  );
}

function MilestonesSection() {
  return (
    <section id="milestones" className="relative bg-[#fafaf7] text-brand-black">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#00733a]">
              <span aria-hidden="true" className="h-px w-6 bg-[#00733a]" />
              Pre-election milestones
            </span>
            <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              The road to the ballot box.
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-brand-black/75">
              The election day itself is the final step. INEC's calendar is full of equally
              important milestones — from voter registration to the publication of the final
              register and the official campaign window.
            </p>
            <div className="mt-7 grid gap-3 sm:max-w-md">
              <a
                href="/home/getyourpvc"
                className="group flex items-center justify-between gap-3 rounded-2xl border border-[#00733a]/30 bg-white px-5 py-4 transition hover:border-[#00733a] hover:bg-[#00733a]/[0.04]"
              >
                <span>
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-[#00733a]">
                    Step 1
                  </span>
                  <span className="mt-1 block text-[14px] font-semibold">Get your PVC</span>
                </span>
                <ArrowRight aria-hidden="true" className="h-4 w-4 text-[#00733a] transition group-hover:translate-x-0.5" />
              </a>
              <a
                href="/home/votingprocedures"
                className="group flex items-center justify-between gap-3 rounded-2xl border border-black/10 bg-white px-5 py-4 transition hover:border-[#00733a] hover:bg-[#00733a]/[0.04]"
              >
                <span>
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-[#00733a]">
                    Step 2
                  </span>
                  <span className="mt-1 block text-[14px] font-semibold">Know the voting procedure</span>
                </span>
                <ArrowRight aria-hidden="true" className="h-4 w-4 text-[#00733a] transition group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>
          <div className="lg:col-span-7">
            <ol className="relative space-y-6 border-l border-dashed border-[#00733a]/30 pl-7">
              {PRE_ELECTION_MILESTONES.map((m) => (
                <li key={m.title} className="relative">
                  <span className="absolute -left-[34px] mt-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#00733a] ring-4 ring-[#fafaf7]" />
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#00733a]">
                    {m.date}
                  </p>
                  <h4 className="mt-1 text-[16px] font-semibold leading-snug tracking-tight">
                    {m.title}
                  </h4>
                  <p className="mt-1 text-[14px] leading-relaxed text-brand-black/70">{m.detail}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

function OffCycleSection() {
  return (
    <section className="relative bg-white text-brand-black">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-red">
              <span aria-hidden="true" className="h-px w-6 bg-brand-red" />
              About off-cycle states
            </span>
            <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Why some states vote on different dates.
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-brand-black/75">
              Eight Nigerian states run their governorship elections outside the General Election
              cycle. Past judicial rulings shifted their inauguration dates, so their gubernatorial
              polls happen on a separate four-year cycle from the national vote.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-brand-black/75">
              Voters in these states still take part in the Presidential, National Assembly and
              State Houses of Assembly elections on the General Election dates — only the
              governorship vote is on a different timeline.
            </p>
          </div>
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-brand-red/20 bg-brand-red/[0.03] p-7 sm:p-9">
              <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-brand-red">
                Off-cycle states
              </p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight">
                The 8 states on a separate gubernatorial cycle
              </h3>
              <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {OFF_CYCLE_STATES.map((state) => (
                  <li
                    key={state}
                    className="flex items-center gap-2 rounded-xl bg-white p-3 text-[14px] font-semibold text-brand-black ring-1 ring-black/[0.05]"
                  >
                    <MapPin aria-hidden="true" className="h-4 w-4 text-brand-red" />
                    {state}
                  </li>
                ))}
              </ul>
              <div className="mt-6 grid gap-3 rounded-2xl bg-white p-5 ring-1 ring-black/[0.05] sm:grid-cols-2">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-black/55">
                    Voting in 2026
                  </p>
                  <p className="mt-1 text-[14px] font-semibold">Ekiti · Osun</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-black/55">
                    Voting in November 2027
                  </p>
                  <p className="mt-1 text-[14px] font-semibold">Bayelsa · Imo · Kogi</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ElectionDayTimelineSection() {
  return (
    <section className="bg-brand-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.04] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/85">
              <Clock aria-hidden="true" className="h-3.5 w-3.5" />
              Election day timeline
            </span>
            <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              How the day is expected to unfolds at your polling unit.
            </h2>
          </div>
          <p className="text-[15px] leading-relaxed text-white/70 lg:col-span-5">
            Times are uniform across all polling units in Nigeria. Plan to arrive early and stay
            with your vote until the result sheet is uploaded.
          </p>
        </div>
        <ol className="relative mt-12 space-y-6 border-l border-white/15 pl-7">
          {ELECTION_DAY_TIMELINE.map((step) => (
            <li key={step.title} className="relative">
              <span className="absolute -left-[34px] mt-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#00b25a] ring-4 ring-brand-black" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7be0a8]">
                {step.time}
              </p>
              <h4 className="mt-1 text-[17px] font-semibold leading-snug tracking-tight">
                {step.title}
              </h4>
              <p className="mt-1 text-[14px] leading-relaxed text-white/70">{step.detail}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function RemindersSection() {
  return (
    <section className="relative overflow-hidden bg-[#00733a] text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.18),transparent_55%)]"
      />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-12 lg:items-center lg:px-10">
        <div className="lg:col-span-7">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em]">
            <Bell aria-hidden="true" className="h-3.5 w-3.5" />
            Never miss a date
          </span>
          <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            Get election reminders straight to your inbox.
          </h2>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/80">
            We'll send you a clear, no-spam reminder ahead of every election on the calendar — so
            you can confirm your polling unit, plan your day, and bring the right documents.
          </p>
        </div>
        <form
          className="lg:col-span-5"
          onSubmit={(event) => {
            event.preventDefault();
            const form = event.currentTarget;
            const email = (form.elements.namedItem("email") as HTMLInputElement | null)?.value;
            if (email) {
              alert(`Thanks! We'll send election reminders to ${email}.`);
              form.reset();
            }
          }}
        >
          <label className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80">
            Your email
          </label>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-[14px] text-white placeholder:text-white/55 focus:border-white focus:bg-white/15 focus:outline-none"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#00733a] transition hover:bg-brand-black hover:text-white"
            >
              Send reminders
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-3 text-[12px] text-white/65">
            One email per election. Unsubscribe any time.
          </p>
        </form>
      </div>
    </section>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details
      className="group rounded-2xl bg-white p-5 ring-1 ring-black/[0.06] transition hover:ring-[#00733a]/30 open:ring-[#00733a]/40"
    >
      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-left text-[15px] font-semibold tracking-tight text-brand-black">
        <span>{q}</span>
        <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#00733a]/10 text-[#00733a] transition group-open:rotate-180 group-open:bg-[#00733a] group-open:text-white">
          <ChevronDown aria-hidden="true" className="h-4 w-4" />
        </span>
      </summary>
      <p className="mt-3 text-[14px] leading-relaxed text-brand-black/75">{a}</p>
    </details>
  );
}

function FaqSection() {
  return (
    <section className="bg-[#fafaf7] text-brand-black">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#00733a]">
              <span aria-hidden="true" className="h-px w-6 bg-[#00733a]" />
              FAQ
            </span>
            <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Quick answers about the election calendar.
            </h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-brand-black/70">
              Don't see your question here? Reach the OK Movement team and we'll point you to the
              right INEC resource.
            </p>
            <a
              href="/home/contact"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-brand-black/15 px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-brand-black transition hover:border-[#00733a] hover:text-[#00733a]"
            >
              Contact us
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </a>
          </div>
          <div className="space-y-3 lg:col-span-7">
            {FAQS.map((f) => (
              <FaqItem key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ElectionCalendarPage() {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <HomeSiteHeader />
      <main className="flex-1">
        <HeroSection />
        <IntroSection />
        <CalendarSection />
        <OffCycleSection />
        <RemindersSection />
        <FaqSection />
      </main>
      <HomeFooterSection />
    </div>
  );
}
