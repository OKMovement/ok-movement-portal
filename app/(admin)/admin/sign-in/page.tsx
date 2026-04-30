"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, LockKeyhole, Mail } from "lucide-react";

export default function AdminSignInPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    const response = await fetch("/api/admin/auth/sign-in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = (await response.json().catch(() => null)) as { error?: string } | null;

    if (!response.ok) {
      setError(data?.error ?? "Unable to sign in. Please try again.");
      setIsSubmitting(false);
      return;
    }

    router.replace("/admin/dashboard");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f7f4] px-4 py-8">
      <div className="w-full max-w-lg overflow-hidden rounded-[18px] border border-black/10 bg-white shadow-[0_26px_50px_-28px_rgb(0_0_0/0.35)]">
        <span aria-hidden="true" className="flex h-[3px]">
          <span className="h-full flex-1 bg-brand-green" />
          <span className="h-full flex-1 bg-brand-black" />
          <span className="h-full flex-1 bg-brand-red" />
        </span>

        <div className="px-6 py-8 sm:px-8 sm:py-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-red">Admin</p>
          <h1 className="mt-3 text-3xl font-semibold text-brand-black">Sign in to dashboard</h1>
          <p className="mt-2 text-sm text-black/60">Use your admin credentials to continue.</p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-black/65">Email</span>
              <span className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-green" />
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="min-h-12 w-full rounded-[10px] border border-black/12 bg-white px-11 text-sm text-brand-black placeholder:text-black/35 focus-visible:border-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-green/50"
                  placeholder="admin@okmovement.ng"
                />
              </span>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-black/65">Password</span>
              <span className="relative">
                <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-green" />
                <input
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="min-h-12 w-full rounded-[10px] border border-black/12 bg-white px-11 text-sm text-brand-black placeholder:text-black/35 focus-visible:border-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-green/50"
                  placeholder="••••••••"
                />
              </span>
            </label>

            {error ? (
              <p className="rounded-[10px] border border-brand-red/25 bg-brand-red/5 px-3 py-2 text-sm text-brand-red">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-brand-black px-4 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-brand-green disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <Link
            href="/admin/forgot-password"
            className="mt-4 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-brand-green underline"
          >
            Forgot password?
          </Link>
        </div>
      </div>
    </main>
  );
}
