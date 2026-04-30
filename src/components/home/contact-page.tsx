"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Globe2,
  HandHeart,
  HeartHandshake,
  Heart,
  Info,
  Lightbulb,
  Loader2,
  Mail,
  MapPin,
  Megaphone,
  MessageCircleQuestion,
  MessageSquare,
  Newspaper,
  Phone,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import PhoneInput from "@/components/ui/phone-input";
import { isPhoneValid } from "@/lib/phone-validation";
import HomeFooterSection from "./home-footer-section";
import HomeSiteHeader from "./home-site-header";
import { SocialIcon, SOCIAL_PROFILES } from "@/components/social-icons";

type RequestType =
  | "suggestion"
  | "feedback"
  | "information"
  | "support"
  | "donation"
  | "volunteer"
  | "press"
  | "partnership"
  | "other";

type RequestOption = {
  key: RequestType;
  label: string;
  description: string;
  icon: typeof Lightbulb;
};

const requestOptions: RequestOption[] = [
  {
    key: "suggestion",
    label: "Suggestion",
    description: "Share an idea to strengthen the movement.",
    icon: Lightbulb,
  },
  {
    key: "feedback",
    label: "Feedback",
    description: "Tell us what's working — or what isn't.",
    icon: MessageSquare,
  },
  {
    key: "information",
    label: "Information",
    description: "Ask a question about our principals or programs.",
    icon: Info,
  },
  {
    key: "support",
    label: "Support",
    description: "Get help with an account, event or sign-up.",
    icon: HeartHandshake,
  },
  {
    key: "donation",
    label: "Donation",
    description: "Talk to us about contributing to the campaign.",
    icon: Heart,
  },
  {
    key: "volunteer",
    label: "Volunteer",
    description: "Join field, digital or community organising teams.",
    icon: HandHeart,
  },
  {
    key: "press",
    label: "Press / Media",
    description: "Interviews, statements and media inquiries.",
    icon: Newspaper,
  },
  {
    key: "partnership",
    label: "Partnership",
    description: "Civic groups, businesses and institutions.",
    icon: Users,
  },
  {
    key: "other",
    label: "Other",
    description: "Anything else — we'd still love to hear from you.",
    icon: Megaphone,
  },
];

const contactChannels = [
  {
    icon: Mail,
    label: "Email",
    primary: "info@okmovement.org",
    secondary: "Replies within 1–2 business days",
    href: "mailto:info@okmovement.org",
    accent: "bg-brand-green/10 text-brand-green",
  },
  {
    icon: Phone,
    label: "Phone",
    primary: "+234 909 999 9361",
    secondary: "Mon–Fri, 9:00 – 18:00 WAT",
    href: "tel:+2349099999361",
    accent: "bg-brand-red/10 text-brand-red",
  },
  {
    icon: MapPin,
    label: "National Office",
    primary: "Headquarters Annex Office, 56 Oladipo Bateye Street",
    secondary: "GRA Ikeja, Lagos",
    href: "https://maps.google.com/?q=56+Oladipo+Bateye+Street+GRA+Ikeja+Lagos",
    accent: "bg-brand-black/10 text-brand-black",
  },
  {
    icon: Globe2,
    label: "Coverage",
    primary: "36 states + the FCT",
    secondary: "120+ active local coordinators",
    href: "/home#movement",
    accent: "bg-brand-green/10 text-brand-green",
  },
];

const officeHours = [
  { day: "Monday – Friday", hours: "9:00 – 18:00 WAT" },
  { day: "Saturday", hours: "10:00 – 14:00 WAT" },
  { day: "Sunday & public holidays", hours: "Closed" },
];

type FaqItem = { q: string; a: string };
type FaqGroup = { category: string; items: FaqItem[] };

