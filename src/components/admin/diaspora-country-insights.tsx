"use client";

import { useState } from "react";
import { BarChart3, X } from "lucide-react";
import StateStatsBarChart from "./state-stats-bar-chart";

type DiasporaCountryInsightsProps = {
  countriesRepresented: number;
  data: Array<{ state: string; members: number }>;
};

export default function DiasporaCountryInsights({ countriesRepresented, data }: DiasporaCountryInsightsProps) {
  const [open, setOpen] = useState(false);

  return <>
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="text-left rounded-[8px] border border-black/10 bg-white p-5 shadow-[0_20px_34px_-24px_rgb(0_0_0/0.3)] transition hover:-translate-y-0.5 hover:border-brand-green/40 hover:shadow-[0_25px_40px_-22px_rgb(0_0_0/0.32)]"
    >
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-[8px] bg-brand-red/10 text-brand-red"><BarChart3 className="h-5 w-5" /></span>
      <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-black/55">Countries represented</p>
      <p className="mt-1 text-3xl font-semibold text-brand-black">{countriesRepresented.toLocaleString()}</p>
      <p className="mt-2 text-sm text-brand-green">View country insights</p>
    </button>

    {open ? <div role="dialog" aria-modal="true" aria-labelledby="diaspora-country-insights-title" className="fixed inset-0 z-[70] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[min(46rem,calc(100dvh-2rem))] w-full max-w-4xl flex-col rounded-xl bg-white p-5 shadow-2xl sm:p-6">
        <button type="button" onClick={() => setOpen(false)} aria-label="Close country insights" className="absolute right-4 top-4 rounded-[8px] p-2 text-black/55 transition hover:bg-black/5 hover:text-brand-black"><X className="h-5 w-5" /></button>
        <div className="pr-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-red">Location insights</p>
          <h3 id="diaspora-country-insights-title" className="mt-1 text-xl font-semibold text-brand-black">Registrations by country</h3>
          <p className="mt-1 text-sm text-black/60">Top 15 countries by diaspora registration.</p>
        </div>
        <div className="mt-5 h-[min(32rem,calc(100dvh-14rem))] min-h-64"><StateStatsBarChart data={data} /></div>
      </div>
    </div> : null}
  </>;
}
