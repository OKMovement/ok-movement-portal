import {
  Camera,
  Code2,
  Database,
  Film,
  Headphones,
  Image as ImageIcon,
  Layers,
  Megaphone,
  Mic2,
  PenTool,
  Server,
  Share2,
  Sparkles,
  Video,
  Wand2,
  PenLine,
  Smartphone,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

export type RoleCategory = "engineering" | "creative" | "marketing" | "production";

export interface VolunteerRole {
  id: string;
  title: string;
  category: RoleCategory;
  icon: LucideIcon;
  short: string;
  responsibilities: string[];
  tools: string[];
  commitment: string;
}

export const ROLE_CATEGORIES: { id: RoleCategory; label: string; description: string }[] = [
  { id: "engineering", label: "Engineering & Product", description: "Build the digital backbone of the movement." },
  { id: "creative", label: "Creative & Design", description: "Shape the visual story of a national rebirth." },
  { id: "production", label: "Production & Media", description: "Document the journey, frame by frame." },
  { id: "marketing", label: "Content & Marketing", description: "Carry the message to every Nigerian, online and offline." },
];

export const VOLUNTEER_ROLES: VolunteerRole[] = [
  // { id: "frontend-engineer", title: "Frontend Engineer", category: "engineering", icon: Code2,
  //   short: "Build the public-facing experience of the movement.",
  //   responsibilities: ["Develop the okmovement.ng website and campaign micro-sites", "Implement responsive, accessible interfaces with React + Tailwind", "Optimize for performance across slow Nigerian networks"],
  //   tools: ["React", "TypeScript", "Tailwind", "Vite", "Next.js"], commitment: "5–10 hrs / week" },
  // { id: "backend-engineer", title: "Backend Engineer", category: "engineering", icon: Server,
  //   short: "Power volunteer, donation, and data systems behind the scenes.",
  //   responsibilities: ["Design and ship REST / GraphQL APIs for campaign tools", "Integrate payment gateways (Paystack, Flutterwave) and CRMs", "Maintain reliable, observable services for high-traffic events"],
  //   tools: ["Node.js", "Express", "Postgres", "Drizzle / Prisma"], commitment: "5–10 hrs / week" },
  // { id: "devops-engineer", title: "DevOps / Cloud Engineer", category: "engineering", icon: Database,
  //   short: "Keep our infrastructure resilient through campaign surges.",
  //   responsibilities: ["Manage hosting, CI/CD, and observability", "Harden infrastructure against DDoS & election-week traffic spikes", "Automate deployments and database backups"],
  //   tools: ["Docker", "GitHub Actions", "AWS / Vercel / Replit", "Cloudflare"], commitment: "3–6 hrs / week" },
  // { id: "mobile-engineer", title: "Mobile Engineer", category: "engineering", icon: Smartphone,
  //   short: "Bring OK Movement tools to every Nigerian's pocket.",
  //   responsibilities: ["Build the OK Movement supporter app (iOS & Android)", "Implement offline-first features for low-connectivity areas", "Integrate push notifications for rallies and key moments"],
  //   tools: ["React Native", "Expo", "Swift / Kotlin"], commitment: "5–10 hrs / week" },
  // { id: "data-analyst", title: "Data Analyst", category: "engineering", icon: Layers,
  //   short: "Turn voter & engagement data into smart decisions.",
  //   responsibilities: ["Build dashboards for outreach, donations, and events", "Run polling & sentiment analysis across regions", "Produce weekly insight briefs for campaign leadership"],
  //   tools: ["SQL", "Python", "Power BI / Metabase"], commitment: "4–8 hrs / week" },
  // { id: "cybersecurity", title: "Cybersecurity Specialist", category: "engineering", icon: ShieldCheck,
  //   short: "Defend the movement from disinformation & attacks.",
  //   responsibilities: ["Audit and harden campaign systems", "Train staff on phishing & operational security", "Coordinate incident response during high-stakes moments"],
  //   tools: ["OWASP", "Burp Suite", "1Password / SSO"], commitment: "3–6 hrs / week" },
  { id: "graphic-artist", title: "Graphic Designer", category: "creative", icon: PenTool,
    short: "Design posters, flyers, and rally collateral that move people.",
    responsibilities: ["Produce campaign posters, billboards, and social templates", "Maintain the OK Movement visual identity", "Collaborate with state coordinators on local creatives"],
    tools: ["Figma", "Illustrator", "Photoshop"], commitment: "4–10 hrs / week" },
  { id: "motion-graphics", title: "Motion Graphics Artist", category: "creative", icon: Wand2,
    short: "Animate the message — explainers, lower-thirds, transitions.",
    responsibilities: ["Animate key campaign messages and policy explainers", "Create looped social-first motion content", "Support live event broadcasts with on-screen graphics"],
    tools: ["After Effects", "Lottie", "Cavalry"], commitment: "5–10 hrs / week" },
  { id: "ui-ux-designer", title: "UI / UX Designer", category: "creative", icon: Sparkles,
    short: "Design the campaign's digital products.",
    responsibilities: ["Design the okmovement.ng experience and supporter app", "Run quick usability tests with real volunteers", "Build and maintain a shared design system"],
    tools: ["Figma", "FigJam", "Maze"], commitment: "4–8 hrs / week" },
  { id: "video-editor", title: "Video Editor", category: "production", icon: Film,
    short: "Cut campaign films, rally recaps, and viral clips.",
    responsibilities: ["Edit long-form documentaries and short-form social clips", "Maintain a versioned, organised media library", "Turn live rally footage into next-day highlights"],
    tools: ["Premiere Pro", "DaVinci Resolve", "Final Cut Pro"], commitment: "6–12 hrs / week" },
  { id: "photographer", title: "Photographer", category: "production", icon: ImageIcon,
    short: "Document the journey at rallies, town halls and walkabouts.",
    responsibilities: ["Cover events in your state and submit edited galleries", "Capture authentic portraits of supporters and leadership", "Maintain image rights and consent records"],
    tools: ["DSLR / Mirrorless", "Lightroom", "Capture One"], commitment: "Per event" },
  { id: "cinematographer", title: "Cinematographer / Videographer", category: "production", icon: Video,
    short: "Shoot beautiful, broadcast-quality footage.",
    responsibilities: ["Operate camera at major rallies, interviews, and town halls", "Coordinate with editors on shot lists and dailies", "Help set up lighting & audio for principal sit-downs"],
    tools: ["RED / Sony FX", "Gimbals", "Lighting kits"], commitment: "Per event" },
  { id: "voice-over", title: "Voice Over Artist", category: "production", icon: Mic2,
    short: "Lend your voice to ads, explainers and PSAs.",
    responsibilities: ["Record VO for campaign ads in English, Hausa, Yoruba, Igbo, Pidgin", "Maintain consistent tone across the brand", "Quick-turn revisions during live news cycles"],
    tools: ["Home studio", "Audacity / Adobe Audition"], commitment: "As briefed" },
  // { id: "audio-engineer", title: "Audio Engineer / Podcast Producer", category: "production", icon: Headphones,
  //   short: "Produce the OK Movement podcast & rally audio.",
  //   responsibilities: ["Mix and master campaign podcasts and audio townhalls", "Run live audio at rallies and broadcasts", "Package sermons and key speeches for syndication"],
  //   tools: ["Logic Pro", "Pro Tools", "Hindenburg"], commitment: "4–8 hrs / week" },
  { id: "social-media-manager", title: "Social Media Manager", category: "marketing", icon: Share2,
    short: "Run our daily presence across X, IG, TikTok and FB.",
    responsibilities: ["Plan and ship a daily content calendar", "Engage with supporters and counter disinformation", "Monitor analytics and report weekly"],
    tools: ["Later / Buffer", "Meta Business Suite", "TweetDeck"], commitment: "8–15 hrs / week" },
  { id: "content-creator", title: "Content Creator / Influencer", category: "marketing", icon: Megaphone,
    short: "Make on-camera content that reaches young Nigerians.",
    responsibilities: ["Create TikToks, Reels & YouTube Shorts on policy topics", "Mobilise your community for events", "Collaborate with editors for higher-production drops"],
    tools: ["Phone + ring light", "CapCut", "TikTok"], commitment: "Flexible" },
  { id: "script-writer", title: "Script Writer / Copywriter", category: "marketing", icon: PenLine,
    short: "Write words that move millions to action.",
    responsibilities: ["Write campaign scripts, ad copy, fundraising emails", "Translate complex policy into clear, human language", "Adapt copy for English, Pidgin and major Nigerian languages"],
    tools: ["Google Docs", "Notion"], commitment: "3–8 hrs / week" },
  // { id: "email-marketing", title: "Email & CRM Specialist", category: "marketing", icon: Camera,
  //   short: "Run lifecycle email & SMS to keep supporters engaged.",
  //   responsibilities: ["Build segmented lists of donors & volunteers", "Ship weekly newsletters and event broadcasts", "A/B test subject lines and CTAs"],
  //   tools: ["Mailchimp / Resend", "Twilio"], commitment: "3–6 hrs / week" },
];

export const VOLUNTEER_BENEFITS = [
  { title: "Build something historic", desc: "Use your craft to shape Nigeria's most ambitious civic movement in a generation." },
  { title: "Work with world-class peers", desc: "Collaborate with engineers, creatives and strategists from across Nigeria and the diaspora." },
  { title: "Mentorship & growth", desc: "Pair with senior practitioners. Get reviews, references and a portfolio that matters." },
  { title: "Recognition", desc: "Verified contributors are credited on the Hall of Volunteers and OK Movement social channels." },
  { title: "Flexible commitment", desc: "Contribute as much or as little as life allows. Per-task, per-event, or weekly retainers." },
  { title: "Real impact, fast", desc: "Ship work that reaches millions in days — not quarters. No bureaucracy." },
];

export const HOW_IT_WORKS = [
  { step: "01", title: "Apply", desc: "Tell us who you are, what you do best, and how much time you can give." },
  { step: "02", title: "Get matched", desc: "our coordinators will pair you with a project lead." },
  { step: "03", title: "Onboard", desc: "Join our Slack, sign the volunteer code of conduct, and meet your team." },
  { step: "04", title: "Start shipping", desc: "Pick up your first task. Ship work that helps win 2027." },
];

export const VOLUNTEER_FAQS = [
  { q: "Is this a paid role?", a: "Tech Volunteer roles are unpaid civic contributions. Some specialised commissions (long shoots, multi-week builds) may include stipends — these are agreed up front with your project lead." },
  { q: "How much time do I need to commit?", a: "It varies by role, but most volunteers contribute 4–10 hours per week. We also welcome per-event and per-task contributors (especially for photography, videography, and VO)." },
  { q: "I'm in the diaspora. Can I still contribute?", a: "Yes — and we need you. Most engineering, design, marketing, and editing work is fully remote. We coordinate across time zones via Slack and weekly stand-ups." },
  { q: "Will my work be credited?", a: "Yes. Verified contributors are credited on our public Hall of Volunteers, with optional links to your portfolio and social handles." },
  { q: "Who owns the work I create?", a: "Work created for the OK Movement campaign belongs to the campaign for use in mobilisation. You retain the right to showcase it in your portfolio." },
  { q: "How do you handle my data?", a: "Your information is used solely to coordinate your volunteering. We never share your details with third parties or political vendors. You can request deletion at any time." },
];

export const VOLUNTEER_STATS = [
  { value: "1,200+", label: "Active tech volunteers" },
  { value: "37", label: "States represented" },
  { value: "18", label: "Diaspora countries" },
  { value: "94%", label: "Would volunteer again" },
];

export const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe",
  "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara",
  "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau",
  "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara", "FCT (Abuja)",
];

