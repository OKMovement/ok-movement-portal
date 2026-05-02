import { Suspense } from "react";
import GetInvolvedPage from "@/components/home/get-involved-page";

export default function Page() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#f7f7f4]">
          <div className="mx-auto w-[min(100%-2rem,80rem)] px-4 py-24 text-sm text-black/60">
            Loading get involved page...
          </div>
        </main>
      }
    >
      <GetInvolvedPage />
    </Suspense>
  );
}
