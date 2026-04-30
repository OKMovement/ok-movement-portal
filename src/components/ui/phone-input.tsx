"use client";

import { PhoneInput as InternationalPhoneInput } from "react-international-phone";
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
}: PhoneInputProps) {
  return (
    <InternationalPhoneInput
      defaultCountry="ng"
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
      }}
      inputProps={{
        id,
        autoComplete: "tel",
        inputMode: "tel",
      }}
    />
  );
}
