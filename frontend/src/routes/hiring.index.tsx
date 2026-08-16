import { createFileRoute, Link, Navigate, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useRole } from "@/lib/role";
import {
  getCurrentHiringManager,
  getEmployerJobs,
  getJobApplicants,
  type JobApplicant,
} from "@/lib/api";
import type { Job } from "@/types";

export const Route = createFileRoute("/hiring/")({
  beforeLoad: () => { if (typeof window === "undefined") return;
    const token = localStorage.getItem("hirely-token");
    const role = localStorage.getItem("hirely-role");
    if (!token || (role !== "hiring" && role !== "company")) {
      throw redirect({ to: "/signin" });
    }
  },
  head: () => ({
    meta: [
      { title: "Hiring dashboard — Hirely" },
      { name: "description", content: "Track open roles, applicants by stage, and recent hiring activity." },
      { property: "og:title", content: "Hiring dashboard — Hirely" },
      { property: "og:description", content: "Track open roles, applicants by stage, and recent activity." },
    ],
  }),
  component: HiringDashboard,
});

const stages = [
  { id: "APPLIED", label: "Applied" },
  { id: "SCREENING", label: "Screening" },
  { id: "INTERVIEW", label: "Interview" },
  { id: "OFFER", label: "Offer" },
];

function HiringDashboard() {
  const { role } = useRole();
  const [manager, setManager] = useState<Awaited<ReturnType<typeof getCurrentHiringManager>> | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [allApplicants, setAllApplicants] = useState<{ jobId: string; applicants: JobApplicant[] }[]>([]);
  const [loading, setLoading] = useState(true);

  if (role !== "hiring") {
    return <Navigate to="/signin" />;
  }

  useEffect(() => {
    Promise.all([
      getCurrentHiringManager().catch(() => null),
      getEmployerJobs().catch(() => []),
    ]).then(async ([mgr, jbs]) => {
      setManager(mgr);
      setJobs(jbs);

      // Fetch applicants for each job
      const apps = await Promise.all(
        jbs.map(async (j) => {
          const list = await getJobApplicants(j.id).catch(() => []);
          return { jobId: j.id, applicants: list };
        }),
      );
      setAllApplicants(apps);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="mx-auto max-w-[1100px] px-4 py-12 text-muted-foreground">Loading hiring dashboard…</div>;
  }

  const flatApplicants = allApplicants.flatMap((a) => a.applicants);

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">Hiring dashboard</h1>
          <p className="mt-2 text-[15px] text-muted-foreground">
            {manager ? `Welcome back, ${manager.firstName}` : "Your pipeline across all open roles."}
          </p>
        </div>
        <Link
          to="/company/post-job"
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          Post a job
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-4">
        {stages.map((s) => (
          <div key={s.id} className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="mt-2 font-display text-3xl font-bold text-foreground">
              {flatApplicants.filter((a) => a.status === s.id).length}
            </p>
          </div>
        ))}
      </div>

      <h2 className="mt-12 font-display text-2xl font-bold text-foreground">My open roles ({jobs.length})</h2>
      <div className="mt-4 space-y-3">
        {jobs.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
            No open roles. Post a job to start receiving applicants.
          </div>
        ) : (
          jobs.map((job) => {
            const count = allApplicants.find((a) => a.jobId === job.id)?.applicants.length || 0;
            return (
              <Link
                key={job.id}
                to="/hiring/jobs/$jobId/applicants"
                params={{ jobId: job.id }}
                className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md"
              >
                <div>
                  <p className="font-display text-lg font-semibold text-foreground">{job.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {job.location} · {job.payLabel}
                  </p>
                </div>
                <span className="text-sm font-medium text-primary">{count} applicants →</span>
              </Link>
            );
          })
        )}
      </div>

      <h2 className="mt-12 font-display text-2xl font-bold text-foreground">Recent applicant activity</h2>
      <ul className="mt-4 space-y-3">
        {flatApplicants.length === 0 ? (
          <li className="text-sm text-muted-foreground">No recent applicant activity.</li>
        ) : (
          flatApplicants.slice(0, 5).map((a) => (
            <li key={a.applicationId} className="rounded-xl border border-border bg-card p-5 text-[15px] text-foreground">
              <span className="font-semibold">{a.candidateName}</span> applied for a role · stage:{" "}
              <span className="capitalize font-medium text-primary">{a.status.toLowerCase()}</span>
              <span className="text-muted-foreground"> · {a.appliedAt}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
