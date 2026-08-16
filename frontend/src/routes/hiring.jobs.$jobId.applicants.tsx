import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { formatErrorMessage, getJob, getJobApplicants, updateApplicationStatus, downloadApplicationResumeBlob, type JobApplicant } from "@/lib/api";

export const Route = createFileRoute("/hiring/jobs/$jobId/applicants")({
  loader: async ({ params }) => {
    try {
      const job = await getJob(params.jobId);
      return { job };
    } catch {
      throw notFound();
    }
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Role not found — Hirely" }, { name: "robots", content: "noindex" }] };
    }
    const title = `Applicants: ${loaderData.job.title} — Hirely`;
    const description = `Review and move applicants for ${loaderData.job.title} at ${loaderData.job.company}.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: ApplicantsPage,
});

const stageOptions: ("APPLIED" | "SCREENING" | "INTERVIEW" | "OFFER" | "REJECTED")[] = [
  "APPLIED",
  "SCREENING",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
];

function ApplicantsPage() {
  const { job } = Route.useLoaderData();
  const [list, setList] = useState<JobApplicant[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [resumeBlobUrl, setResumeBlobUrl] = useState<string | null>(null);
  const [loadingResume, setLoadingResume] = useState(false);

  useEffect(() => {
    if (resumeBlobUrl) {
      URL.revokeObjectURL(resumeBlobUrl);
      setResumeBlobUrl(null);
    }
  }, [selectedId]);

  useEffect(() => {
    getJobApplicants(job.id)
      .then((apps) => {
        setList(apps);
        if (apps.length > 0) setSelectedId(apps[0].applicationId);
      })
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  }, [job.id]);

  const selected = list.find((a) => a.applicationId === selectedId) ?? list[0];

  async function handleSetStage(applicationId: number, status: "APPLIED" | "SCREENING" | "INTERVIEW" | "OFFER" | "REJECTED") {
    try {
      await updateApplicationStatus(applicationId, status);
      setList((prev) => prev.map((a) => (a.applicationId === applicationId ? { ...a, status } : a)));
      toast.success(`Application status updated to ${status.toLowerCase()}`);
    } catch (err) {
      toast.error(formatErrorMessage(err, "Failed to update application status"));
    }
  }

  async function handleViewResume(applicationId: number) {
    try {
      setLoadingResume(true);
      const blob = await downloadApplicationResumeBlob(applicationId);
      const url = URL.createObjectURL(blob);
      setResumeBlobUrl(url);
    } catch (err) {
      toast.error(formatErrorMessage(err, "Failed to load resume"));
    } finally {
      setLoadingResume(false);
    }
  }

  if (loading) {
    return <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 text-muted-foreground">Loading applicants…</div>;
  }

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6">
      <Link to="/hiring" className="text-sm text-primary hover:underline">
        ← Hiring dashboard
      </Link>
      <h1 className="mt-4 font-display text-3xl font-bold text-foreground">{job.title}</h1>
      <p className="mt-1 text-[15px] text-muted-foreground">
        {job.company} · {list.length} applicants
      </p>

      {list.length === 0 ? (
        <div className="mt-8 rounded-xl border border-border bg-card p-10 text-center text-muted-foreground">
          No applicants for this role yet.
        </div>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <div className="space-y-3">
            {list.map((a) => {
              const fullName = `${a.firstName || ""} ${a.lastName || ""}`.trim() || "Candidate";
              const initials = `${a.firstName?.[0] || ""}${a.lastName?.[0] || ""}` || "C";
              return (
                <button
                  key={a.applicationId}
                  type="button"
                  onClick={() => setSelectedId(a.applicationId)}
                  className={`flex w-full items-center gap-4 rounded-xl border bg-card p-5 text-left transition-shadow hover:shadow-md ${
                    selected?.applicationId === a.applicationId ? "border-primary ring-1 ring-primary" : "border-border"
                  }`}
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-secondary font-semibold text-secondary-foreground">
                    {initials}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-foreground">{fullName}</span>
                    <span className="block text-sm text-muted-foreground">{a.email}</span>
                  </span>
                  <span className="shrink-0 rounded-md bg-secondary px-2.5 py-1 text-xs font-medium capitalize text-secondary-foreground">
                    {a.status.toLowerCase()}
                  </span>
                </button>
              );
            })}
          </div>

          {selected && (
            <div className="rounded-xl border border-border bg-card p-6 lg:sticky lg:top-24 lg:self-start">
              <h2 className="font-display text-2xl font-bold text-foreground">
                {`${selected.firstName || ""} ${selected.lastName || ""}`.trim() || "Candidate"}
              </h2>
              <p className="mt-1 text-[15px] text-muted-foreground">
                {selected.email} · {selected.location?.city ? `${selected.location.city}, ${selected.location.country || ""}` : selected.location?.country || "India"}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Applied {selected.appliedAt}
              </p>

              {selected.description && (
                <div className="mt-5">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">About:</p>
                  <p className="text-sm text-foreground whitespace-pre-wrap">{selected.description}</p>
                </div>
              )}

              {selected.skills && selected.skills.length > 0 && (
                <div className="mt-5">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Candidate Skills:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.skills.map((s, i) => (
                      <span key={i} className="rounded-md bg-secondary px-2.5 py-1 text-xs text-secondary-foreground font-medium">
                        {s.name} <span className="opacity-70">({s.proficiency.toLowerCase()})</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selected.experiences && selected.experiences.length > 0 && (
                <div className="mt-5">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Experience:</p>
                  <div className="space-y-3">
                    {selected.experiences.map((exp, i) => (
                      <div key={i} className="rounded-lg border border-border p-3">
                        <p className="font-semibold text-sm text-foreground">{exp.roleName}</p>
                        <p className="text-xs text-muted-foreground">{exp.organizationName || exp.companyName}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {new Date(exp.fromDate).toLocaleDateString()} - {exp.toDate ? new Date(exp.toDate).toLocaleDateString() : "Present"}
                        </p>
                        {exp.description && <p className="mt-2 text-xs text-muted-foreground whitespace-pre-wrap">{exp.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selected.coverLetter && (
                <div className="mt-5">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Cover Letter:</p>
                  <div className="rounded-lg bg-secondary/40 p-3 text-xs text-muted-foreground max-h-48 overflow-y-auto whitespace-pre-wrap">
                    {selected.coverLetter}
                  </div>
                </div>
              )}

              {selected.resumeId && (
                <div className="mt-5">
                  {!resumeBlobUrl ? (
                    <button
                      onClick={() => handleViewResume(selected.applicationId)}
                      disabled={loadingResume}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/20 transition-colors disabled:opacity-50"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                      {loadingResume ? "Loading..." : selected.resumeName ? `View Resume (${selected.resumeName})` : "View Resume"}
                    </button>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-center">
                        <p className="text-xs font-semibold text-muted-foreground">Resume Preview:</p>
                        <a
                          href={resumeBlobUrl}
                          download={selected.resumeName || "resume.pdf"}
                          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                          Download PDF
                        </a>
                      </div>
                      <iframe 
                        src={resumeBlobUrl} 
                        className="w-full rounded-lg border bg-card" 
                        style={{ height: '500px' }}
                        title="Resume Preview"
                      />
                    </div>
                  )}
                </div>
              )}

              <p className="mt-8 text-sm font-semibold text-foreground">Move to stage</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {stageOptions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleSetStage(selected.applicationId, s)}
                    className={`rounded-lg border px-4 py-2 text-xs font-medium capitalize transition-colors ${
                      selected.status === s
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input text-foreground hover:bg-accent"
                    }`}
                  >
                    {s.toLowerCase()}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
