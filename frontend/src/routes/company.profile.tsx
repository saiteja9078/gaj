import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { formatErrorMessage, getCurrentCompany, updateCompany } from "@/lib/api";

export const Route = createFileRoute("/company/profile")({
  head: () => ({
    meta: [
      { title: "Company profile — Hirely" },
      { name: "description", content: "Edit the company profile candidates see alongside your job listings." },
      { property: "og:title", content: "Company profile — Hirely" },
      { property: "og:description", content: "Edit the profile candidates see alongside your job listings." },
    ],
  }),
  component: CompanyProfilePage,
});

function CompanyProfilePage() {
  const [company, setCompany] = useState<Awaited<ReturnType<typeof getCurrentCompany>> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getCurrentCompany()
      .then(setCompany)
      .catch(() => setCompany(null))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!company) return;
    const form = new FormData(e.currentTarget as HTMLFormElement);
    setSaving(true);
    try {
      const updated = await updateCompany({
        name: String(form.get("name") || ""),
        companyProfileUrl: String(form.get("companyProfileUrl") || ""),
        email: String(form.get("email") || ""),
      });
      setCompany(updated);
      toast.success("Company profile saved.");
    } catch (err) {
      toast.error(formatErrorMessage(err, "Failed to save profile"));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="mx-auto max-w-[720px] px-4 py-12 text-muted-foreground">Loading company profile…</div>;
  }

  if (!company) {
    return <div className="mx-auto max-w-[720px] px-4 py-12 text-muted-foreground">Please sign in as a company to edit profile settings.</div>;
  }

  return (
    <div className="mx-auto max-w-[720px] px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">Company profile</h1>
      <p className="mt-2 text-[15px] text-muted-foreground">This is what candidates see on your job listings.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-xl border border-border bg-card p-6">
        <Field label="Company name" name="name" defaultValue={company.name} />
        <Field label="Website / Profile URL" name="companyProfileUrl" defaultValue={company.companyProfileUrl || ""} />
        <Field label="Contact Email" name="email" defaultValue={(company as any).email || ""} />
        
        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-lg bg-primary py-3 text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </form>
    </div>
  );
}

function Field({ label, name, defaultValue }: { label: string; name: string; defaultValue: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      <input
        name={name}
        defaultValue={defaultValue}
        className="w-full rounded-lg border border-input bg-card px-4 py-2.5 text-[15px] text-foreground focus:border-primary focus:outline-none"
      />
    </label>
  );
}
