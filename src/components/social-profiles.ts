/**
 * Plain data, deliberately NOT in `social-icons.tsx`.
 *
 * That module is marked `"use client"`, so a Server Component importing a
 * non-component value from it receives a client-reference proxy rather than the
 * array itself — which fails at render with "SOCIAL_PROFILES.map is not a
 * function". Keeping the data in its own server-safe module lets both server
 * and client components read it.
 */
export type SocialPlatform = "facebook" | "x" | "instagram" | "youtube";

export const SOCIAL_PROFILES: Array<{
  platform: SocialPlatform;
  label: string;
  href: string;
}> = [
  {
    platform: "facebook",
    label: "Facebook",
    href: "https://www.facebook.com/share/1CYctYbA2m/?mibextid=wwXIfr",
  },
  {
    platform: "x",
    label: "X",
    href: "https://x.com/OK2027movement",
  },
  {
    platform: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/p/DXM5eXZDKZ0/?igsh=ZWNpbmhudXJxdDJy",
  },
  {
    platform: "youtube",
    label: "YouTube",
    href: "https://www.youtube.com/@OKMediaChannel",
  },
];
