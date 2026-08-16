import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { getCatalog, createJobPosting } from "@/lib/api";
import MDEditor from "@uiw/react-md-editor";
import type { CatalogItem } from "@/lib/api";
import { formatErrorMessage } from "@/lib/api";
import { useTheme } from "@/lib/theme";

export const Route = createFileRoute("/company/post-job")({
  beforeLoad: () => { if (typeof window === "undefined") return;
    const token = localStorage.getItem("hirely-token");
    const role = localStorage.getItem("hirely-role");
    if (!token || (role !== "company" && role !== "hiring")) {
      throw redirect({ to: "/signin" });
    }
  },
  head: () => ({
    meta: [
      { title: "Post a job — Hirely" },
      {
        name: "description",
        content: "Create a job listing with pay, location, and requirements.",
      },
      { property: "og:title", content: "Post a job — Hirely" },
      {
        property: "og:description",
        content: "Create a job listing with pay, location, and requirements.",
      },
    ],
  }),
  component: PostJobPage,
});

const jobTypes = ["Full-time", "Part-time", "Internship", "Contract", "Fresher"];

function PostJobPage() {
  const { resolvedTheme } = useTheme();
  const navigate = useNavigate();
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["Full-time"]);
  const [roleId, setRoleId] = useState("");
  const [customRole, setCustomRole] = useState("");
  const [roles, setRoles] = useState<CatalogItem[]>([]);
  const [catalogSkills, setCatalogSkills] = useState<CatalogItem[]>([]);
  const [selectedSkillIds, setSelectedSkillIds] = useState<number[]>([]);
  const [customSkills, setCustomSkills] = useState<string[]>([]);
  const [customSkillInput, setCustomSkillInput] = useState("");
  const [showCustomSkillInput, setShowCustomSkillInput] = useState(false);
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getCatalog().then(({ roles, skills }) => {
      setRoles(roles);
      setCatalogSkills(skills);
      if (roles.length > 0) {
        setRoleId(String(roles[0].id));
      }
    });
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const form = new FormData(e.currentTarget as HTMLFormElement);
    if (!roleId && !customRole.trim()) {
      toast.error("Please select or enter a role category.");
      return;
    }
    const title = String(form.get("title") || "").trim();
    if (!title) {
      toast.error("Job title is required.");
      return;
    }
    const locationStr = String(form.get("location") || "").trim();

    setSubmitting(true);
    try {
      await createJobPosting({
        roleId: roleId === "custom" ? null : Number(roleId),
        createRoleName: roleId === "custom" ? customRole.trim() : null,
        title,
        description: description || title,
        salaryLower: Number(form.get("minimum") || 0),
        salaryHigher: Number(form.get("maximum") || 0),
        minimumExperienceInMonths: Number(form.get("expMonths") || 0),
        status: "OPEN",
        postedAt: new Date().toISOString(),
        expiresAt: null,
        existingSkills: selectedSkillIds.map((id) => ({ id, proficiency: "INTERMEDIATE", required: true })),
        createSkills: customSkills.map(name => ({ name, proficiency: "INTERMEDIATE", required: true })),
        location: { country: "India", state: locationStr, city: locationStr },
        workMode: locationStr.toLowerCase().includes("remote") ? "REMOTE" : "ONSITE",
        workingHoursPerDay: 8,
        type:
          selectedTypes[0] === "Internship"
            ? "INTERN"
            : selectedTypes[0] === "Part-time"
              ? "PART_TIME"
              : "FULL_TIME",
      });
      toast.success("Job posting created!");
      navigate({ to: "/company" });
    } catch (error) {
      toast.error(formatErrorMessage(error, "Unable to publish job"));
    } finally {
      setSubmitting(false);
    }
  }

  function toggleSkill(id: number) {
    setSelectedSkillIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  }

  return (
    <div className="mx-auto max-w-[720px] px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">Post a job</h1>
      <p className="mt-2 text-[15px] text-muted-foreground">
        Candidates see this exactly as you write it.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        <Section title="Basics">
          <Field name="title" label="Job title" placeholder="e.g. Python Developer Intern" />
          <Field name="location" label="Location" placeholder="City, State or Remote" />
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">Role category</span>
            <select
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
              className="w-full rounded-lg border border-input bg-card px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
            >
              <option value="" disabled>Select a role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
              <option value="custom">Other</option>
            </select>
          </label>
          {roleId === "custom" && (
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-foreground">Custom Role Name</span>
              <input
                type="text"
                placeholder="e.g. Prompt Engineer"
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
                className="w-full rounded-lg border border-input bg-card px-4 py-2.5 text-[15px] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </label>
          )}
        </Section>

        <Section title="Pay & Experience">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="minimum" label="Minimum pay (₹ / yr)" placeholder="e.g. 300000" />
            <Field name="maximum" label="Maximum pay (₹ / yr)" placeholder="e.g. 600000" />
          </div>
          <Field name="expMonths" label="Minimum Experience (months)" placeholder="e.g. 12" />
        </Section>

        <Section title="Job type">
          <div className="flex flex-wrap gap-2">
            {jobTypes.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() =>
                  setSelectedTypes((prev) =>
                    prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
                  )
                }
                className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                  selectedTypes.includes(t)
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-input text-foreground hover:bg-accent"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </Section>

        <Section title="Skill Requirements">
          <p className="text-xs text-muted-foreground mb-3">Select skills required for this job:</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {catalogSkills.map((s) => {
              const active = selectedSkillIds.includes(s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggleSkill(s.id)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-foreground hover:bg-accent"
                  }`}
                >
                  {s.name}
                </button>
              );
            })}
            {customSkills.map((s, idx) => (
              <button
                key={`custom-${idx}`}
                type="button"
                onClick={() => setCustomSkills(prev => prev.filter(x => x !== s))}
                className="rounded-full border border-primary bg-primary text-primary-foreground px-3 py-1 text-xs font-medium"
              >
                {s} ×
              </button>
            ))}
            <button
              type="button"
              onClick={() => setShowCustomSkillInput(true)}
              className="rounded-full border border-dashed border-input bg-card text-muted-foreground px-3 py-1 text-xs font-medium hover:text-foreground hover:border-border transition-colors"
            >
              + Other
            </button>
          </div>
          {showCustomSkillInput && (
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Custom skill name..."
                value={customSkillInput}
                onChange={(e) => setCustomSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (customSkillInput.trim() && !customSkills.includes(customSkillInput.trim())) {
                      setCustomSkills([...customSkills, customSkillInput.trim()]);
                      setCustomSkillInput("");
                      setShowCustomSkillInput(false);
                    }
                  }
                }}
                className="flex-1 rounded-lg border border-input bg-card px-4 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  if (customSkillInput.trim() && !customSkills.includes(customSkillInput.trim())) {
                    setCustomSkills([...customSkills, customSkillInput.trim()]);
                    setCustomSkillInput("");
                    setShowCustomSkillInput(false);
                  } else if (!customSkillInput.trim()) {
                    setShowCustomSkillInput(false);
                  }
                }}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
              >
                Add
              </button>
            </div>
          )}
        </Section>

        <Section title="Description">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">
              Full job description
            </span>
            <div data-color-mode={resolvedTheme} className="rounded-lg border border-input overflow-hidden">
              <MDEditor
                value={description}
                onChange={(val) => setDescription(val || "")}
                preview="edit"
                height={300}
                className="w-full text-[15px]"
              />
            </div>
          </label>
        </Section>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-primary py-3.5 text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-50"
        >
          {submitting ? "Publishing…" : "Publish job posting"}
        </button>
      </form>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4 rounded-xl border border-border bg-card p-6">
      <h2 className="font-display text-lg font-bold text-foreground">{title}</h2>
      {children}
    </section>
  );
}

function Field({ name, label, placeholder }: { name: string; label: string; placeholder: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      <input
        name={name}
        placeholder={placeholder}
        className="w-full rounded-lg border border-input bg-card px-4 py-2.5 text-[15px] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
      />
    </label>
  );
}
