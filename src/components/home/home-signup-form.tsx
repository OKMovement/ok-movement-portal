"use client";

import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { nigeriaStateOptions } from "@/lib/nigeria-locations";

type HomeSignupFormProps = {
  formIdPrefix: string;
  submitLabel: string;
  ariaLabel: string;
  className?: string;
  gridClassName?: string;
  emailInputClassName?: string;
  stateSelectClassName?: string;
  buttonClassName?: string;
};

function NigerianStateSelect({
  formIdPrefix,
  className,
  value,
  onChange,
}: {
  formIdPrefix: string;
  className?: string;
  value: string;
  onChange: (stateValue: string) => void;
}) {
  return (
    <div
      className={`relative min-h-16 rounded-r-[10px] border-l border-black/10 bg-white max-[430px]:rounded-b-[10px] max-[430px]:rounded-t-none max-[430px]:border-l-0 ${className ?? ""}`}
    >
      <select
          id={`${formIdPrefix}-state`}
          name="state"
          value={value}
          required
          aria-label="Select your state"
          onChange={(event) => onChange(event.target.value)}
          className="min-h-16 w-full appearance-none rounded-r-[10px] bg-white px-6 pr-12 text-base text-brand-black outline-none invalid:text-black/45 max-[430px]:rounded-b-[10px] max-[430px]:rounded-t-none"
        >
          <option value="" disabled>
            Select state
          </option>
          {nigeriaStateOptions.map((state) => (
            <option key={state.value} value={state.value}>
              {state.label}
            </option>
          ))}
        </select>
      <span className="pointer-events-none absolute inset-y-0 right-3 inline-flex items-center justify-center text-brand-black/60">
        <ChevronDown aria-hidden="true" className="h-5 w-5 shrink-0" />
      </span>
    </div>
  );
}

export default function HomeSignupForm({
  formIdPrefix,
  submitLabel,
  ariaLabel,
  className,
  gridClassName,
  emailInputClassName,
  stateSelectClassName,
  buttonClassName,
}: HomeSignupFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [selectedState, setSelectedState] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);
    const submittedEmail = String(formData.get("email") ?? "").trim();
    const submittedState = String(formData.get("state") ?? "").trim();

    const query = new URLSearchParams({
      email: submittedEmail,
      state: submittedState,
    });
    router.push(`/home/get-involved?${query.toString()}`);
  };

  return (
    <form className={className} aria-label={ariaLabel} onSubmit={handleSubmit} noValidate>
      <div className={`grid rounded-[10px] grid-cols-[minmax(0,1fr)_14rem] bg-white shadow-[0_20px_38px_rgb(0_0_0/0.2)] max-[430px]:grid-cols-1 ${gridClassName ?? ""}`}>
        <label className="sr-only" htmlFor={`${formIdPrefix}-email`}>Email address</label>
        <input
          id={`${formIdPrefix}-email`}
          name="email"
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
          }}
          required
          autoComplete="email"
          placeholder="Email address"
          className={`min-h-16 rounded-l-[10px] border-0 px-6 text-lg text-brand-black outline-none placeholder:text-black/45 max-[430px]:rounded-b-none max-[430px]:rounded-t-[10px] max-[430px]:border-b max-[430px]:border-black/10 ${emailInputClassName ?? ""}`}
        />
        <label className="sr-only" htmlFor={`${formIdPrefix}-state`}>State</label>
        <NigerianStateSelect
          formIdPrefix={formIdPrefix}
          className={stateSelectClassName}
          value={selectedState}
          onChange={setSelectedState}
        />
      </div>
      <button
        type="submit"
        className={`min-h-16 mt-4 rounded-[10px] shadow-2xl w-full hover:bg-black cursor-pointer bg-brand-green px-6 text-base font-medium uppercase tracking-wide text-white transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${buttonClassName ?? ""}`}
      >
        {submitLabel}
      </button>
    </form>
  );
}
