"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import {
  ArrowUpRight,
  BellRing,
  CalendarDays,
  CalendarPlus,
  CheckCircle2,
  ChevronDown,
  Clock,
  Copy,
  Filter,
  Gauge,
  Globe2,
  Loader2,
  Mail,
  MapPin,
  MapPinned,
  Phone,
  Search,
  Share2,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import HomeFooterSection from "./home-footer-section";
import HomeSiteHeader from "./home-site-header";
import {
  dateRanges,
  eventFaqs,
  eventStats,
  eventTypeMeta,
  eventTypes,
  fiveCs,
  type DateRangeKey,
  type EventType,
  type UpcomingEvent,
} from "./upcoming-events-data";

/* ----------------------------------------------------------------- */
/* Helpers                                                            */
/* ----------------------------------------------------------------- */

function TricolorRule({
  light = false,
  wide = false,
}: {
  light?: boolean;
  wide?: boolean;
}) {
  return (
    <span
      aria-hidden="true"
      className={`flex h-[2px] overflow-hidden rounded-full ${
        wide ? "w-24" : "w-16"
      }`}
    >
      <span className={`h-full flex-1 ${light ? "bg-white" : "bg-brand-green"}`} />
      <span className={`h-full flex-1 ${light ? "bg-white/65" : "bg-brand-black"}`} />
      <span className="h-full flex-1 bg-brand-red" />
    </span>
  );
}

function tone(name: "green" | "red" | "black") {
  if (name === "green") {
    return {
      iconWrap: "bg-brand-green text-white",
      eyebrow: "text-brand-green",
      glow: "bg-brand-green/12",
      ring: "border-brand-green/30",
      pillBg: "bg-brand-green/10 text-brand-green",
    } as const;
  }
  if (name === "red") {
    return {
      iconWrap: "bg-brand-red text-white",
      eyebrow: "text-brand-red",
      glow: "bg-brand-red/12",
      ring: "border-brand-red/30",
      pillBg: "bg-brand-red/10 text-brand-red",
    } as const;
  }
  return {
    iconWrap: "bg-brand-black text-white",
    eyebrow: "text-brand-black",
    glow: "bg-black/8",
    ring: "border-black/20",
    pillBg: "bg-black/[0.06] text-brand-black",
  } as const;
}

const inputClass =
  "min-h-12 w-full rounded-[10px] border border-black/12 bg-white px-4 text-sm text-brand-black placeholder:text-black/35 focus-visible:border-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-green/50";

const monthShort = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const dayShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function parseEventDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

function formatDateLong(iso: string) {
  const dt = parseEventDate(iso);
  return `${dayShort[dt.getDay()]}, ${monthShort[dt.getMonth()]} ${dt.getDate()}, ${dt.getFullYear()}`;
}

function inDateRange(iso: string, range: DateRangeKey) {
  if (range === "all") return true;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dt = parseEventDate(iso);

  if (range === "this-weekend") {
    const dayOfWeek = today.getDay();
    const daysUntilSat = (6 - dayOfWeek + 7) % 7;
    const sat = new Date(today);
    sat.setDate(today.getDate() + daysUntilSat);
    const sun = new Date(sat);
    sun.setDate(sat.getDate() + 1);
    sun.setHours(23, 59, 59, 999);
    return dt >= today && dt <= sun;
  }
  if (range === "this-month") {
    return (
      dt.getFullYear() === today.getFullYear() &&
      dt.getMonth() === today.getMonth() &&
      dt >= today
    );
  }
  if (range === "next-30") {
    const end = new Date(today);
    end.setDate(today.getDate() + 30);
    return dt >= today && dt <= end;
  }
  return true;
}

/**
 * Convert a Lagos-local date + 12-hour time string to the corresponding UTC Date.
 * Africa/Lagos (WAT) is UTC+1 year-round with no DST, so we offset by -1 hour.
 * Returns null if the time string cannot be parsed.
 */
function lagosTimeToUtc(iso: string, time: string): Date | null {
  const match = time.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return null;
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return null;
  const hour12 = parseInt(match[1], 10);
  const minute = parseInt(match[2], 10);
  const period = match[3].toUpperCase();
  if (Number.isNaN(hour12) || Number.isNaN(minute)) return null;
  const hour24 = (hour12 % 12) + (period === "PM" ? 12 : 0);
  // Subtract 1 hour to convert Africa/Lagos (UTC+1) to UTC.
  return new Date(Date.UTC(y, m - 1, d, hour24 - 1, minute, 0));
}

function fmtUtcCompact(d: Date) {
  return `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, "0")}${String(
    d.getUTCDate(),
  ).padStart(2, "0")}T${String(d.getUTCHours()).padStart(2, "0")}${String(
    d.getUTCMinutes(),
  ).padStart(2, "0")}00Z`;
}

function getEventStartEnd(event: UpcomingEvent): { start: Date; end: Date } | null {
  const start = lagosTimeToUtc(event.date, event.startTime);
  const end = lagosTimeToUtc(event.date, event.endTime);
  if (!start || !end) return null;
  return { start, end };
}

function buildIcs(event: UpcomingEvent) {
  const range = getEventStartEnd(event);
  if (!range) return "data:text/calendar;charset=utf-8,";
  const { start, end } = range;

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//OK Movement//Events//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${event.id}@okmovement.ng`,
    `DTSTAMP:${fmtUtcCompact(new Date())}`,
    `DTSTART:${fmtUtcCompact(start)}`,
    `DTEND:${fmtUtcCompact(end)}`,
    `SUMMARY:${event.title}`,
    `LOCATION:${event.venue}, ${event.address}`,
    `DESCRIPTION:${event.why} \\n\\nFocus pillar: ${event.fiveC}.\\nHosted by the OK Movement.`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
}

