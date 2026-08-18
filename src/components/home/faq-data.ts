/**
 * FAQ copy shared between the (client) page components that render it and the
 * (server) route files that emit FAQPage structured data. Kept in a plain
 * module because a server component cannot import values from a "use client"
 * module — Next.js turns those exports into client references.
 */
export type Faq = { q: string; a: string };

export const pvcFaqs: readonly Faq[] = [
  {
    q: "Who is eligible to receive a PVC?",
    a: "Any Nigerian citizen who is 18 years or older, mentally sound and not under any legal disqualification can register and collect a PVC from INEC.",
  },
  {
    q: "Where do I collect my PVC?",
    a: "PVCs are issued at the INEC Local Government Area (LGA) office where you registered. During special collection windows INEC may decentralise to ward level — check INEC's announcements for your state.",
  },
  {
    q: "What documents do I need on collection day?",
    a: "Bring your acknowledgement slip from registration and a valid government-issued photo ID. If you registered during the latest CVR, your fingerprint or facial scan will also be used for verification.",
  },
  {
    q: "Can someone else collect my PVC for me?",
    a: "No. INEC requires the registered voter to appear in person so biometrics can be verified. Authorisation letters or third-party pickups are not accepted.",
  },
  {
    q: "I have moved to a new state. How do I transfer my registration?",
    a: "Apply for a transfer through INEC's online portal or visit the LGA office in your new location. You will need your old voter details and proof of new residence. Transfers must be completed before the official cut-off ahead of an election.",
  },
  {
    q: "I lost my PVC. What should I do?",
    a: "Report the loss at your nearest INEC LGA office and request a replacement. INEC may require an affidavit or police report. Your registration and biometrics remain valid — only the physical card is reissued.",
  },
  {
    q: "How long does it take to receive my PVC after registration?",
    a: "INEC typically prints PVCs in batches after each Continuous Voter Registration phase. Cards are usually ready 4–12 weeks after registration closes — INEC announces collection windows in each state.",
  },
  {
    q: "Is the PVC required for every election?",
    a: "Yes. Whether it is a local government, state assembly, governorship or presidential election, your PVC is the only accepted credential at the polling unit.",
  },
];

export const votingProcedureFaqs: readonly Faq[] = [
  {
    q: "What time does voting start and end?",
    a: "Accreditation and voting run from 8:30 AM to 2:30 PM. If you are already in the queue at 2:30 PM, you must be allowed to vote — do not leave the line.",
  },
  {
    q: "What if BVAS fails to recognise my fingerprint?",
    a: "The Presiding Officer will attempt facial recognition. If both fail and you appear on the register, INEC procedure allows manual verification, but you cannot be turned away simply because the device misreads.",
  },
  {
    q: "Can I vote at any polling unit?",
    a: "No. You can only vote at the specific polling unit where you registered, indicated by the code on your PVC. Voting elsewhere is not permitted.",
  },
  {
    q: "What happens if my ballot is rejected?",
    a: "Ballots are rejected for double thumbprints, marks outside the box, or unstamped papers. You generally cannot get a replacement, so mark carefully — one clear thumbprint inside one box.",
  },
  {
    q: "Can I take photos at the polling unit?",
    a: "Yes — you may photograph the publicly pasted result sheet (Form EC8A) and the general environment, but not your own ballot inside the cubicle.",
  },
  {
    q: "Who can I report irregularities to?",
    a: "Report to the Presiding Officer first, then to accredited observers, INEC's situation room, the police, or independent monitors like Yiaga Africa. Document with photos and timestamps.",
  },
];

export const electionCalendarFaqs: readonly Faq[] = [
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
