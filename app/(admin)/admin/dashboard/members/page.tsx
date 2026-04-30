import MembersManager from "@/components/admin/members-manager";

export default async function AdminMembersPage() {
  return (
    <>
      <header className="rounded-[18px] border border-black/10 bg-white px-6 py-6 shadow-[0_22px_38px_-24px_rgb(0_0_0/0.34)]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-red">Members</p>
        <h2 className="mt-3 text-3xl font-semibold text-brand-black">Members List</h2>
        <p className="mt-2 text-sm text-black/65">
          All users who submitted the Get Involved registration form.
        </p>
      </header>
      <MembersManager />
    </>
  );
}