function googleCalendarUrl(event: UpcomingEvent) {
  const range = getEventStartEnd(event);
  if (!range) return "https://calendar.google.com/calendar/r";
  const { start, end } = range;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${fmtUtcCompact(start)}/${fmtUtcCompact(end)}`,
    details: `${event.why}\n\nFocus pillar: ${event.fiveC}.\nHosted by the OK Movement.`,
    location: `${event.venue}, ${event.address}`,
    ctz: "Africa/Lagos",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function outlookCalendarUrl(event: UpcomingEvent) {
  const range = getEventStartEnd(event);
  if (!range) return "https://outlook.live.com/calendar/0/deeplink/compose";
  const { start, end } = range;
  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: event.title,
    body: `${event.why}\n\nFocus pillar: ${event.fiveC}.`,
    location: `${event.venue}, ${event.address}`,
    startdt: start.toISOString(),
    enddt: end.toISOString(),
  });
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

function googleMapsUrl(event: UpcomingEvent) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${event.venue}, ${event.address}`,
  )}`;
}

/* ----------------------------------------------------------------- */
/* Sub-components                                                     */
/* ----------------------------------------------------------------- */

type FilterState = {
  query: string;
  type: EventType | "all";
  range: DateRangeKey;
};

type PublicEventApiItem = {
  id: string;
  title: string;
  type: string;
  date: string;
  startTime: string;
  endTime: string;
  city: string;
  state: string;
  lga: string;
  venue: string;
  address: string;
  why: string;
  capacity: number;
  registrationOpen: boolean;
  registrationsCount: number;
};

const fallbackByType: Record<EventType, { fiveC: UpcomingEvent["fiveC"]; language: string }> = {
  "Town Hall": { fiveC: "Character", language: "English / Pidgin" },
  "Grassroots Training": { fiveC: "Capacity", language: "English / Hausa" },
  "Support Group": { fiveC: "Compassion", language: "English / Local language" },
  "Voter Education": { fiveC: "Competence", language: "English / Local language" },
  "Campaign Rally": { fiveC: "Commitment", language: "English / Local language" },
};

function toKnownEventType(value: string): EventType {
  return eventTypes.includes(value as EventType) ? (value as EventType) : "Town Hall";
}

function parseDurationLabel(startTime: string, endTime: string) {
  const matchTime = (value: string) => {
    const match = value.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return null;
    const hours12 = Number(match[1]);
    const minutes = Number(match[2]);
    const period = match[3].toUpperCase();
    if (!Number.isFinite(hours12) || !Number.isFinite(minutes)) return null;
    const hours24 = (hours12 % 12) + (period === "PM" ? 12 : 0);
    return { hours24, minutes };
  };

  const start = matchTime(startTime);
  const end = matchTime(endTime);
  if (!start || !end) return "TBD";
  let totalMinutes = end.hours24 * 60 + end.minutes - (start.hours24 * 60 + start.minutes);
  if (totalMinutes <= 0) totalMinutes += 24 * 60;

  if (totalMinutes % 60 === 0) {
    const hours = totalMinutes / 60;
    return `${hours} hr${hours === 1 ? "" : "s"}`;
  }
  return `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`;
}

function mapApiEventToUpcomingEvent(
  item: PublicEventApiItem,
  index: number,
): UpcomingEvent {
  const type = toKnownEventType(item.type);
  const fallback = fallbackByType[type];
  const cleanedWhy = item.why.trim();
  const safeWhy = cleanedWhy || "Join fellow citizens for civic engagement and leadership accountability.";

  return {
    id: item.id,
    title: item.title,
    type,
    date: item.date,
    startTime: item.startTime,
    endTime: item.endTime,
    durationLabel: parseDurationLabel(item.startTime, item.endTime),
    city: item.city,
    state: item.state,
    lga: item.lga,
    venue: item.venue,
    address: item.address,
    why: safeWhy,
    fiveC: fallback.fiveC,
    capacity: item.capacity,
    registered: item.registrationsCount,
    highlights: [
      "Citizen-focused policy engagement",
      "Community organising and mobilisation",
      "Action points for local follow-through",
    ],
    speakers: [],
    language: fallback.language,
    featured: index === 0,
    imageQuery: `${item.city} ${item.state} community event`,
  };
}

function CapacityBar({ event }: { event: UpcomingEvent }) {
  const pct = Math.min(100, Math.round((event.registered / event.capacity) * 100));
  const isFull = event.registered >= event.capacity;
  const isClose = pct >= 85 && !isFull;
  const barTone = isFull
    ? "bg-brand-red"
    : isClose
      ? "bg-amber-500"
      : "bg-brand-green";
  const labelColor = isFull
    ? "text-brand-red"
    : isClose
      ? "text-amber-600"
      : "text-brand-green";

  return (
    <div>
      <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.18em] text-black/55">
        <span>
          <span className={labelColor}>
            {isFull ? "Waitlist open" : `${event.capacity - event.registered} seats left`}
          </span>
        </span>
        <span>
          {event.registered.toLocaleString()} / {event.capacity.toLocaleString()}
        </span>
      </div>
      <div
        aria-hidden="true"
        className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-black/[0.06]"
      >
        <div className={`h-full rounded-full ${barTone}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function EventCard({
  event,
  onRsvp,
}: {
  event: UpcomingEvent;
  onRsvp: (event: UpcomingEvent) => void;
}) {
  const meta = eventTypeMeta[event.type];
  const t = tone(meta.tone);
  const Icon = meta.icon;
  const dt = parseEventDate(event.date);
  const isFull = event.registered >= event.capacity;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[18px] border border-black/8 bg-white shadow-[0_22px_40px_-26px_rgb(0_0_0/0.3)] transition hover:-translate-y-0.5 hover:shadow-[0_28px_46px_-22px_rgb(0_0_0/0.4)]">
      <span aria-hidden="true" className="absolute inset-x-0 top-0 flex h-[3px]">
        <span className="h-full flex-1 bg-brand-green" />
        <span className="h-full flex-1 bg-brand-black" />
        <span className="h-full flex-1 bg-brand-red" />
      </span>
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full ${t.glow} blur-2xl`}
      />

      <div className="relative flex flex-1 flex-col gap-5 p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-[12px] border border-black/8 bg-[#f7f7f4] text-brand-black">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-red">
                {monthShort[dt.getMonth()]}
              </span>
              <span className="text-2xl font-semibold leading-none">{dt.getDate()}</span>
              <span className="mt-0.5 text-[9px] uppercase tracking-[0.16em] text-black/55">
                {dayShort[dt.getDay()]}
              </span>
            </div>
            <div>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full ${t.pillBg} px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]`}
              >
                <Icon aria-hidden="true" className="h-3 w-3" />
                {event.type}
              </span>
              <p className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-black/55">
                <Clock aria-hidden="true" className="h-3 w-3" />
                {event.startTime} · {event.durationLabel}
              </p>
            </div>
          </div>
          <span
            className={`inline-flex shrink-0 items-center gap-1 rounded-full border ${t.ring} px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${t.eyebrow}`}
          >
            <Sparkles aria-hidden="true" className="h-3 w-3" />
            {event.fiveC}
          </span>
        </div>

        <div>
          <h3 className="text-xl font-medium leading-tight text-brand-black sm:text-2xl">
            {event.title}
          </h3>
          <p className="mt-2 flex items-start gap-1.5 text-sm text-black/65">
            <MapPin
              aria-hidden="true"
              className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-green"
            />
            <span>
              {event.venue} · {event.city}, {event.state}
            </span>
          </p>
        </div>

        <p className="text-sm leading-relaxed text-black/65">
          <span className="font-semibold text-brand-black">The why · </span>
          {event.why}
        </p>

        <div className="mt-auto space-y-4 pt-2">
          <CapacityBar event={event} />
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onRsvp(event)}
              className={`inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-[10px] px-5 text-sm font-semibold uppercase tracking-[0.16em] text-white transition ${
                isFull
                  ? "bg-brand-black hover:bg-brand-red"
                  : "bg-brand-green hover:bg-brand-black"
              }`}
            >
              {isFull ? "Join waitlist" : "RSVP / Register"}
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </button>
            <a
              href={googleMapsUrl(event)}
              target="_blank"
              rel="noreferrer"
              aria-label="Open venue in Google Maps"
              className="inline-flex min-h-12 w-12 items-center justify-center rounded-[10px] border border-black/12 bg-white text-brand-black transition hover:border-brand-green hover:text-brand-green"
            >
              <MapPinned aria-hidden="true" className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

