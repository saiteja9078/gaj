import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getApplicationDetails, type DetailedApplication } from "@/lib/api";
import { ChevronLeft, Building2, MapPin, Briefcase, IndianRupee, Clock, Users } from "lucide-react";
import { toast } from "sonner";
import MDEditor from "@uiw/react-md-editor";
import { useTheme } from "@/lib/theme";

export const Route = createFileRoute("/applications/$applicationId")({
  beforeLoad: () => { if (typeof window === "undefined") return;
    const token = localStorage.getItem("hirely-token");
    const role = localStorage.getItem("hirely-role");
    if (!token || role !== "candidate") {
      throw redirect({ to: "/signin" });
    }
  },
  component: ApplicationDetailRoute,
});

function ApplicationDetailRoute() {
  const { applicationId } = Route.useParams();
  const [app, setApp] = useState<DetailedApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getApplicationDetails(Number(applicationId));
        setApp(data);
      } catch (err: any) {
        toast.error("Failed to load application details.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [applicationId]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading application...</p>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Application not found.</p>
      </div>
    );
  }

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return "Not specified";
    if (min && !max) return `₹${min.toLocaleString()}+`;
    if (!min && max) return `Up to ₹${max.toLocaleString()}`;
    return `₹${min!.toLocaleString()} - ₹${max!.toLocaleString()}`;
  };

  const steps = ["APPLIED", "SCREENING", "INTERVIEW", "OFFER"];
  const currentStepIndex = steps.indexOf(app.status.toUpperCase());
  const isRejected = app.status.toUpperCase() === "REJECTED";

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="size-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
          
          {/* Left Column: Application Details */}
          <section className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h2 className="font-display text-lg font-bold text-foreground mb-4">Application Status</h2>
              
              {isRejected ? (
                <div className="rounded-lg bg-destructive/10 p-4 border border-destructive/20 text-center">
                  <p className="font-semibold text-destructive">Rejected</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Unfortunately, the company has decided to move forward with other candidates.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {steps.map((step, index) => {
                    const isActive = index === currentStepIndex;
                    const isPast = index < currentStepIndex;
                    return (
                      <div key={step} className="flex items-center gap-4">
                        <div className={`flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold
                          ${isActive ? 'border-primary bg-primary text-primary-foreground' : 
                            isPast ? 'border-primary bg-primary/20 text-primary' : 'border-border text-muted-foreground'}`}
                        >
                          {index + 1}
                        </div>
                        <div>
                          <p className={`font-semibold capitalize ${isActive || isPast ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {step.toLowerCase()}
                          </p>
                          {isActive && <p className="text-xs text-muted-foreground mt-0.5">Current Phase</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground mb-1">Applied on</p>
                <p className="font-semibold text-foreground">{new Date(app.appliedAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Applicants</p>
                <div className="flex items-center gap-2">
                  <Users className="size-5 text-primary" />
                  <span className="text-2xl font-bold text-foreground">{app.totalApplicants}</span>
                </div>
              </div>
              {app.totalApplicants > 10 && (
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
                  High Demand
                </span>
              )}
            </div>

            {app.coverLetter && (
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <h3 className="font-display font-semibold text-foreground mb-3">Cover Letter Submitted</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{app.coverLetter}</p>
              </div>
            )}
          </section>

          {/* Right Column: Job Details */}
          <section className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
              <h1 className="font-display text-3xl font-bold text-foreground">{app.jobTitle}</h1>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Building2 className="size-4" />
                  <Link to={`/companies/${app.companyId}`} className="hover:text-primary hover:underline">
                    {app.companyName}
                  </Link>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="size-4" />
                  {app.jobLocation ? `${app.jobLocation.city}, ${app.jobLocation.country}` : "Remote"}
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg bg-secondary/50 p-4">
                  <Briefcase className="size-5 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Work Mode</p>
                  <p className="font-semibold text-foreground capitalize">{app.jobWorkMode?.toLowerCase().replace("_", " ") || "Not specified"}</p>
                </div>
                <div className="rounded-lg bg-secondary/50 p-4 sm:col-span-2">
                  <IndianRupee className="size-5 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Salary Range</p>
                  <p className="font-semibold text-foreground">{formatSalary(app.jobSalaryLower, app.jobSalaryHigher)}</p>
                </div>
              </div>

              <div className="mt-8 border-t border-border pt-8">
                <h3 className="font-display text-lg font-bold text-foreground mb-4">Job Description</h3>
                <div data-color-mode={resolvedTheme} className="text-[15px] leading-relaxed text-foreground">
                  <MDEditor.Markdown source={app.jobDescription} style={{ backgroundColor: 'transparent', color: 'inherit' }} />
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
