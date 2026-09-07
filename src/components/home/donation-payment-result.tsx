"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CheckCircle2, Heart, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import HomeFooterSection from "./home-footer-section";
import HomeSiteHeader from "./home-site-header";

type PaymentResult = {
  status: "pending" | "successful" | "failed";
  amount: number;
  currency: string;
  reference: string;
  provider: "paystack" | "flutterwave";
  environment: "test" | "live";
  paidAt: string | null;
  checkoutUrl: string | null;
  verificationError?: string;
};

export default function DonationPaymentResult({
  backHref = "/home/get-involved",
  backLabel = "Back to Get Involved",
}: {
  backHref?: string;
  backLabel?: string;
}) {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference") ?? searchParams.get("tx_ref") ?? "";
  const [result, setResult] = useState<PaymentResult | null>(null);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);
  const inFlight = useRef(false);

  const checkPayment = useCallback(async () => {
    if (inFlight.current) return;
    if (!reference) {
      setError("This page is missing a donation reference.");
      return;
    }
    inFlight.current = true;
    setChecking(true);
    setError("");
    try {
      const response = await fetch(`/api/donations/status?reference=${encodeURIComponent(reference)}`, {
        cache: "no-store",
        signal: AbortSignal.timeout(45_000),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Unable to check your payment.");
      setResult(data);
      setError(data.verificationError ?? "");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to check your payment. Please try again.");
    } finally {
      inFlight.current = false;
      setChecking(false);
    }
  }, [reference]);

  useEffect(() => { void checkPayment(); }, [checkPayment]);
  const paid = result?.status === "successful";
  const providerLabel = result?.provider === "flutterwave" || (!result && searchParams.has("tx_ref"))
    ? "Flutterwave"
    : "Paystack";

  useEffect(() => {
    if (paid || !reference) return;
    let attempts = 0;
    const timer = window.setInterval(() => {
      if (++attempts >= 12) window.clearInterval(timer);
      void checkPayment();
    }, 5000);
    return () => window.clearInterval(timer);
  }, [paid, reference, checkPayment]);

  return (
    <main className="min-h-screen bg-[#f7f7f4] text-brand-black">
      <HomeSiteHeader />
      <section className="mx-auto w-[min(100%-2rem,42rem)] py-24 sm:py-32">
        <div className="rounded-[18px] border border-black/10 bg-white p-6 text-center shadow-xl sm:p-12" aria-live="polite">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-green/10 text-brand-green">
            {paid ? <CheckCircle2 className="h-8 w-8" /> : checking ? <Loader2 className="h-8 w-8 animate-spin" /> : <Heart className="h-8 w-8" />}
          </span>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.22em] text-brand-green">{providerLabel}</p>
          <h1 className="mt-2 text-3xl font-medium">
            {paid ? "Thank you for your donation" : checking ? "Checking your payment" : "Payment not yet confirmed"}
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-black/65">
            {paid
              ? "Your payment has been verified and your donation is recorded. Thank you for supporting the OK Movement."
              : result?.status === "failed"
                ? `This payment was not completed. You can return to ${providerLabel} or start a new donation.`
                : `We’re waiting for confirmation from ${providerLabel}. If you have paid, check the status before making another payment.`}
          </p>
          {result ? (
            <p className="mt-5 text-2xl font-semibold">
              {new Intl.NumberFormat("en-NG", { style: "currency", currency: result.currency }).format(result.amount)}
            </p>
          ) : null}
          {result?.environment === "test" ? (
            <p className="mt-4 rounded-[10px] bg-amber-50 p-3 text-sm text-amber-900">Test mode — no real money was charged.</p>
          ) : null}
          {reference ? <p className="mt-4 break-all text-xs text-black/55">Reference: {reference}</p> : null}
          {error && !paid ? <p role="alert" className="mt-4 text-sm text-brand-red">{error}</p> : null}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {!paid ? (
              <>
                <button type="button" onClick={() => void checkPayment()} disabled={checking || !reference} className="min-h-12 rounded-[10px] bg-brand-black px-5 text-sm font-semibold text-white disabled:opacity-50">
                  {checking ? "Checking…" : "Check payment status"}
                </button>
                {result?.checkoutUrl ? (
                  <a href={result.checkoutUrl} className="inline-flex min-h-12 items-center rounded-[10px] border border-brand-green px-5 text-sm font-semibold text-brand-green">Return to {providerLabel}</a>
                ) : null}
              </>
            ) : null}
            <a href={backHref} className="inline-flex min-h-12 items-center rounded-[10px] border border-black/15 px-5 text-sm font-semibold">{backLabel}</a>
          </div>
        </div>
      </section>
      <HomeFooterSection />
    </main>
  );
}