function FeaturedEvent({
  event,
  onRsvp,
}: {
  event: UpcomingEvent;
  onRsvp: (event: UpcomingEvent) => void;
}) {
  const meta = eventTypeMeta[event.type];
  const t = tone(meta.tone);
  const Icon = meta.icon;
  const isFull = event.registered >= event.capacity;

  return (
    <article className="relative overflow-hidden rounded-[20px] border border-white/10 bg-brand-black text-white shadow-[0_28px_60px_-28px_rgb(0_0_0/0.6)]">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgb(0_166_81/0.32),transparent_55%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_15%_85%,rgb(224_40_40/0.28),transparent_55%)]"
      />
      <span aria-hidden="true" className="absolute inset-x-0 top-0 flex h-[3px]">
        <span className="h-full flex-1 bg-brand-green" />
        <span className="h-full flex-1 bg-white/70" />
        <span className="h-full flex-1 bg-brand-red" />
      </span>

      <div className="relative grid gap-10 p-7 sm:p-10 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:gap-14">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/85 backdrop-blur">
              <Sparkles aria-hidden="true" className="h-3 w-3 text-brand-green" />
              Featured event
            </span>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full ${t.pillBg} px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]`}
            >
              <Icon aria-hidden="true" className="h-3 w-3" />
              {event.type}
            </span>
          </div>

          <h3 className="mt-5 text-3xl font-medium leading-tight sm:text-4xl lg:text-[2.5rem]">
            {event.title}
          </h3>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/75">
            {event.why}
          </p>

          <ul className="mt-6 grid gap-2 text-sm text-white/80 sm:grid-cols-2">
            {event.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2">
                <CheckCircle2
                  aria-hidden="true"
                  className="mt-0.5 h-4 w-4 shrink-0 text-brand-green"
                />
                <span>{h}</span>
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onRsvp(event)}
              className="inline-flex min-h-13 items-center justify-center gap-2 rounded-[10px] bg-brand-green px-7 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white shadow-[0_18px_36px_-12px_rgb(0_166_81/0.55)] transition hover:bg-white hover:text-brand-green"
            >
              {isFull ? "Join the waitlist" : "Reserve your seat"}
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </button>
            <a
              href={googleMapsUrl(event)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-13 items-center justify-center gap-2 rounded-[10px] border border-white/30 bg-white/5 px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white backdrop-blur transition hover:bg-white hover:text-brand-black"
            >
              View venue
              <MapPinned aria-hidden="true" className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="space-y-4 rounded-[16px] border border-white/15 bg-white/5 p-5 backdrop-blur sm:p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-[14px] bg-white text-brand-black">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-red">
                {monthShort[parseEventDate(event.date).getMonth()]}
              </span>
              <span className="text-3xl font-semibold leading-none">
                {parseEventDate(event.date).getDate()}
              </span>
              <span className="mt-0.5 text-[9px] uppercase tracking-[0.16em] text-black/55">
                {dayShort[parseEventDate(event.date).getDay()]}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-white">
                {formatDateLong(event.date)}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-white/70">
                <Clock aria-hidden="true" className="h-3 w-3" />
                {event.startTime} – {event.endTime} · {event.durationLabel}
              </p>
            </div>
          </div>

          <div className="rounded-[12px] border border-white/10 bg-black/30 p-4">
            <p className="flex items-start gap-2 text-sm text-white/85">
              <MapPin
                aria-hidden="true"
                className="mt-0.5 h-4 w-4 shrink-0 text-brand-green"
              />
              <span>
                <span className="block font-medium text-white">{event.venue}</span>
                <span className="mt-0.5 block text-xs text-white/65">
                  {event.address}
                </span>
              </span>
            </p>
          </div>

          <CapacityBarLight event={event} />

          {event.speakers.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/60">
                On the panel
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                {event.speakers.map((s) => (
                  <li
                    key={s.name}
                    className="flex items-start gap-2 text-white/80"
                  >
                    <Users
                      aria-hidden="true"
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-green"
                    />
                    <span>
                      <span className="text-white">{s.name}</span>
                      <span className="ml-1 text-white/55">— {s.role}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function CapacityBarLight({ event }: { event: UpcomingEvent }) {
  const pct = Math.min(100, Math.round((event.registered / event.capacity) * 100));
  const isFull = event.registered >= event.capacity;
  const isClose = pct >= 85 && !isFull;
  const barTone = isFull
    ? "bg-brand-red"
    : isClose
      ? "bg-amber-400"
      : "bg-brand-green";

  return (
    <div>
      <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
        <span>
          {isFull
            ? "Waitlist open"
            : `${event.capacity - event.registered} seats left`}
        </span>
        <span>
          {event.registered.toLocaleString()} / {event.capacity.toLocaleString()}
        </span>
      </div>
      <div
        aria-hidden="true"
        className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/15"
      >
        <div className={`h-full rounded-full ${barTone}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- */
/* RSVP Modal                                                         */
/* ----------------------------------------------------------------- */

