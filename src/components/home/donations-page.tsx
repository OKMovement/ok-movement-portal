import { ArrowDown, CheckCircle2, Heart, LockKeyhole, Receipt, ShieldCheck } from "lucide-react";
import DonationForm from "./donation-form";
import DonationKindCards from "./donation-kind-cards";
import { involveFaqs } from "./get-involved-data";
import HomeFooterSection from "./home-footer-section";
import HomeSiteHeader from "./home-site-header";

const donationFaqs = involveFaqs.filter(({ q }) =>
  /donation|materials|diaspora/i.test(q),
);

export default function DonationsPage() {
  return (
    <main className="min-h-screen bg-[#f7f7f4] text-brand-black">
      <HomeSiteHeader />

      <section className="relative isolate overflow-hidden bg-brand-black text-white">
        <div className="absolute inset-0 -z-20">
          <img src="/images/bg-5.jpeg" alt="" className="h-full w-full object-cover object-center opacity-35" />
        </div>
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(110deg,rgb(0_0_0/0.95)_0%,rgb(0_0_0/0.76)_48%,rgb(0_0_0/0.55)_100%)]" />
        <div aria-hidden="true" className="absolute -right-28 -top-32 -z-10 h-[32rem] w-[32rem] rounded-full bg-brand-green/25 blur-3xl" />
        <div className="mx-auto grid w-[min(100%-1.5rem,80rem)] gap-12 pb-24 pt-24 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:pb-28 lg:pt-32">
          <div>
            <div className="flex items-center gap-4">
              <span aria-hidden="true" className="flex h-[2px] w-24 overflow-hidden rounded-full">
                <span className="flex-1 bg-brand-green" /><span className="flex-1 bg-white/70" /><span className="flex-1 bg-brand-red" />
              </span>
              <p className="text-[11px] font-semibold uppercase tracking-[0.42em] text-white/70">Donations</p>
            </div>
            <h1 className="mt-6 max-w-3xl text-4xl font-medium leading-[1.02] tracking-tight sm:text-5xl lg:text-[4.4rem]">
              Power the work.<br /><span className="text-brand-green">Move Nigeria forward.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/78 sm:text-lg">
              Your contribution helps fund grassroots organising, voter education, community programmes, communications, and the materials our teams need across Nigeria.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#donate-now" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-[10px] bg-brand-green px-7 text-sm font-semibold uppercase tracking-[0.16em] text-white shadow-[0_18px_36px_-12px_rgb(0_166_81/0.55)] transition hover:bg-white hover:text-brand-green">
                Donate now <ArrowDown aria-hidden="true" className="h-4 w-4" />
              </a>
              <a href="#ways-to-give" className="inline-flex min-h-14 items-center justify-center rounded-[10px] border border-white/25 bg-white/5 px-7 text-sm font-semibold uppercase tracking-[0.16em] text-white backdrop-blur transition hover:bg-white hover:text-brand-black">
                See ways to give
              </a>
            </div>
            <ul className="mt-8 flex flex-wrap gap-3 text-xs font-medium uppercase tracking-[0.13em] text-white/70">
              <li className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2"><LockKeyhole className="h-3.5 w-3.5 text-brand-green" />Hosted checkout</li>
              <li className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2"><ShieldCheck className="h-3.5 w-3.5 text-brand-green" />Server verified</li>
              <li className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2"><Receipt className="h-3.5 w-3.5 text-brand-red" />Donation recorded</li>
            </ul>
          </div>

          <div className="rounded-[20px] border border-white/15 bg-white/8 p-6 backdrop-blur-md sm:p-8">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-green text-white"><Heart aria-hidden="true" className="h-6 w-6" /></span>
            <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.32em] text-brand-green">Citizen powered</p>
            <h2 className="mt-3 text-2xl font-medium sm:text-3xl">Every contribution has a job.</h2>
            <ul className="mt-6 space-y-4 text-sm leading-relaxed text-white/80">
              {["Equip ward and state organisers", "Reach voters with accurate information", "Support community events and mobilisation", "Produce campaign and training materials"].map((item) => (
                <li key={item} className="flex items-start gap-3"><CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" />{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="donate-now" className="scroll-mt-24 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto grid w-[min(100%-1.5rem,80rem)] gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <span aria-hidden="true" className="flex h-[2px] w-20 overflow-hidden rounded-full"><span className="flex-1 bg-brand-green" /><span className="flex-1 bg-brand-black" /><span className="flex-1 bg-brand-red" /></span>
            <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.35em] text-brand-red">Give securely</p>
            <h2 className="mt-3 text-3xl font-medium leading-tight sm:text-4xl">Your support starts here.</h2>
            <p className="mt-4 text-base leading-relaxed text-black/65">
              Continue to Flutterwave&apos;s secure hosted page to complete your donation. Available card, bank, USSD, and other methods depend on your location.
            </p>
            <div className="mt-7 rounded-[14px] border border-brand-green/20 bg-brand-green/5 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-green">How it works</p>
              <ol className="mt-4 space-y-3 text-sm text-black/70">
                <li className="flex gap-3"><span className="font-semibold text-brand-green">01</span>Choose an amount and enter your details.</li>
                <li className="flex gap-3"><span className="font-semibold text-brand-green">02</span>Complete payment securely on Flutterwave.</li>
                <li className="flex gap-3"><span className="font-semibold text-brand-green">03</span>We verify and record the donation automatically.</li>
              </ol>
            </div>
          </div>
          <DonationForm />
        </div>
      </section>

      <section id="ways-to-give" className="scroll-mt-24 bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto w-[min(100%-1.5rem,80rem)]">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-brand-red">More ways to support</p>
            <h2 className="mt-4 text-3xl font-medium sm:text-4xl">Three ways to power the movement.</h2>
            <p className="mt-4 text-base leading-relaxed text-black/65">The same support options from Get Involved are available here, whether you want to give cash, materials, goods, or professional services.</p>
          </div>
          <div className="mt-12"><DonationKindCards /></div>
        </div>
      </section>

      <section className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto w-[min(100%-1.5rem,56rem)]">
          <div className="text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-brand-red">Donation questions</p>
            <h2 className="mt-4 text-3xl font-medium sm:text-4xl">Before you give.</h2>
          </div>
          <div className="mt-10 space-y-3">
            {donationFaqs.map((faq) => (
              <details key={faq.q} className="group rounded-[14px] border border-black/10 bg-white p-5 open:shadow-[0_20px_36px_-28px_rgb(0_0_0/0.4)]">
                <summary className="cursor-pointer list-none pr-5 text-base font-medium [&::-webkit-details-marker]:hidden">{faq.q}</summary>
                <p className="mt-3 border-t border-black/8 pt-3 text-sm leading-relaxed text-black/65">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <HomeFooterSection />
    </main>
  );
}
