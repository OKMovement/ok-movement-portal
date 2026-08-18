"use client";

import { PhoneInput as InternationalPhoneInput, type CountryIso2 } from "react-international-phone";
import { cn } from "@/lib/utils";

type PhoneInputProps = {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  id?: string;
  name?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  selectClassName?: string;
  inputClassName?: string;
  defaultCountry?: CountryIso2;
  dropdownClassName?: string;
};

export default function PhoneInput({
  value,
  onChange,
  onBlur,
  id,
  name,
  placeholder = "Phone number",
  disabled,
  required,
  className,
  selectClassName,
  inputClassName,
  defaultCountry = "ng",
  dropdownClassName,
}: PhoneInputProps) {
  return (
    <InternationalPhoneInput
      defaultCountry={defaultCountry}
      value={value}
      onChange={(nextPhone) => onChange(nextPhone)}
      onBlur={onBlur}
      name={name}
      required={required}
      disabled={disabled}
      placeholder={placeholder}
      className={cn("w-full", className)}
      inputClassName={cn(
        "min-h-12 w-full rounded-[10px] border border-black/12 bg-white px-4 text-sm text-brand-black placeholder:text-black/35 focus-visible:border-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-green/50 disabled:cursor-not-allowed disabled:opacity-60",
        inputClassName,
      )}
      countrySelectorStyleProps={{
        buttonClassName: cn(
          "min-h-12 rounded-[10px] border border-black/12 bg-white text-brand-black focus-visible:border-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-green/50 disabled:cursor-not-allowed disabled:opacity-60",
          selectClassName,
        ),
        dropdownStyleProps: {
          className: cn(
            "z-50 max-h-56 w-[min(18rem,calc(100vw-2rem))] overflow-y-auto rounded-xl border border-black/10 bg-white py-1 shadow-[0_18px_40px_-16px_rgb(0_0_0/0.35)]",
            dropdownClassName,
          ),
          style: { top: "calc(100% + 0.5rem)" },
        },
      }}
      inputProps={{
        id,
        autoComplete: "tel",
        inputMode: "tel",
      }}
    />
  );
}
