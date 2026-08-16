import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { CheckCircle2, Flag } from "lucide-react";
import { useEffect, useState } from "react";
import {
  applyToJob,
  currentUserId,
  formatErrorMessage,
  getCurrentCandidate,
  getJob,
  getResumes,
  type Candidate,
  type Resume,
} from "@/lib/api";

export const Route = createFileRoute("/apply/$jobId")({
  beforeLoad: () => { if (typeof window === "undefined") return;
    const token = localStorage.getItem("hirely-token");
    const role = localStorage.getItem("hirely-role");
    if (!token || role !== "candidate") {
      throw redirect({ to: "/signin" });
    }
  },
  loader: async ({ params }) => {
    try {
      return { job: await getJob(params.jobId) };
    } catch {
      throw notFound();
    }
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Application unavailable — Hirely" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const title = `Apply: ${loaderData.job.title} — Hirely`;
    const description = `Review and submit your application for ${loaderData.job.title} at ${loaderData.job.company}.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: ApplyPage,
});

function ApplyPage() {
  const { job } = Route.useLoaderData();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [stage, setStage] = useState<"review" | "submitted">("review");
  const [alerts, setAlerts] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getCurrentCandidate()
      .then((c) => {
        setCandidate(c);
        getResumes().then((rs) => {
          setResumes(rs);
          if (rs.length > 0) {
            setSelectedResumeId(rs[0].id);
          }
        }).catch(() => []);
      })
      .catch(() => setCandidate(null));
  }, []);

  async function submit() {
    const candidateId = currentUserId();
    if (!candidateId) {
      setError("Please sign in as a candidate before applying.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await applyToJob(job.id, candidateId, coverLetter, selectedResumeId || undefined, alerts);
      setStage("submitted");
    } catch (e) {
      setError(formatErrorMessage(e, "Unable to submit application"));
    } finally {
      setSubmitting(false);
    }
  }

  const name = candidate ? `${candidate.firstName} ${candidate.lastName}` : "Candidate";
  const location = candidate?.location
    ? [candidate.location.city, candidate.location.state, candidate.location.country].filter(Boolean).join(", ")
    : "India";

  return (
    <div className="mx-auto max-w-[640px] px-4 py-10 sm:px-6">
      <div className="rounded-xl border border-border bg-card p-6">
        <h1 className="font-display text-xl font-bold text-foreground">{job.title}</h1>
        <p className="mt-1 text-[15px] text-muted-foreground">
          {job.company} - {job.location}
        </p>
      </div>

      <div className="mt-6 rounded-xl border border-border bg-card p-6">
        {stage === "submitted" ? (
          <div className="py-10 text-center">
            <CheckCircle2 className="mx-auto size-14 text-success" />
            <h2 className="mt-6 font-display text-2xl font-bold text-foreground">
              Application submitted
            </h2>
            <p className="mt-3 text-[15px] text-muted-foreground">
              Your application was sent to {job.company}. You can track it from your dashboard.
            </p>
            <Link
              to="/dashboard"
              className="mt-8 inline-flex rounded-lg bg-primary px-8 py-3 text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              Back to jobs
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-8">
                <section>
                  <h2 className="font-display text-lg font-bold text-foreground">
                    Contact information
                  </h2>
                  <div className="mt-3 rounded-lg border border-border p-4 text-[15px] text-foreground">
                    <p className="font-semibold">{name}</p>
                    <p className="text-muted-foreground">{candidate?.email || "No email"}</p>
                    <p className="text-muted-foreground">{location}</p>
                  </div>
                </section>

                <section>
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-lg font-bold text-foreground">Resume</h2>
                    <Link to="/profile" className="font-semibold text-primary hover:underline text-sm">
                      Manage resumes
                    </Link>
                  </div>
                  <div className="mt-3 space-y-3">
                    {resumes.length > 0 ? (
                      resumes.map(r => (
                        <label key={r.id} className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${selectedResumeId === r.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
                          <div className="flex h-5 items-center">
                            <input 
                              type="radio" 
                              name="resume" 
                              checked={selectedResumeId === r.id} 
                              onChange={() => setSelectedResumeId(r.id)}
                              className="text-primary focus:ring-primary h-4 w-4"
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-[15px] text-foreground">{r.fileName}</p>
                            {r.extractedText && (
                              <p className="mt-1 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                                {r.extractedText}
                              </p>
                            )}
                          </div>
                        </label>
                      ))
                    ) : (
                      <div className="rounded-lg border border-border p-4 text-[15px] text-foreground">
                        <p className="text-sm text-muted-foreground">
                          No resume uploaded. You can upload one under Profile.
                        </p>
                      </div>
                    )}
                  </div>
                </section>

                <section>
                  <h2 className="font-display text-lg font-bold text-foreground mb-2">
                    Cover Note (Optional)
                  </h2>
                  <textarea
                    rows={4}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Introduce yourself or highlight relevant experience for this role…"
                    className="w-full rounded-lg border border-input bg-card px-4 py-3 text-[15px] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                  />
                </section>

                <section className="flex items-start justify-between gap-6">
                  <div>
                    <h2 className="font-display text-lg font-bold text-foreground">
                      Get email updates for jobs matching this role
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Receive alerts when new jobs are posted that match this role.
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={alerts}
                    aria-label="Get email updates"
                    onClick={() => setAlerts((v) => !v)}
                    className={`mt-1 inline-flex h-7 w-12 shrink-0 items-center rounded-full border border-border p-0.5 transition-colors ${
                      alerts ? "bg-primary" : "bg-secondary"
                    }`}
                  >
                    <span
                      className={`size-6 rounded-full bg-white shadow transition-transform ${
                        alerts ? "translate-x-5" : ""
                      }`}
                    />
                  </button>
                </section>

                {error && <p className="text-sm text-destructive">{error}</p>}
                <button
                  type="button"
                  onClick={submit}
                  disabled={submitting}
                  className="w-full rounded-lg bg-primary py-4 text-[16px] font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-50"
                >
                  {submitting ? "Submitting…" : "Submit your application"}
                </button>

                <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Flag className="size-4" /> <span className="underline">Report an issue</span>
                </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ResumeIllustration() {
  return (
    <svg width="180" height="140" viewBox="0 0 180 140" fill="none" className="mx-auto" aria-hidden>
      <circle cx="90" cy="70" r="55" className="fill-secondary" />
      <rect x="52" y="30" width="66" height="84" rx="4" className="fill-background stroke-border" />
      <rect x="64" y="60" width="42" height="5" rx="2.5" className="fill-primary/40" />
      <rect x="64" y="72" width="42" height="5" rx="2.5" className="fill-primary/40" />
      <rect x="64" y="84" width="28" height="5" rx="2.5" className="fill-primary/40" />
      <circle cx="112" cy="52" r="12" className="fill-chart-3" />
    </svg>
  );
}
