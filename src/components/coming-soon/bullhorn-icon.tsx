"use client";

type BullhornIconProps = {
  className?: string;
};

export default function BullhornIcon({ className }: BullhornIconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path d="M14 7v10l-6-3H4a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h4l6-3Z" />
      <path d="M18 8a5 5 0 0 1 0 8" />
      <path d="M7 14.5 8.8 18a1.4 1.4 0 1 0 2.5-1.2l-1.3-2.4" />
    </svg>
  );
}