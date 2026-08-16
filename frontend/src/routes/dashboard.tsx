import { createFileRoute, Navigate, redirect, Link, useNavigate } from "@tanstack/react-router";
import { Wallet, Briefcase, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRole } from "@/lib/role";
import { useEffect, useState } from "react";
import { JobCard } from "@/components/site/JobCard";
import { JobDetailPanel } from "@/components/site/JobDetailPanel";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  getCurrentCandidate,
  getMyApplications,
  listJobs,
  getJob,
  getCatalog,
  deleteJobApplication,
  type Candidate,
  type UserApplication,
  type CatalogItem,
} from "@/lib/api";
import type { Job, Company } from "@/types";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: () => { if (typeof window === "undefined") return;
    const token = localStorage.getItem("hirely-token");
    const role = localStorage.getItem("hirely-role");
    if (!token || role !== "candidate") {
      throw redirect({ to: "/signin" });
    }
  },
  head: () => ({
    meta: [
      { title: "Jobs for you — Hirely" },
      { name: "description", content: "Your personalised job feed and application activity." },
      { property: "og:title", content: "Jobs for you — Hirely" },
      { property: "og:description", content: "Your personalised job feed and application activity." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { role } = useRole();
  const dashNavigate = useNavigate();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [applications, setApplications] = useState<UserApplication[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [fullJob, setFullJob] = useState<Job | null>(null);
  const [catalog, setCatalog] = useState<{ roles: CatalogItem[]; skills: CatalogItem[]; companies: Company[] }>({ roles: [], skills: [], companies: [] });

  useEffect(() => {
    if (selectedId) {
      getJob(selectedId).then(setFullJob).catch(() => setFullJob(null));
    } else {
      setFullJob(null);
    }
  }, [selectedId]);


  useEffect(() => {
    Promise.all([
      getCurrentCandidate().catch(() => null),
      getMyApplications().catch(() => []),
      listJobs().catch(() => []),
      getCatalog().catch(() => ({ roles: [], skills: [], companies: [], industries: [] })),
    ]).then(([cand, apps, jbs, cat]) => {
      setCandidate(cand);
      setApplications(apps);
      
      const appliedIds = new Set(apps.map((a) => String(a.jobId)));
      const unappliedJbs = jbs.filter((j) => !appliedIds.has(j.id));
      
      setJobs(unappliedJbs);
      setCatalog(cat as { roles: CatalogItem[]; skills: CatalogItem[]; companies: Company[] });
      if (unappliedJbs.length > 0) setSelectedId(unappliedJbs[0].id);
      else setSelectedId(null);
      setLoading(false);
    });
  }, []);

  if (role !== "candidate") {
    return <Navigate to="/signin" />;
  }

  const selected = jobs.find((j) => j.id === selectedId) ?? jobs[0];

  async function handleDeleteApplication(appId: number) {
    try {
      await deleteJobApplication(appId);
      setApplications(prev => prev.filter(app => app.id !== appId));
      toast.success("Application removed.");
    } catch (e: any) {
      toast.error(e.message || "Failed to remove application.");
    }
  }

  return (
    <div>

      <div className="mx-auto max-w-[1400px] px-4 pt-10 sm:px-6">
        <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
          Welcome, {candidate ? candidate.firstName : "Candidate"}
        </h1>
        <div className="mt-4 flex flex-wrap gap-3">
          <span className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground">
            <Briefcase className="size-4 text-primary" />
            {applications.length} Applied Jobs
          </span>
        </div>
      </div>

      {applications.length > 0 && (
        <div className="mx-auto max-w-[1400px] px-4 pt-8 sm:px-6">
          <h2 className="font-display text-xl font-bold text-foreground">My Applications</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {applications.map((app) => (
              <div key={app.id} className="rounded-xl border border-border bg-card p-4">
                <Link to={`/applications/${app.id}`} className="font-semibold text-foreground hover:text-primary hover:underline block">{app.jobTitle}</Link>
                <p className="text-sm text-muted-foreground">{app.companyName}</p>
                <div className="mt-2 flex items-center justify-between">
                  <div>
                    <span className="rounded bg-secondary px-2 py-0.5 text-xs font-semibold capitalize text-secondary-foreground">
                      {app.status.toLowerCase()}
                    </span>
                    <span className="text-xs text-muted-foreground ml-3">{app.appliedAt}</span>
                  </div>
                  {app.status === "REJECTED" && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          className="text-muted-foreground hover:text-destructive transition-colors"
                          title="Delete application"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete your job application and remove it from your dashboard.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteApplication(app.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mx-auto grid max-w-[1400px] gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <section>
          <h2 className="font-display text-2xl font-bold text-foreground">Jobs for you</h2>
          {loading ? (
            <p className="mt-5 text-sm text-muted-foreground">Loading recommended jobs…</p>
          ) : jobs.length === 0 ? (
            <p className="mt-5 text-sm text-muted-foreground">No jobs posted yet.</p>
          ) : (
            <div className="mt-5 space-y-4">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  selected={selected?.id === job.id}
                  onSelect={(j) => {
                    setSelectedId(j.id);
                    // On mobile (no detail panel visible), navigate to job page
                    if (window.innerWidth < 1024) {
                      dashNavigate({ to: '/jobs', search: { jobId: Number(j.id) } as any });
                    }
                  }}
                />
              ))}
            </div>
          )}
        </section>

        <section className="hidden lg:block">
          <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
            {fullJob ? (
              <JobDetailPanel 
                job={fullJob} 
                hasApplied={applications.some(a => String(a.jobId) === String(fullJob.id))}
              />
            ) : (
              <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
                Select a job to view details.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
