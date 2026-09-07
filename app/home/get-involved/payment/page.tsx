import type { Metadata } from "next";
import { Suspense } from "react";
import DonationPaymentResult from "@/components/home/donation-payment-result";

export const metadata: Metadata = {
  title: "Donation payment | OK Movement",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default function DonationPaymentPage() {
  return (
    <Suspense fallback={<p className="p-12 text-center">Loading payment details…</p>}>
      <DonationPaymentResult />
    </Suspense>
  );
}
