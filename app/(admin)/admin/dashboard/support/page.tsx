import SupportSubmissionsManager from "@/components/admin/support-submissions-manager";

export default async function AdminSupportPage() {
  return (
    <>
      <header className="rounded-[8px] border border-black/10 bg-white px-6 py-6 shadow-[0_22px_38px_-24px_rgb(0_0_0/0.34)]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-red">
          Support
        </p>
        <h2 className="mt-3 text-3xl font-semibold text-brand-black">Support Submissions</h2>
        <p className="mt-2 text-sm text-black/65">
          Contact form messages and Get Your PVC complaint submissions.
        </p>
      </header>
      <SupportSubmissionsManager />
    </>
  );
}