type RsvpStatus = "idle" | "sending" | "sent";

function RsvpModal({
  event,
  onClose,
}: {
  event: UpcomingEvent;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [lga, setLga] = useState("");
  const [smsOptIn, setSmsOptIn] = useState(false);
  const [organise, setOrganise] = useState(false);
  const [status, setStatus] = useState<RsvpStatus>("idle");
  const [copied, setCopied] = useState(false);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  const isFull = event.registered >= event.capacity;
  const action = isFull ? "Join the waitlist" : "Confirm my RSVP";

  useEffect(() => {
    const previouslyFocused = (typeof document !== "undefined"
      ? (document.activeElement as HTMLElement | null)
      : null);

    // Move initial focus into the dialog so keyboard users land inside.
    closeBtnRef.current?.focus();

    const focusableSelector =
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;

      const focusables = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(focusableSelector),
      ).filter((el) => el.offsetParent !== null || el === document.activeElement);
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (e.shiftKey && (active === first || !dialogRef.current.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      // Restore focus to the element that opened the dialog.
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    window.setTimeout(() => setStatus("sent"), 900);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        typeof window !== "undefined" ? window.location.href : "",
      );
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* noop */
    }
  };

  const meta = eventTypeMeta[event.type];
  const Icon = meta.icon;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Register for ${event.title}`}
      className="fixed inset-0 z-[100] flex items-center justify-center px-3 py-6 sm:px-6"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <div
        ref={dialogRef}
        className="relative flex max-h-[92vh] w-full max-w-3xl overflow-hidden rounded-[18px] border border-black/10 bg-white shadow-[0_40px_80px_-30px_rgb(0_0_0/0.6)]"
      >
        <span aria-hidden="true" className="absolute inset-x-0 top-0 flex h-[3px]">
          <span className="h-full flex-1 bg-brand-green" />
          <span className="h-full flex-1 bg-brand-black" />
          <span className="h-full flex-1 bg-brand-red" />
        </span>

        <button
          ref={closeBtnRef}
          type="button"
          onClick={onClose}
          aria-label="Close registration"
          className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-brand-black shadow-[0_4px_10px_rgb(0_0_0/0.1)] transition hover:bg-brand-red hover:text-white"
        >
          <X aria-hidden="true" className="h-4 w-4" />
        </button>

        <div className="flex w-full flex-col overflow-y-auto">
          {/* Event recap header */}
          <div className="border-b border-black/8 bg-[#f7f7f4] px-6 py-6 sm:px-10 sm:py-7">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-green">
              <Icon aria-hidden="true" className="h-3 w-3" />
              {event.type} · {event.fiveC}
            </div>
            <h2 className="mt-2 text-xl font-medium leading-tight text-brand-black sm:text-2xl">
              {event.title}
            </h2>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-black/65">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays
                  aria-hidden="true"
                  className="h-3.5 w-3.5 text-brand-green"
                />
                {formatDateLong(event.date)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock
                  aria-hidden="true"
                  className="h-3.5 w-3.5 text-brand-green"
                />
                {event.startTime} – {event.endTime}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin
                  aria-hidden="true"
                  className="h-3.5 w-3.5 text-brand-green"
                />
                {event.venue}, {event.city}
              </span>
            </div>
          </div>

          {status === "sent" ? (
            <div className="px-6 py-10 sm:px-10 sm:py-12">
              <div className="flex flex-col items-center text-center">
                <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-brand-green/10 text-brand-green">
                  <CheckCircle2 aria-hidden="true" className="h-8 w-8" />
                </span>
                <h3 className="mt-5 text-2xl font-medium leading-tight text-brand-black sm:text-3xl">
                  You&apos;re confirmed
                  {name ? `, ${name.split(" ")[0]}` : ""}.
                </h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-black/65">
                  Thank you for standing up for accountability. A confirmation email is on
                  its way to{" "}
                  <span className="font-medium text-brand-black">
                    {email || "your inbox"}
                  </span>
                  . Together, we are redefining leadership.{" "}
                  <span className="text-brand-green">See you there.</span>
                </p>
              </div>

              {/* What to bring */}
              <div className="mt-8 rounded-[14px] border border-brand-green/20 bg-brand-green/5 p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-green">
                  What to bring
                </p>
                <p className="mt-2 text-sm leading-relaxed text-brand-black/80">
                  Your passion for a better Nigeria — and at least one friend who
                  believes in the 5 Cs:{" "}
                  <span className="font-medium">
                    Character · Competence · Compassion · Capacity · Commitment
                  </span>
                  .
                </p>
              </div>

              {/* Add to calendar */}
              <div className="mt-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-red">
                  Add to your calendar
                </p>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  <a
                    href={googleCalendarUrl(event)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[10px] border border-black/12 bg-white px-4 text-sm font-medium text-brand-black transition hover:border-brand-green hover:text-brand-green"
                  >
                    <CalendarPlus aria-hidden="true" className="h-4 w-4" />
                    Google
                  </a>
                  <a
                    href={outlookCalendarUrl(event)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[10px] border border-black/12 bg-white px-4 text-sm font-medium text-brand-black transition hover:border-brand-green hover:text-brand-green"
                  >
                    <CalendarPlus aria-hidden="true" className="h-4 w-4" />
                    Outlook
                  </a>
                  <a
                    href={buildIcs(event)}
                    download={`${event.id}.ics`}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[10px] border border-black/12 bg-white px-4 text-sm font-medium text-brand-black transition hover:border-brand-green hover:text-brand-green"
                  >
                    <CalendarPlus aria-hidden="true" className="h-4 w-4" />
                    Apple / .ics
                  </a>
                </div>
              </div>

              {/* Share */}
              <div className="mt-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-black">
                  Bring a friend
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `I just RSVP'd to ${event.title} (${formatDateLong(event.date)}). Join me — OK Movement, Obi/Kwankwaso 2027.`,
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[10px] border border-black/12 bg-white px-4 text-sm font-medium text-brand-black transition hover:border-brand-green hover:text-brand-green"
                  >
                    <Share2 aria-hidden="true" className="h-4 w-4" />
                    WhatsApp
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                      `I'm in for ${event.title} on ${formatDateLong(event.date)} — ${event.venue}, ${event.city}. #OKMovement #ObiKwankwaso2027`,
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[10px] border border-black/12 bg-white px-4 text-sm font-medium text-brand-black transition hover:border-brand-green hover:text-brand-green"
                  >
                    <Share2 aria-hidden="true" className="h-4 w-4" />X (Twitter)
                  </a>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[10px] border border-black/12 bg-white px-4 text-sm font-medium text-brand-black transition hover:border-brand-green hover:text-brand-green"
                  >
                    <Copy aria-hidden="true" className="h-4 w-4" />
                    {copied ? "Link copied" : "Copy link"}
                  </button>
                </div>
              </div>

              <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-black/8 pt-6">
                <a
                  href={googleMapsUrl(event)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-brand-green hover:text-brand-black"
                >
                  <MapPinned aria-hidden="true" className="h-4 w-4" />
                  Open venue in Google Maps
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[10px] bg-brand-black px-6 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-brand-green"
                >
                  Browse more events
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="px-6 py-8 sm:px-10 sm:py-10">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-brand-red">
                  {isFull ? "Waitlist" : "RSVP"}
                </p>
                <h3 className="mt-2 text-2xl font-medium leading-tight text-brand-black sm:text-[1.7rem]">
                  Reserve your place at this gathering.
                </h3>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-black/65">
                  We&apos;ll email your confirmation, an Add-to-Calendar link and the
                  venue map. Required fields are marked with an asterisk.
                </p>
              </div>

              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-black/65">
                    Full name <span className="text-brand-red">*</span>
                  </span>
                  <input
                    type="text"
                    required
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Adaeze Okeke"
                    className={inputClass}
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-black/65">
                    Email address <span className="text-brand-red">*</span>
                  </span>
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={inputClass}
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-black/65">
                    Phone number{" "}
                    <span className="text-black/40">(optional · for SMS reminders)</span>
                  </span>
                  <input
                    type="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0803 000 0000"
                    className={inputClass}
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-black/65">
                    Local Government Area (LGA){" "}
                    <span className="text-brand-red">*</span>
                  </span>
                  <input
                    type="text"
                    required
                    value={lga}
                    onChange={(e) => setLga(e.target.value)}
                    placeholder="e.g. Ikeja"
                    className={inputClass}
                  />
                </label>
              </div>

              <div className="mt-6 grid gap-3">
                <label className="flex cursor-pointer items-start gap-3 rounded-[12px] border border-black/10 bg-white p-4 text-sm text-brand-black transition hover:border-brand-green/40 hover:bg-brand-green/5">
                  <input
                    type="checkbox"
                    checked={organise}
                    onChange={(e) => setOrganise(e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-brand-green"
                  />
                  <span>
                    <span className="font-medium">
                      I would like to help organise this event
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-black/60">
                      Your state coordinator will reach out within 1–2 business days to
                      scope a hosting role with you.
                    </span>
                  </span>
                </label>
                <label className="flex cursor-pointer items-start gap-3 rounded-[12px] border border-black/10 bg-white p-4 text-sm text-brand-black transition hover:border-brand-green/40 hover:bg-brand-green/5">
                  <input
                    type="checkbox"
                    checked={smsOptIn}
                    onChange={(e) => setSmsOptIn(e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-brand-green"
                  />
                  <span>
                    <span className="font-medium">
                      Send me an SMS / WhatsApp reminder 24 hours before
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-black/60">
                      We only message you about this event. No marketing, ever.
                    </span>
                  </span>
                </label>
              </div>

              {isFull && (
                <p className="mt-5 rounded-[10px] border border-amber-300/60 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-900">
                  This event is at full venue capacity. We&apos;ll add you to the waitlist
                  and email the moment a seat opens up — typically 24–48 hours before the
                  date.
                </p>
              )}

              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-black/8 pt-6">
                <p className="text-xs leading-relaxed text-black/55">
                  By registering you agree to be contacted only about this event. Your
                  details are never sold or shared.
                </p>
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="inline-flex min-h-13 items-center justify-center gap-2 rounded-[10px] bg-brand-green px-7 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white shadow-[0_18px_36px_-12px_rgb(0_166_81/0.55)] transition hover:bg-brand-black disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {status === "sending" ? (
                    <>
                      <Loader2
                        aria-hidden="true"
                        className="h-4 w-4 animate-spin"
                      />
                      Sending
                    </>
                  ) : (
                    <>
                      {action}
                      <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- */
/* Page                                                               */
/* ----------------------------------------------------------------- */

export default function UpcomingEventsPage() {
  const [events, setEvents] = useState<UpcomingEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [eventsError, setEventsError] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    query: "",
    type: "all",
    range: "all",
  });
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeEvent, setActiveEvent] = useState<UpcomingEvent | null>(null);
  const [geoStatus, setGeoStatus] = useState<"idle" | "asking" | "ok" | "denied">(
    "idle",
  );

  useEffect(() => {
    const loadEvents = async () => {
      setLoadingEvents(true);
      setEventsError("");

      try {
        const response = await fetch("/api/events", { cache: "no-store" });
        const data = (await response.json().catch(() => null)) as
          | { events?: PublicEventApiItem[]; error?: string }
          | null;

        if (!response.ok) {
          setEventsError(data?.error ?? "Unable to load upcoming events right now.");
          setEvents([]);
          setLoadingEvents(false);
          return;
        }

        const items = data?.events ?? [];
        setEvents(items.map((item, index) => mapApiEventToUpcomingEvent(item, index)));
      } catch {
        setEventsError("Unable to load upcoming events right now.");
        setEvents([]);
      } finally {
        setLoadingEvents(false);
      }
    };

    loadEvents();
  }, []);

  const featured = useMemo(
    () => events.find((e) => e.featured) ?? events[0] ?? null,
    [events],
  );

  const visibleEvents = useMemo(() => {
    const q = filters.query.trim().toLowerCase();
    return events
      .filter((event) => {
        if (filters.type !== "all" && event.type !== filters.type) return false;
        if (!inDateRange(event.date, filters.range)) return false;
        if (!q) return true;
        return (
          event.title.toLowerCase().includes(q) ||
          event.city.toLowerCase().includes(q) ||
          event.state.toLowerCase().includes(q) ||
          event.lga.toLowerCase().includes(q) ||
          event.venue.toLowerCase().includes(q)
        );
      })
      .sort(
        (a, b) =>
          parseEventDate(a.date).getTime() - parseEventDate(b.date).getTime(),
      );
  }, [events, filters]);

  const handleUseMyLocation = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGeoStatus("denied");
      return;
    }
    setGeoStatus("asking");
    navigator.geolocation.getCurrentPosition(
      () => setGeoStatus("ok"),
      () => setGeoStatus("denied"),
      { timeout: 6000 },
    );
  };

  const resetFilters = () =>
    setFilters({ query: "", type: "all", range: "all" });
  const hasFilters =
    filters.query !== "" || filters.type !== "all" || filters.range !== "all";

  return (
    <main className="min-h-screen bg-[#f7f7f4] text-brand-black">
      <HomeSiteHeader />

      {/* HERO --------------------------------------------------- */}
      <section className="relative isolate overflow-hidden bg-brand-black text-white">
        <div className="absolute inset-0 -z-10">
          <img
            src="/images/bg-5.jpeg"
            alt=""
            className="h-full w-full object-cover object-center opacity-40"
          />
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[linear-gradient(115deg,rgb(0_0_0/0.92)_0%,rgb(0_0_0/0.7)_45%,rgb(0_0_0/0.55)_100%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_82%_22%,rgb(0_166_81/0.32),transparent_45%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_85%,rgb(224_40_40/0.28),transparent_45%)]"
        />

        <div className="relative mx-auto w-[min(100%-1.5rem,80rem)] pb-20 pt-24 sm:pb-24 sm:pt-28 lg:pb-28 lg:pt-36">
          <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:gap-16">
            <div>
              <div className="flex items-center gap-4">
                <TricolorRule light wide />
                <p className="text-[11px] font-semibold uppercase tracking-[0.46em] text-white/75">
                  Upcoming Events
                </p>
              </div>
              <h1 className="mt-6 text-4xl font-medium leading-[1.02] tracking-tight sm:text-5xl lg:text-[4.25rem]">
                Take your place
                <br />
                in the movement.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
                Find an OK Movement gathering, town hall or training session near you.
                Leadership starts with showing up — and every Saturday, somewhere in
                Nigeria, the rebirth begins again.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <a
                  href="#events"
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-[10px] bg-brand-green px-7 text-sm font-semibold uppercase tracking-[0.16em] text-white shadow-[0_18px_36px_-12px_rgb(0_166_81/0.55)] transition hover:bg-white hover:text-brand-green"
                >
                  Browse events
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                </a>
                <a
                  href="#host"
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-[10px] border border-white/30 bg-white/5 px-7 text-sm font-semibold uppercase tracking-[0.16em] text-white backdrop-blur transition hover:bg-white hover:text-brand-black"
                >
                  Host in your LGA
                  <Sparkles aria-hidden="true" className="h-4 w-4" />
                </a>
              </div>

              <ul className="mt-8 flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-[0.16em] text-white/70">
                <li className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 backdrop-blur">
                  <CalendarPlus
                    aria-hidden="true"
                    className="h-3.5 w-3.5 text-brand-green"
                  />
                  Add to calendar
                </li>
                <li className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 backdrop-blur">
                  <Gauge
                    aria-hidden="true"
                    className="h-3.5 w-3.5 text-brand-red"
                  />
                  Live capacity
                </li>
                <li className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 backdrop-blur">
                  <BellRing
                    aria-hidden="true"
                    className="h-3.5 w-3.5 text-white"
                  />
                  SMS reminders
                </li>
              </ul>
            </div>

            <dl className="grid gap-3 rounded-[16px] border border-white/15 bg-white/5 p-5 backdrop-blur sm:grid-cols-2 sm:p-6">
              {eventStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-[12px] border border-white/10 bg-white/5 p-4 backdrop-blur"
                >
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/60">
                    {stat.label}
                  </dt>
                  <dd className="mt-2 text-3xl font-medium text-white">{stat.value}</dd>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/50">
                    {stat.helper}
                  </p>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* SEARCH / FILTER BAR ------------------------------------ */}
      <section className="relative -mt-10 sm:-mt-12 lg:-mt-14">
        <div className="mx-auto w-[min(100%-1.5rem,80rem)]">
          <div className="relative overflow-hidden rounded-[18px] border border-black/10 bg-white p-5 shadow-[0_24px_48px_-26px_rgb(0_0_0/0.35)] sm:p-6 lg:p-7">
            <span aria-hidden="true" className="absolute inset-x-0 top-0 flex h-[3px]">
              <span className="h-full flex-1 bg-brand-green" />
              <span className="h-full flex-1 bg-brand-black" />
              <span className="h-full flex-1 bg-brand-red" />
            </span>

            <div className="flex flex-wrap items-end gap-x-3 gap-y-4 lg:flex-nowrap">
              <label className="flex w-full flex-col gap-1.5 lg:flex-1">
                <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-black/55">
                  Location
                </span>
                <span className="relative">
                  <Search
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40"
                  />
                  <input
                    type="text"
                    value={filters.query}
                    onChange={(e) =>
                      setFilters((f) => ({ ...f, query: e.target.value }))
                    }
                    placeholder="Enter your City, State, or LGA — e.g. Lagos, Ikeja or Abuja, AMAC"
                    className={`${inputClass} pl-10`}
                  />
                </span>
              </label>

              <label className="flex w-full flex-col gap-1.5 sm:w-56">
                <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-black/55">
                  Event type
                </span>
                <span className="relative">
                  <Filter
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40"
                  />
                  <select
                    value={filters.type}
                    onChange={(e) =>
                      setFilters((f) => ({
                        ...f,
                        type: e.target.value as FilterState["type"],
                      }))
                    }
                    className={`${inputClass} appearance-none pl-10 pr-10`}
                  >
                    <option value="all">All event types</option>
                    {eventTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    aria-hidden="true"
                    className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-black/45"
                  />
                </span>
              </label>

              <label className="flex w-full flex-col gap-1.5 sm:w-52">
                <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-black/55">
                  Date range
                </span>
                <span className="relative">
                  <CalendarDays
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40"
                  />
                  <select
                    value={filters.range}
                    onChange={(e) =>
                      setFilters((f) => ({
                        ...f,
                        range: e.target.value as DateRangeKey,
                      }))
                    }
                    className={`${inputClass} appearance-none pl-10 pr-10`}
                  >
                    {dateRanges.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    aria-hidden="true"
                    className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-black/45"
                  />
                </span>
              </label>

              <button
                type="button"
                onClick={handleUseMyLocation}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[10px] border border-black/12 bg-white px-4 text-xs font-semibold uppercase tracking-[0.16em] text-brand-black transition hover:border-brand-green hover:text-brand-green"
              >
                {geoStatus === "asking" ? (
                  <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                ) : (
                  <MapPinned aria-hidden="true" className="h-4 w-4" />
                )}
                Near me
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-black/60">
              <p>
                Showing{" "}
                <span className="font-semibold text-brand-black">
                  {visibleEvents.length}
                </span>{" "}
                of {events.length} upcoming events
                {hasFilters ? " for your filters" : ""}.
              </p>
              <div className="flex items-center gap-3">
                {geoStatus === "ok" && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-green/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-green">
                    <MapPinned aria-hidden="true" className="h-3 w-3" />
                    Suggesting nearby
                  </span>
                )}
                {geoStatus === "denied" && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-red/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-red">
                    Location unavailable
                  </span>
                )}
                {hasFilters && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-red hover:text-brand-black"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED ----------------------------------------------- */}
      <section className="relative bg-[#f7f7f4] py-14 sm:py-16 lg:py-20">
        <div className="mx-auto w-[min(100%-1.5rem,80rem)]">
          <div className="mb-8 flex items-end justify-between gap-6 lg:mb-10">
            <div>
              <div className="inline-flex items-center gap-3">
                <span className="h-[2px] w-10 rounded-full bg-brand-green" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.32em] text-brand-red">
                  Don&apos;t miss this
                </span>
              </div>
              <h2 className="mt-4 text-3xl font-medium leading-tight text-brand-black sm:text-4xl">
                Featured next gathering
              </h2>
            </div>
          </div>
          {loadingEvents ? (
            <div className="rounded-[18px] border border-black/10 bg-white p-10 text-center">
              <p className="inline-flex items-center gap-2 text-sm text-black/65">
                <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                Loading featured event...
              </p>
            </div>
          ) : eventsError ? (
            <div className="rounded-[18px] border border-brand-red/20 bg-brand-red/5 p-10 text-center">
              <p className="text-sm text-brand-red">{eventsError}</p>
            </div>
          ) : featured ? (
            <FeaturedEvent event={featured} onRsvp={setActiveEvent} />
          ) : (
            <div className="rounded-[18px] border border-dashed border-black/15 bg-white p-10 text-center">
              <p className="text-sm text-black/65">
                No upcoming events yet. Create one from the admin dashboard and it will appear here.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* EVENTS GRID -------------------------------------------- */}
      <section
        id="events"
        className="relative scroll-mt-28 bg-white py-14 sm:py-16 lg:py-20"
      >
        <div className="mx-auto w-[min(100%-1.5rem,80rem)]">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-3">
                <span className="h-[2px] w-10 rounded-full bg-brand-green" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.32em] text-brand-red">
                  All upcoming
                </span>
              </div>
              <h2 className="mt-4 text-3xl font-medium leading-tight text-brand-black sm:text-4xl">
                Find a gathering near you.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-black/65">
              Every event is free, citizen-funded and built around one of the 5 Cs of
              leadership. RSVP to lock in your seat.
            </p>
          </div>

          {loadingEvents ? (
            <div className="mt-12 rounded-[18px] border border-black/10 bg-[#f7f7f4] p-10 text-center sm:p-14">
              <p className="inline-flex items-center gap-2 text-sm text-black/65">
                <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                Loading upcoming events...
              </p>
            </div>
          ) : eventsError ? (
            <div className="mt-12 rounded-[18px] border border-brand-red/20 bg-brand-red/5 p-10 text-center sm:p-14">
              <p className="text-sm text-brand-red">{eventsError}</p>
            </div>
          ) : visibleEvents.length === 0 ? (
            <div className="mt-12 rounded-[18px] border border-dashed border-black/15 bg-[#f7f7f4] p-10 text-center sm:p-14">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-red">
                No matches
              </p>
              <h3 className="mt-3 text-2xl font-medium text-brand-black">
                Nothing scheduled yet for those filters.
              </h3>
              <p className="mt-3 text-sm text-black/65">
                Try widening your date range or clearing the location box. New events
                drop weekly — subscribe below to be the first to know.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-[10px] bg-brand-black px-6 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-brand-green"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="mt-10 grid gap-5 lg:mt-12 lg:grid-cols-2">
              {visibleEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onRsvp={setActiveEvent}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* THE 5 Cs ----------------------------------------------- */}
      <section className="relative bg-[#f7f7f4] py-16 sm:py-20 lg:py-24">
        <div className="mx-auto w-[min(100%-1.5rem,80rem)]">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto inline-flex items-center gap-3">
              <span className="h-[2px] w-10 rounded-full bg-brand-green" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.32em] text-brand-red">
                The yardstick
              </span>
              <span className="h-[2px] w-10 rounded-full bg-brand-red" />
            </div>
            <h2 className="mt-5 text-3xl font-medium leading-tight text-brand-black sm:text-4xl lg:text-[2.75rem]">
              Every event is built around the 5 Cs.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-black/65 sm:text-lg">
              Character. Competence. Compassion. Capacity. Commitment. The five
              non-negotiables we measure leadership against — and the lens we bring to
              every gathering.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-5">
            {fiveCs.map((c) => {
              const t = tone(c.tone);
              const Icon = c.icon;
              return (
                <article
                  key={c.name}
                  className="group relative overflow-hidden rounded-[16px] border border-black/8 bg-white p-6 shadow-[0_18px_30px_-22px_rgb(0_0_0/0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_38px_-22px_rgb(0_0_0/0.4)]"
                >
                  <div
                    aria-hidden="true"
                    className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full ${t.glow} blur-2xl`}
                  />
                  <div className="relative">
                    <span
                      className={`inline-flex h-11 w-11 items-center justify-center rounded-full ${t.iconWrap}`}
                    >
                      <Icon aria-hidden="true" className="h-4 w-4" />
                    </span>
                    <h3 className="mt-5 text-lg font-medium leading-tight text-brand-black">
                      {c.name}
                    </h3>
                    <p className={`mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${t.eyebrow}`}>
                      {c.short}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-black/65">
                      {c.long}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOST AN EVENT ----------------------------------------- */}
      <section
        id="host"
        className="relative scroll-mt-28 bg-white py-16 sm:py-20 lg:py-24"
      >
        <div className="mx-auto w-[min(100%-1.5rem,80rem)]">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-14">
            <div>
              <TricolorRule />
              <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.4em] text-brand-red">
                Bring it home
              </p>
              <h2 className="mt-3 text-3xl font-medium leading-tight text-brand-black sm:text-4xl lg:text-[2.5rem]">
                Don&apos;t see your LGA? Host the next one.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-black/65 sm:text-lg">
                If the rebirth is going to reach every ward, it has to start in yours. Tell
                us where to come, who to convene, and which of the 5 Cs your community
                wants to centre — we&apos;ll bring the playbook, the materials and the
                coordinator support.
              </p>
              <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                {[
                  {
                    icon: Users,
                    label: "Convene 30+ neighbours, students or members",
                  },
                  {
                    icon: MapPin,
                    label: "Suggest a venue — hall, school or town square",
                  },
                  {
                    icon: CalendarDays,
                    label: "Choose a Saturday in the next 60 days",
                  },
                  {
                    icon: Sparkles,
                    label: "Pick a focus pillar from the 5 Cs",
                  },
                ].map(({ icon: Icon, label }) => (
                  <li
                    key={label}
                    className="flex items-start gap-3 rounded-[12px] border border-black/8 bg-[#f7f7f4] p-3 text-sm text-brand-black"
                  >
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-green/10 text-brand-green">
                      <Icon aria-hidden="true" className="h-4 w-4" />
                    </span>
                    <span className="leading-snug">{label}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="/home/get-involved"
                  className="inline-flex min-h-13 items-center justify-center gap-2 rounded-[10px] bg-brand-green px-7 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white shadow-[0_18px_36px_-12px_rgb(0_166_81/0.55)] transition hover:bg-brand-black"
                >
                  Apply to host
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                </a>
                <a
                  href="/home/contact"
                  className="inline-flex min-h-13 items-center justify-center gap-2 rounded-[10px] border border-black/12 bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-brand-black transition hover:border-brand-green hover:text-brand-green"
                >
                  Talk to coordinators
                  <Phone aria-hidden="true" className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                {
                  icon: MapPinned,
                  title: "Geolocation aware",
                  body: "Use your phone's location to surface events near you, or filter by city, state or LGA.",
                },
                {
                  icon: CalendarPlus,
                  title: "Calendar everywhere",
                  body: "One-tap links for Google, Outlook and Apple calendars on every confirmation.",
                },
                {
                  icon: Gauge,
                  title: "Capacity & waitlist",
                  body: "Full venue? We open a waitlist automatically — no manual back-and-forth.",
                },
                {
                  icon: BellRing,
                  title: "Reminders that arrive",
                  body: "Optional WhatsApp / SMS nudges so the date never sneaks up on you.",
                },
              ].map(({ icon: Icon, title, body }) => (
                <article
                  key={title}
                  className="rounded-[16px] border border-black/8 bg-[#f7f7f4] p-5"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-black text-white">
                    <Icon aria-hidden="true" className="h-4 w-4" />
                  </span>
                  <h3 className="mt-4 text-base font-medium text-brand-black">
                    {title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-black/65">
                    {body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ ---------------------------------------------------- */}
      <section className="relative bg-[#f7f7f4] py-16 sm:py-20 lg:py-24">
        <div className="mx-auto w-[min(100%-1rem,68rem)] px-4">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto inline-flex items-center gap-3">
              <span className="h-[2px] w-10 rounded-full bg-brand-green" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.32em] text-brand-red">
                Quick answers
              </span>
              <span className="h-[2px] w-10 rounded-full bg-brand-red" />
            </div>
            <h2 className="mt-5 text-3xl font-medium leading-tight text-brand-black sm:text-4xl">
              Everything you need to know.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-black/65">
              From RSVPs and reminders to waitlists and hosting — answers to the
              questions we hear most.
            </p>
          </div>

          <div className="mt-10 space-y-3">
            {eventFaqs.map((item, idx) => {
              const open = openFaq === idx;
              return (
                <button
                  key={item.q}
                  type="button"
                  onClick={() => setOpenFaq(open ? null : idx)}
                  className={`block w-full rounded-[14px] border px-5 py-5 text-left transition sm:px-6 ${
                    open
                      ? "border-brand-green/40 bg-white shadow-[0_18px_36px_-26px_rgb(0_0_0/0.3)]"
                      : "border-black/8 bg-white hover:border-brand-green/30"
                  }`}
                  aria-expanded={open}
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-base font-medium text-brand-black sm:text-lg">
                      {item.q}
                    </span>
                    <span
                      className={`mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${
                        open
                          ? "border-brand-green bg-brand-green text-white"
                          : "border-black/15 text-brand-black"
                      }`}
                    >
                      <ChevronDown
                        aria-hidden="true"
                        className={`h-3.5 w-3.5 transition ${open ? "rotate-180" : ""}`}
                      />
                    </span>
                  </div>
                  {open && (
                    <p className="mt-3 text-sm leading-relaxed text-black/70">
                      {item.a}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ALERTS / CTA ------------------------------------------ */}
      <section className="relative bg-white py-16 sm:py-20">
        <div className="mx-auto w-[min(100%-1.5rem,80rem)]">
          <div className="relative overflow-hidden rounded-[20px] bg-brand-green text-white">
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgb(255_255_255/0.18),transparent_55%)]"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(circle_at_15%_85%,rgb(224_40_40/0.28),transparent_55%)]"
            />
            <div className="relative grid gap-8 p-8 sm:p-12 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:gap-12">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-white/80">
                  Event alerts
                </p>
                <h3 className="mt-3 text-3xl font-medium leading-tight sm:text-4xl">
                  Be the first to know when the next gathering lands in your state.
                </h3>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-white/85">
                  We send one email a week — only when there&apos;s a new event in your
                  region. No spam, no marketing, no nonsense.
                </p>
              </div>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex flex-col gap-3 sm:flex-row sm:gap-2"
              >
                <label className="relative flex-1">
                  <Mail
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70"
                  />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    aria-label="Email address"
                    className="min-h-13 w-full rounded-[10px] border border-white/30 bg-white/10 px-10 text-sm text-white placeholder:text-white/60 focus-visible:border-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-white/40"
                  />
                </label>
                <button
                  type="submit"
                  className="inline-flex min-h-13 items-center justify-center gap-2 rounded-[10px] bg-white px-6 text-sm font-semibold uppercase tracking-[0.16em] text-brand-green transition hover:bg-brand-black hover:text-white"
                >
                  Subscribe
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <HomeFooterSection />

      {activeEvent && (
        <RsvpModal event={activeEvent} onClose={() => setActiveEvent(null)} />
      )}
    </main>
  );
}
