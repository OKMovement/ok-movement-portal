/* eslint-disable jsx-a11y/role-supports-aria-props */
"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

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

const nigerianStates = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "Federal Capital Territory",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
] as const;

function NigerianStateDropdown({
  formIdPrefix,
  className,
}: {
  formIdPrefix: string;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const visibleStates = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) {
      return nigerianStates;
    }
    return nigerianStates.filter((state) => state.toLowerCase().includes(query));
  }, [searchTerm]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current) {
        return;
      }
      if (!containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative min-h-16 border-l border-black/10 bg-white max-[430px]:border-l-0 ${className ?? ""}`}
    >
      <input type="hidden" name="state" value={selectedState} />
      <div className="relative  flex min-h-16 items-center bg-white">
        <input
          id={`${formIdPrefix}-state`}
          type="text"
          value={searchTerm}
          placeholder="Search state"
          aria-label="Search for your state"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          onFocus={() => setIsOpen(true)}
          onChange={(event) => {
            const value = event.target.value;
            setSearchTerm(value);
            if (value !== selectedState) {
              setSelectedState("");
            }
            if (!isOpen) {
              setIsOpen(true);
            }
          }}
          className="min-h-16 w-full bg-white px-6 pr-12 text-base text-brand-black outline-none placeholder:text-black/45"
        />
        <button
          type="button"
          aria-label={isOpen ? "Close states list" : "Open states list"}
          onClick={() => setIsOpen((prev) => !prev)}
          className="absolute right-3 inline-flex h-10 w-10 items-center justify-center rounded-full text-brand-black/60 transition hover:bg-black/5"
        >
          <ChevronDown
            aria-hidden="true"
            className={`h-5 w-5 shrink-0 transition ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {isOpen ? (
        <ul
          role="listbox"
          aria-labelledby={`${formIdPrefix}-state`}
          className="absolute min-h-[500px] left-0 top-full z-[30000] mt-2 max-h-64 w-full overflow-y-auto border border-black/10 bg-white py-1 shadow-[0_16px_28px_rgb(0_0_0/0.14)]"
        >
          {visibleStates.length > 0 ? (
            visibleStates.map((state) => (
              <li key={state}>
                <button
                  type="button"
                  role="option"
                  aria-selected={selectedState === state}
                  onClick={() => {
                    setSelectedState(state);
                    setSearchTerm(state);
                    setIsOpen(false);
                  }}
                  className={`w-full px-6 py-3 text-left text-sm transition hover:bg-brand-green hover:text-white ${
                    selectedState === state ? "bg-brand-green text-white" : "text-brand-black"
                  }`}
                >
                  {state}
                </button>
              </li>
            ))
          ) : (
            <li className="px-6 py-3 text-sm text-brand-black/60">No matching state</li>
          )}
        </ul>
      ) : null}
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
  return (
    <form className={className} aria-label={ariaLabel}>
      <div
        className={`grid rounded-[10px] grid-cols-[minmax(0,1fr)_14rem] bg-white shadow-[0_20px_38px_rgb(0_0_0/0.2)] max-[430px]:grid-cols-1 ${gridClassName ?? ""}`}
      >
        <label className="sr-only" htmlFor={`${formIdPrefix}-email`}>
          Email address
        </label>
        <input
          id={`${formIdPrefix}-email`}
          name="email"
          type="email"
          placeholder="Email address"
          className={`min-h-16 rounded-[10px] border-0 px-6 text-lg text-brand-black outline-none placeholder:text-black/45 max-[430px]:border-b max-[430px]:border-black/10 ${emailInputClassName ?? ""}`}
        />
        <label className="sr-only" htmlFor={`${formIdPrefix}-state`}>
          State
        </label>
        <NigerianStateDropdown
          formIdPrefix={formIdPrefix}
          className={stateSelectClassName}
        />
      </div>
      <button
        type="submit"
        className={`min-h-16 mt-4 rounded-[10px] shadow-2xl w-full hover:bg-black cursor-pointer bg-brand-green px-6 text-base font-medium uppercase tracking-wide text-white shadow-[0_20px_38px_rgb(0_0_0/0.18)] transition  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${buttonClassName ?? ""}`}
      >
        {submitLabel}
      </button>
    </form>
  );
}