const faqGroups: FaqGroup[] = [
  {
    category: "General Movement & Leadership",
    items: [
      {
        q: "What is the core message of the OK Movement?",
        a: "The movement exists to promote the combined leadership credentials of HE Peter Obi and HE Alhaji Rabiu Kwankwaso. By harnessing the synergy of the Obidient and Kwankwasiya movements, the message is that under their stewardship, \u201CNigeria will be OK.\u201D",
      },
      {
        q: "Have the Obidient and Kwankwasiya movements merged?",
        a: "No. They continue to exist as distinct, vibrant support groups. The OK Movement acts as a unified platform drawing membership from both groups to promote their joint agenda.",
      },
      {
        q: "Why are HE Peter Obi and HE Alhaji Rabiu Kwankwaso the right leaders for Nigeria today?",
        a: "Both have a proven track record of competence and accountability. Peter Obi is cited for his work in Anambra (education and financial security), while Kwankwaso is cited for his work in Kano (infrastructure, housing, and budgetary discipline).",
      },
    ],
  },
  {
    category: "Policy & National Agenda",
    items: [
      {
        q: "What is the Obi\u2013Kwankwaso agenda for the Nigerian economy?",
        a: "A shift from \u201Cborrowing and consumption\u201D to \u201Csaving, investing, and production.\u201D Key pillars include strict budget discipline, reducing government waste, and supporting startups and SMEs.",
      },
      {
        q: "How will their leadership address the national security crisis?",
        a: "By transitioning from reactive policing to preventive, community-based security. They also view education and youth employment as vital tools to shrink the recruitment pool for criminal elements.",
      },
      {
        q: "What is their vision for education and healthcare?",
        a: "Education: free, accessible, quality education from primary to tertiary levels with an emphasis on science and technology. Healthcare: revival of primary care, better-equipped hospitals, and a focus on maternal and child health to reduce medical tourism.",
      },
      {
        q: "Does this partnership overcome Nigeria\u2019s regional and religious divides?",
        a: "Yes. The pairing of Peter Obi (East/Christian) and Rabiu Kwankwaso (North/Muslim) is intended to challenge the politics of division and demonstrate national unity.",
      },
    ],
  },
  {
    category: "Support & Mobilization",
    items: [
      {
        q: "How does the OK Movement plan to promote this agenda?",
        a: "Through a structured national network mobilising from the grassroots to the capital, engaging citizens across all 36 states and the FCT.",
      },
      {
        q: "How can Nigerians support the Obi\u2013Kwankwaso agenda?",
        a: "By joining the conversation on social media (specifically the official X platform @OK2027movement), using the hashtags #NigeriaWillBeOk and #OKMovement, and engaging with state coordinators.",
      },
    ],
  },
];

const totalFaqs = faqGroups.reduce((sum, group) => sum + group.items.length, 0);

const quickActions = [
  {
    title: "Join the Movement",
    description:
      "Volunteer your time, skills or voice — even an hour a week makes a difference.",
    href: "/home#get-involved-movement",
    cta: "Get involved",
    icon: HandHeart,
    tone: "green" as const,
  },
  {
    title: "Support the Campaign",
    description:
      "Help us reach more communities with credible, citizen-funded organising.",
    href: "/home#get-involved-movement",
    cta: "Donate",
    icon: Heart,
    tone: "red" as const,
  },
  {
    title: "Press & Media",
    description:
      "Statements, interviews and background briefings for newsrooms.",
    href: "/home/media-gallery",
    cta: "Visit newsroom",
    icon: Newspaper,
    tone: "black" as const,
  },
];

function TricolorRule({ light = false }: { light?: boolean }) {
  return (
    <span aria-hidden="true" className="flex h-[2px] w-16 overflow-hidden rounded-full">
      <span className={`h-full flex-1 ${light ? "bg-white" : "bg-brand-green"}`} />
      <span className={`h-full flex-1 ${light ? "bg-white/65" : "bg-brand-black"}`} />
      <span className="h-full flex-1 bg-brand-red" />
    </span>
  );
}

