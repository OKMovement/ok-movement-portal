/**
 * Election facts the landing page leans on. These mirror the INEC timetable on
 * `election-calendar-page.tsx` ("presidential-2027", "gov-2027", polls-open
 * highlight) — if INEC moves a date, change it in both places.
 */
export const ELECTION = {
  presidential: {
    label: "Presidential & National Assembly",
    dateLabel: "January 16, 2027",
    short: "Jan 16, 2027",
    /** Polls open 8:30 AM West Africa Time (UTC+1). */
    opensAtIso: "2027-01-16T08:30:00+01:00",
  },
  governorship: {
    label: "Governorship & State Assemblies",
    dateLabel: "February 6, 2027",
    short: "Feb 6, 2027",
  },
  pollsOpen: "8:30 AM",
  pollsClose: "2:30 PM",
} as const;