export const DIASPORA_COUNTRIES = [
  "United Kingdom", "United States", "Canada", "Ireland", "Germany", "France",
  "Netherlands", "Belgium", "Italy", "Spain", "Sweden", "Norway", "Finland",
  "Denmark", "Switzerland", "Austria", "Portugal", "Poland", "Czech Republic",
  "Greece", "Turkey", "United Arab Emirates", "Saudi Arabia", "Qatar", "Kuwait",
  "Bahrain", "Oman", "South Africa", "Ghana", "Kenya", "Rwanda", "Egypt",
  "Morocco", "Senegal", "Côte d'Ivoire", "Australia", "New Zealand", "Japan",
  "South Korea", "China", "Singapore", "Malaysia", "India", "Indonesia",
  "Philippines", "Hong Kong", "Brazil", "Mexico", "Argentina", "Chile",
  "Trinidad & Tobago", "Jamaica", "Other",
];

export const EXPERIENCE_LEVELS = [
  "Just starting out (0–1 years)",
  "Junior (1–3 years)",
  "Mid-level (3–5 years)",
  "Senior (5–10 years)",
  "Expert / Lead (10+ years)",
];

export const AVAILABILITY_OPTIONS = [
  "1–3 hours / week",
  "4–8 hours / week",
  "9–15 hours / week",
  "16+ hours / week",
  "Per event / per task",
];
