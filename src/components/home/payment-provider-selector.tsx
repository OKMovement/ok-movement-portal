"use client";

import { Check } from "lucide-react";
import type { PaymentProvider } from "@/lib/donation-validation";

const providers: Array<{ value: PaymentProvider; label: string; description: string; tone: string }> = [
  // Paystack can be restored here when it is ready to be offered again.
  {
    value: "flutterwave",
    label: "Flutterwave",
    description: "Secure hosted checkout",
    tone: "text-[#f5a623]",
  },
];

export default function PaymentProviderSelector({
  value,
  onChange,
}: {
  value: PaymentProvider;
  onChange: (provider: PaymentProvider) => void;
}) {
  return (
    <fieldset>
      <legend className="text-xs font-semibold uppercase tracking-[0.18em] text-black/65">
        Payment provider <span className="text-brand-red">*</span>
      </legend>
      <div className="mt-2 grid gap-3">
        {providers.map((provider) => {
          const selected = value === provider.value;
          return (
            <label
              key={provider.value}
              className={`flex cursor-pointer items-center justify-between gap-3 rounded-[12px] border p-4 transition ${selected ? "border-brand-green bg-brand-green/5 shadow-[0_12px_24px_-20px_rgb(0_166_81/0.7)]" : "border-black/10 bg-white hover:border-brand-green/40"}`}
            >
              <span className="flex items-center gap-3">
                <input
                  type="radio"
                  name="paymentProvider"
                  value={provider.value}
                  checked={selected}
                  onChange={() => onChange(provider.value)}
                  className="accent-brand-green"
                />
                <span>
                  <span className={`block text-sm font-semibold ${provider.tone}`}>{provider.label}</span>
                  <span className="mt-0.5 block text-xs text-black/55">{provider.description}</span>
                </span>
              </span>
              {selected ? <Check aria-hidden="true" className="h-5 w-5 shrink-0 text-brand-green" /> : null}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