const contactSchema = z.object({
  requestType: z.enum([
    "suggestion",
    "feedback",
    "information",
    "support",
    "donation",
    "volunteer",
    "press",
    "partnership",
    "other",
  ]),
  name: z.string().trim().min(1, "Full name is required."),
  email: z.string().trim().min(1, "Email is required.").email("Enter a valid email address."),
  phone: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || isPhoneValid(value), "Enter a valid phone number."),
  region: z.string().trim().optional(),
  subject: z.string().trim().min(1, "Subject is required."),
  message: z.string().trim().min(20, "Message must be at least 20 characters."),
  newsletter: z.boolean(),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const defaultContactValues: ContactFormValues = {
  requestType: "suggestion",
  name: "",
  email: "",
  phone: "",
  region: "",
  subject: "",
  message: "",
  newsletter: true,
};

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sent">("idle");
  const [submitError, setSubmitError] = useState("");
  const [submittedName, setSubmittedName] = useState("");
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: defaultContactValues,
  });

  const selectedRequest = watch("requestType");
  const selected = useMemo(
    () => requestOptions.find((option) => option.key === selectedRequest) ?? requestOptions[0],
    [selectedRequest],
  );
  const requestTypeField = register("requestType");

  const onSubmit = async (values: ContactFormValues) => {
    setSubmitError("");

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = (await response.json().catch(() => null)) as { error?: string } | null;

    if (!response.ok) {
      setSubmitError(data?.error ?? "Unable to submit your message right now.");
      return;
    }

    setSubmittedName(values.name.trim());
    setStatus("sent");
  };

  const handleReset = () => {
    setStatus("idle");
    setSubmitError("");
    setSubmittedName("");
    reset(defaultContactValues);
  };

  return (
    <main className="min-h-screen bg-[#f7f7f4] text-brand-black">
      <HomeSiteHeader />

      {/* HERO ----------------------------------------------------- */}
      <section className="relative isolate overflow-hidden bg-brand-black text-white">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_18%_28%,rgb(0_166_81/0.32),transparent_45%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_82%_82%,rgb(224_40_40/0.26),transparent_42%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
        />

        <div className="relative mx-auto w-[min(100%-1.5rem,80rem)] pb-16 pt-24 sm:pb-20 sm:pt-28 lg:pb-24 lg:pt-32">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
            <div className="max-w-2xl">
              <div className="flex items-center gap-4">
                <TricolorRule light />
                <p className="text-[11px] font-semibold uppercase tracking-[0.46em] text-white/75">
                  Get in touch
                </p>
              </div>
              <h1 className="mt-5 text-4xl font-medium leading-[1.02] sm:text-5xl lg:text-[4.25rem]">
                We'd love to hear from you.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
                Whether you have a suggestion, want to volunteer, support the campaign, or
                speak to our press desk — start the conversation and a real person from the
                movement will get back to you.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-white/70">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 backdrop-blur">
                  <ShieldCheck aria-hidden="true" className="h-3.5 w-3.5 text-brand-green" />
                  Privacy protected
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 backdrop-blur">
                  <Clock aria-hidden="true" className="h-3.5 w-3.5 text-brand-red" />
                  Reply within 1–2 days
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 backdrop-blur">
                  <Users aria-hidden="true" className="h-3.5 w-3.5 text-white" />
                  Real organisers, not bots
                </span>
              </div>
            </div>

            {/* Quick contact summary */}
            <div className="grid gap-3 rounded-[14px] border border-white/15 bg-white/5 p-5 backdrop-blur sm:p-6 lg:min-w-[22rem]">
              {contactChannels.slice(0, 3).map(({ icon: Icon, label, primary, href }) => (
                <a
                  key={label}
                  href={href}
                  className="group flex items-center gap-4 rounded-[10px] p-2 transition hover:bg-white/10"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white">
                    <Icon aria-hidden="true" className="h-4 w-4" />
                  </span>
                  <span className="flex flex-col">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/65">
                      {label}
                    </span>
                    <span className="text-sm font-medium text-white group-hover:text-brand-green">
                      {primary}
                    </span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MAIN GRID — INFO + FORM ---------------------------------- */}
      <section className="mx-auto w-[min(100%-1rem,80rem)] px-4 py-16 sm:py-20 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[22rem_1fr] lg:gap-12">
          {/* LEFT — contact info */}
          <aside className="space-y-8">
            <div>
              <TricolorRule />
              <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.4em] text-brand-red">
                Reach the movement
              </p>
              <h2 className="mt-3 text-2xl font-medium leading-tight text-brand-black sm:text-3xl">
                Multiple ways to connect with our team.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-black/65">
                Choose the channel that works best for you. Every message reaches a real
                organiser on our team.
              </p>
            </div>

            <ul className="space-y-3">
              {contactChannels.map(({ icon: Icon, label, primary, secondary, href, accent }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="group flex items-start gap-4 rounded-[14px] border border-black/8 bg-white p-4 shadow-[0_14px_28px_-22px_rgb(0_0_0/0.4)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_32px_-22px_rgb(0_0_0/0.5)]"
                  >
                    <span
                      className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${accent}`}
                    >
                      <Icon aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <span className="flex flex-1 flex-col">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-black/55">
                        {label}
                      </span>
                      <span className="mt-1 text-sm font-medium text-brand-black group-hover:text-brand-green">
                        {primary}
                      </span>
                      <span className="mt-1 text-xs leading-relaxed text-black/55">
                        {secondary}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            {/* Office hours */}
            <div className="rounded-[14px] border border-black/8 bg-white p-5 shadow-[0_14px_28px_-22px_rgb(0_0_0/0.4)]">
              <div className="flex items-center gap-2">
                <Clock aria-hidden="true" className="h-4 w-4 text-brand-green" />
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-black/65">
                  Office Hours
                </p>
              </div>
              <ul className="mt-4 space-y-2 text-sm">
                {officeHours.map(({ day, hours }) => (
                  <li
                    key={day}
                    className="flex items-baseline justify-between gap-3 border-b border-black/5 pb-2 last:border-0 last:pb-0"
                  >
                    <span className="text-black/65">{day}</span>
                    <span className="font-medium text-brand-black">{hours}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Follow us */}
            <div className="rounded-[14px] border border-black/8 bg-white p-5 shadow-[0_14px_28px_-22px_rgb(0_0_0/0.4)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-black/65">
                Follow the Movement
              </p>
              <div className="mt-4 flex items-center gap-2">
                {SOCIAL_PROFILES.map((social) => (
                  <a
                    key={social.platform}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/8 text-brand-black/70 transition hover:border-brand-green hover:bg-brand-green hover:text-white"
                  >
                    <SocialIcon
                      platform={social.platform}
                      className={
                        social.platform === "x"
                          ? "h-[14px] w-[14px]"
                          : "h-[16px] w-[16px]"
                      }
                    />
                  </a>
                ))}
              </div>
            </div>
          </aside>

          {/* RIGHT — form ----------------------------------------- */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-[18px] border border-black/8 bg-white shadow-[0_24px_48px_-26px_rgb(0_0_0/0.3)]">
              <span aria-hidden="true" className="absolute inset-x-0 top-0 flex h-[3px]">
                <span className="h-full flex-1 bg-brand-green" />
                <span className="h-full flex-1 bg-brand-black" />
                <span className="h-full flex-1 bg-brand-red" />
              </span>

              {status === "sent" ? (
                <div className="flex flex-col items-center px-6 py-16 text-center sm:px-12">
                  <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-brand-green/10 text-brand-green">
                    <CheckCircle2 aria-hidden="true" className="h-8 w-8" />
                  </span>
                  <h3 className="mt-6 text-2xl font-medium leading-tight text-brand-black sm:text-3xl">
                    Thank you{submittedName ? `, ${submittedName.split(" ")[0]}` : ""} —
                    we've received your message.
                  </h3>
                  <p className="mt-4 max-w-md text-base leading-relaxed text-black/65">
                    A member of the OK Movement team will respond by email within 1–2 business
                    days. In the meantime, follow us for the latest updates.
                  </p>
                  <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[10px] bg-brand-black px-6 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-brand-green"
                    >
                      Send another message
                    </button>
                    <a
                      href="/home#get-involved-movement"
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[10px] border border-brand-green/30 bg-brand-green/5 px-6 text-sm font-semibold uppercase tracking-[0.16em] text-brand-green transition hover:bg-brand-green hover:text-white"
                    >
                      Join the Movement
                      <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  noValidate
                  className="px-6 py-10 sm:px-10 sm:py-12"
                >
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-brand-red">
                      Send a message
                    </p>
                    <h2 className="mt-3 text-2xl font-medium leading-tight text-brand-black sm:text-3xl">
                      Tell us how we can help.
                    </h2>
                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-black/65">
                      Pick the type of request that fits best, then share a few details.
                      Required fields are marked with an asterisk.
                    </p>
                  </div>

                  {/* Request type chips */}
                  <fieldset className="mt-8">
                    <legend className="text-[11px] font-semibold uppercase tracking-[0.28em] text-black/65">
                      What's your request about? <span className="text-brand-red">*</span>
                    </legend>
                    <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {requestOptions.map(({ key, label, icon: Icon }) => {
                        const isActive = key === selectedRequest;
                        return (
                          <label
                            key={key}
                            className={`group flex cursor-pointer items-center gap-3 rounded-[12px] border px-4 py-3 text-sm font-medium transition ${
                              isActive
                                ? "border-brand-green bg-brand-green/5 text-brand-black shadow-[0_10px_20px_-12px_rgb(0_166_81/0.5)]"
                                : "border-black/10 bg-white text-black/70 hover:border-brand-green/40 hover:bg-brand-green/5 hover:text-brand-black"
                            }`}
                          >
                            <input
                              type="radio"
                              {...requestTypeField}
                              checked={isActive}
                              value={key}
                              className="sr-only"
                            />
                            <span
                              className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition ${
                                isActive
                                  ? "bg-brand-green text-white"
                                  : "bg-black/[0.04] text-brand-black group-hover:bg-brand-green/10 group-hover:text-brand-green"
                              }`}
                            >
                              <Icon aria-hidden="true" className="h-4 w-4" />
                            </span>
                            <span>{label}</span>
                          </label>
                        );
                      })}
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-black/60">
                      <span className="font-semibold uppercase tracking-[0.18em] text-brand-green">
                        {selected.label}:
                      </span>{" "}
                      {selected.description}
                    </p>
                    {errors.requestType?.message ? (
                      <p className="mt-2 text-xs text-brand-red">{errors.requestType.message}</p>
                    ) : null}
                  </fieldset>

                  {/* Form fields */}
                  <div className="mt-8 grid gap-5 sm:grid-cols-2">
                    <label className="flex flex-col gap-1.5">
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-black/65">
                        Full name <span className="text-brand-red">*</span>
                      </span>
                      <input
                        type="text"
                        {...register("name")}
                        placeholder="Adaeze Okeke"
                        className="min-h-12 rounded-[10px] border border-black/12 bg-white px-4 text-sm text-brand-black placeholder:text-black/35 focus-visible:border-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-green/50"
                      />
                      {errors.name?.message ? (
                        <span className="text-xs text-brand-red">{errors.name.message}</span>
                      ) : null}
                    </label>

                    <label className="flex flex-col gap-1.5">
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-black/65">
                        Email <span className="text-brand-red">*</span>
                      </span>
                      <input
                        type="email"
                        {...register("email")}
                        placeholder="you@example.com"
                        className="min-h-12 rounded-[10px] border border-black/12 bg-white px-4 text-sm text-brand-black placeholder:text-black/35 focus-visible:border-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-green/50"
                      />
                      {errors.email?.message ? (
                        <span className="text-xs text-brand-red">{errors.email.message}</span>
                      ) : null}
                    </label>

                    <label className="flex flex-col gap-1.5">
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-black/65">
                        Phone <span className="text-black/40">(optional)</span>
                      </span>
                      <Controller
                        control={control}
                        name="phone"
                        render={({ field }) => (
                          <PhoneInput
                            id="contact-phone"
                            value={field.value ?? ""}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            placeholder="e.g. 8012345678"
                          />
                        )}
                      />
                      {errors.phone?.message ? (
                        <span className="text-xs text-brand-red">{errors.phone.message}</span>
                      ) : null}
                    </label>

                    <label className="flex flex-col gap-1.5">
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-black/65">
                        State / Region <span className="text-black/40">(optional)</span>
                      </span>
                      <input
                        type="text"
                        {...register("region")}
                        placeholder="e.g. Lagos, FCT, Kano"
                        className="min-h-12 rounded-[10px] border border-black/12 bg-white px-4 text-sm text-brand-black placeholder:text-black/35 focus-visible:border-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-green/50"
                      />
                      {errors.region?.message ? (
                        <span className="text-xs text-brand-red">{errors.region.message}</span>
                      ) : null}
                    </label>

                    <label className="flex flex-col gap-1.5 sm:col-span-2">
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-black/65">
                        Subject <span className="text-brand-red">*</span>
                      </span>
                      <input
                        type="text"
                        {...register("subject")}
                        placeholder="A short summary"
                        className="min-h-12 rounded-[10px] border border-black/12 bg-white px-4 text-sm text-brand-black placeholder:text-black/35 focus-visible:border-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-green/50"
                      />
                      {errors.subject?.message ? (
                        <span className="text-xs text-brand-red">{errors.subject.message}</span>
                      ) : null}
                    </label>

                    <label className="flex flex-col gap-1.5 sm:col-span-2">
                      <span className="flex items-baseline justify-between text-xs font-semibold uppercase tracking-[0.2em] text-black/65">
                        <span>
                          Message <span className="text-brand-red">*</span>
                        </span>
                        <span className="text-[10px] font-normal normal-case tracking-normal text-black/45">
                          Min. 20 characters
                        </span>
                      </span>
                      <textarea
                        {...register("message")}
                        rows={6}
                        placeholder="Tell us a bit more about your request — context, timing, and how we can best help."
                        className="rounded-[10px] border border-black/12 bg-white p-4 text-sm leading-relaxed text-brand-black placeholder:text-black/35 focus-visible:border-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-green/50"
                      />
                      {errors.message?.message ? (
                        <span className="text-xs text-brand-red">{errors.message.message}</span>
                      ) : null}
                    </label>
                  </div>

                  <label className="mt-6 flex items-start gap-3 text-sm text-black/70">
                    <input
                      type="checkbox"
                      {...register("newsletter")}
                      className="mt-1 h-4 w-4 rounded border-black/20 text-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green/50"
                    />
                    <span>
                      Send me occasional updates from the OK Movement. You can unsubscribe at
                      any time.
                    </span>
                  </label>

                  <div className="mt-8 flex flex-col gap-4 border-t border-black/8 pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <p className="flex items-center gap-2 text-xs text-black/55">
                      <ShieldCheck aria-hidden="true" className="h-4 w-4 text-brand-green" />
                      Your information is private and never shared.
                    </p>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex min-h-14 items-center justify-center gap-2 rounded-[12px] bg-brand-black px-7 text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-[0_18px_36px_-14px_rgb(0_0_0/0.55)] transition hover:bg-brand-green disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                          Sending…
                        </>
                      ) : (
                        <>
                          Send Message
                          <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                  {submitError ? (
                    <p className="mt-4 rounded-[10px] border border-brand-red/25 bg-brand-red/5 px-4 py-3 text-sm text-brand-red">
                      {submitError}
                    </p>
                  ) : null}
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* QUICK ACTIONS -------------------------------------------- */}
      <section className="bg-white px-4 py-16 sm:py-20">
        <div className="mx-auto w-[min(100%-1rem,80rem)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <TricolorRule />
              <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.4em] text-brand-red">
                Other ways to engage
              </p>
              <h2 className="mt-3 text-3xl font-medium leading-tight text-brand-black sm:text-4xl">
                Pick a quick action.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-black/65">
              Don't want to wait for a reply? Jump straight into one of the most popular ways
              to support the movement.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {quickActions.map(({ title, description, href, cta, icon: Icon, tone }) => {
              const toneClasses =
                tone === "green"
                  ? "border-brand-green/20 bg-brand-green/5 hover:bg-brand-green hover:text-white"
                  : tone === "red"
                    ? "border-brand-red/20 bg-brand-red/5 hover:bg-brand-red hover:text-white"
                    : "border-black/10 bg-[#f5f5f3] hover:bg-brand-black hover:text-white";
              const iconTone =
                tone === "green"
                  ? "bg-brand-green text-white"
                  : tone === "red"
                    ? "bg-brand-red text-white"
                    : "bg-brand-black text-white";
              return (
                <a
                  key={title}
                  href={href}
                  className={`group flex flex-col gap-5 rounded-[16px] border p-6 transition ${toneClasses}`}
                >
                  <span
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-full ${iconTone}`}
                  >
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-xl font-medium leading-tight">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed opacity-80">{description}</p>
                  </div>
                  <span className="mt-auto inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em]">
                    {cta}
                    <ArrowUpRight
                      aria-hidden="true"
                      className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ ----------------------------------------------------- */}
      <section className="px-4 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto w-[min(100%-1rem,72rem)]">
          <div className="grid gap-10 lg:grid-cols-[20rem_1fr] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <TricolorRule />
              <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.4em] text-brand-red">
                Frequently asked
              </p>
              <h2 className="mt-3 text-3xl font-medium leading-tight text-brand-black sm:text-4xl">
                Answers to common questions.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-black/65">
                Quick answers about the movement, our principals, the joint policy agenda
                and how to get involved. Can't find what you're looking for? Send us a
                message above.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold uppercase tracking-[0.18em]">
                <span className="inline-flex items-center gap-2 text-brand-green">
                  <MessageCircleQuestion aria-hidden="true" className="h-4 w-4" />
                  {totalFaqs} questions
                </span>
                <span className="text-black/45">·</span>
                <span className="text-black/55">{faqGroups.length} topics</span>
              </div>

              <ul className="mt-6 hidden flex-col gap-2 lg:flex">
                {faqGroups.map((group, idx) => (
                  <li key={group.category}>
                    <a
                      href={`#faq-${idx}`}
                      className="group flex items-center justify-between gap-3 rounded-[10px] border border-black/8 bg-white px-3.5 py-2.5 text-xs font-medium text-black/70 transition hover:border-brand-green/40 hover:text-brand-black"
                    >
                      <span>{group.category}</span>
                      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-green">
                        {String(group.items.length).padStart(2, "0")}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-12">
              {faqGroups.map((group, groupIndex) => {
                const startIndex = faqGroups
                  .slice(0, groupIndex)
                  .reduce((sum, g) => sum + g.items.length, 0);
                return (
                  <section
                    key={group.category}
                    id={`faq-${groupIndex}`}
                    aria-labelledby={`faq-heading-${groupIndex}`}
                    className="scroll-mt-28"
                  >
                    <header className="flex items-baseline justify-between gap-4 border-b border-black/10 pb-4">
                      <div className="flex items-baseline gap-3">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.32em] text-brand-green">
                          {String(groupIndex + 1).padStart(2, "0")}
                        </span>
                        <h3
                          id={`faq-heading-${groupIndex}`}
                          className="text-lg font-medium text-brand-black sm:text-xl"
                        >
                          {group.category}
                        </h3>
                      </div>
                      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/50">
                        {group.items.length}{" "}
                        {group.items.length === 1 ? "question" : "questions"}
                      </span>
                    </header>

                    <ul className="mt-5 space-y-3">
                      {group.items.map((faq, itemIndex) => {
                        const globalNumber = startIndex + itemIndex + 1;
                        return (
                          <li key={faq.q}>
                            <details className="group rounded-[14px] border border-black/8 bg-white p-5 shadow-[0_14px_28px_-22px_rgb(0_0_0/0.35)] transition open:shadow-[0_18px_32px_-22px_rgb(0_0_0/0.45)]">
                              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-left text-base font-medium text-brand-black [&::-webkit-details-marker]:hidden">
                                <span className="flex items-baseline gap-3">
                                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-green">
                                    {String(globalNumber).padStart(2, "0")}
                                  </span>
                                  {faq.q}
                                </span>
                                <span
                                  aria-hidden="true"
                                  className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-black/10 text-brand-black transition group-open:rotate-45 group-open:bg-brand-green group-open:border-brand-green group-open:text-white"
                                >
                                  +
                                </span>
                              </summary>
                              <p className="mt-4 text-sm leading-relaxed text-black/65">
                                {faq.a}
                              </p>
                            </details>
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CLOSING CTA --------------------------------------------- */}
      <section
        id="contact-cta"
        className="relative isolate overflow-hidden bg-brand-green px-4 py-20 text-center text-white sm:py-24 lg:py-28"
      >
        <span aria-hidden="true" className="absolute inset-x-0 top-0 flex h-[3px]">
          <span className="h-full flex-1 bg-white/40" />
          <span className="h-full flex-1 bg-brand-black/60" />
          <span className="h-full flex-1 bg-brand-red" />
        </span>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-32 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-white/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 bottom-0 h-64 w-64 rounded-full bg-brand-red/30 blur-3xl"
        />

        <div className="relative mx-auto w-[min(100%-1rem,52rem)]">
          <div className="flex items-center justify-center gap-4">
            <TricolorRule light />
            <p className="text-[11px] font-semibold uppercase tracking-[0.46em] text-white/85">
              Be part of the rebirth
            </p>
            <TricolorRule light />
          </div>
          <h2 className="mx-auto mt-5 text-3xl font-medium leading-tight sm:text-4xl lg:text-5xl">
            Every message moves the movement forward.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
            Join thousands of citizens already organising for credible leadership in 2027.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="/home#get-involved-movement"
              className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-[10px] bg-brand-red px-8 text-sm font-semibold uppercase tracking-[0.16em] text-white shadow-[0_18px_36px_-12px_rgb(224_40_40/0.55)] transition hover:bg-brand-black sm:w-auto"
            >
              Join the Movement
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </a>
            <a
              href="/home/media-gallery"
              className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-[10px] border border-white/40 bg-white/10 px-8 text-sm font-semibold uppercase tracking-[0.16em] text-white backdrop-blur transition hover:bg-white hover:text-brand-green sm:w-auto"
            >
              Visit Newsroom
            </a>
          </div>
        </div>
      </section>

      <HomeFooterSection />
    </main>
  );
}
