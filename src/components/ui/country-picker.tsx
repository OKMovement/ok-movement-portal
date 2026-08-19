"use client";

import { useMemo, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { Check, ChevronDown, Search } from "lucide-react";
import countries from "@/lib/countries-states.json";

type CountryPickerProps = {
  value: string;
  onValueChange: (country: string) => void;
  placeholder?: string;
  disabled?: boolean;
  options?: readonly string[];
  ariaLabel?: string;
};

const allCountries = countries
  .map((country) => country.name)
  .filter((country) => country !== "Nigeria")
  .sort((left, right) => left.localeCompare(right));

export default function CountryPicker({
  value,
  onValueChange,
  placeholder = "Select your country",
  disabled = false,
  options,
  ariaLabel = "Country of residence",
}: CountryPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const visibleCountries = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const source = options ?? allCountries;
    return normalized ? source.filter((option) => option.toLowerCase().includes(normalized)) : source;
  }, [options, query]);

  function selectCountry(country: string) {
    onValueChange(country);
    setQuery("");
    setOpen(false);
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          disabled={disabled}
          aria-label={ariaLabel}
          className="flex min-h-12 w-full items-center justify-between rounded-[10px] border border-black/12 bg-white px-4 text-left text-sm text-brand-black transition focus-visible:border-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-green/50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className={value ? "truncate" : "truncate text-black/35"}>{value || placeholder}</span>
          <ChevronDown className={`ml-3 h-4 w-4 shrink-0 text-black/50 transition ${open ? "rotate-180" : ""}`} />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={8}
          className="z-[80] w-[var(--radix-popover-trigger-width)] min-w-[min(18rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-black/10 bg-white shadow-[0_22px_46px_-18px_rgb(0_0_0/0.38)]"
        >
          <div className="flex items-center gap-2 border-b border-black/8 px-3 py-2.5">
            <Search className="h-4 w-4 shrink-0 text-black/45" />
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search countries"
              className="w-full bg-transparent text-sm text-brand-black outline-none placeholder:text-black/40"
            />
          </div>
          <div role="listbox" aria-label={ariaLabel} className="max-h-60 overflow-y-auto p-1.5">
            {visibleCountries.length ? visibleCountries.map((country) => {
              const selected = country === value;
              return (
                <button
                  key={country}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => selectCountry(country)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition ${selected ? "bg-brand-green/10 font-semibold text-brand-green" : "text-brand-black hover:bg-black/[0.045]"}`}
                >
                  {country}
                  {selected ? <Check className="h-4 w-4" /> : null}
                </button>
              );
            }) : <p className="px-3 py-6 text-center text-sm text-black/55">No countries found.</p>}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
