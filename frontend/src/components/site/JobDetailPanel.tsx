import { Link } from "@tanstack/react-router";
import { Briefcase, ChevronDown, Copy, Wallet } from "lucide-react";
import { toast } from "sonner";
import MDEditor from "@uiw/react-md-editor";
import { useTheme } from "@/lib/theme";
import type { Job } from "@/types";

export function JobDetailPanel({ job, hasApplied, highlights }: { job: Job; hasApplied?: boolean; highlights?: { salary?: boolean; remote?: boolean; types?: string[]; skills?: string[] } }) {
  const { resolvedTheme } = useTheme();
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="p-7">
        <h2 className="font-display text-3xl font-bold text-foreground">{job.title}</h2>
        <p className="mt-3 text-[17px] text-muted-foreground">{job.company}</p>
        <p className="text-[17px] text-muted-foreground">{job.location}</p>
        <p className="text-[17px] text-muted-foreground">{job.payLabel} · Posted {job.postedAt}</p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {hasApplied ? (
            <div className="rounded-lg bg-secondary px-6 py-3 text-[15px] font-semibold text-secondary-foreground">
              Applied
            </div>
          ) : (
            <Link
              to="/apply/$jobId"
              params={{ jobId: job.id }}
              className="rounded-lg bg-primary px-6 py-3 text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              Apply with Hirely
            </Link>
          )}
          <RoundButton 
            label="Copy link"
            onClick={() => {
              const url = `${window.location.origin}/jobs?jobId=${job.id}`;
              if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(url)
                  .then(() => toast.success("Link copied to clipboard!"))
                  .catch(() => toast.error("Failed to copy link"));
              } else {
                try {
                  const textArea = document.createElement("textarea");
                  textArea.value = url;
                  textArea.style.position = "fixed";
                  textArea.style.left = "-9999px";
                  document.body.appendChild(textArea);
                  textArea.focus();
                  textArea.select();
                  document.execCommand("copy");
                  document.body.removeChild(textArea);
                  toast.success("Link copied to clipboard!");
                } catch (err) {
                  toast.error("Failed to copy link");
                }
              }
            }}
          >
            <Copy className="size-5" />
          </RoundButton>
        </div>
      </div>

      <div className="border-t border-border p-7">
        <h3 className="font-display text-2xl font-bold text-foreground">Job details</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Here's how the job details align with your{" "}
          <Link to="/profile" className="text-primary underline underline-offset-2">
            profile
          </Link>
          .
        </p>

        <div className="mt-6 flex items-start gap-3">
          <Wallet className="mt-1 size-5 text-foreground/70" />
          <div>
            <p className="font-semibold text-foreground">Pay</p>
            <span className={`mt-2 inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium ${highlights?.salary ? "bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400" : "bg-secondary text-secondary-foreground"}`}>
              {job.payLabel}
            </span>
          </div>
        </div>

        <div className="mt-6 flex items-start gap-3">
          <Briefcase className="mt-1 size-5 text-foreground/70" />
          <div>
            <p className="font-semibold text-foreground">Job type</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {job.jobTypes.map((t) => (
                <span
                  key={t}
                  className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium ${highlights?.types?.includes(t.toLowerCase()) ? "bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400" : "bg-secondary text-secondary-foreground"}`}
                >
                  {t}
                  <ChevronDown className="size-4 opacity-60" />
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border p-7">
        <h3 className="font-display text-2xl font-bold text-foreground">Benefits</h3>
        <p className="mt-1 text-sm text-muted-foreground">Pulled from the full job description</p>
        <ul className="mt-4 space-y-2">
          {job.benefits.map((b) => (
            <li key={b} className="text-[15px] text-foreground">
              {b}
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-border p-7">
        <h3 className="font-display text-2xl font-bold text-foreground">Requirements</h3>
        {job.experience && (
          <div className="mt-4">
            <p className="font-semibold text-foreground text-[15px]">Minimum Experience</p>
            <p className="mt-1 text-[15px] text-muted-foreground">{job.experience}</p>
          </div>
        )}
        
        {job.skills && job.skills.length > 0 && (
          <div className="mt-4">
            <p className="font-semibold text-foreground text-[15px]">Skills</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {job.skills.map(s => (
                <span key={s.name} className={`inline-flex items-center rounded-md px-2.5 py-1 text-sm font-medium ${highlights?.skills?.includes(s.name.toLowerCase()) ? "bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400" : "bg-secondary text-secondary-foreground"}`}>
                  {s.name} {s.required ? "(Required)" : "(Preferred)"}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-border p-7">
        <h3 className="font-display text-2xl font-bold text-foreground">Full job description</h3>
        <div data-color-mode={resolvedTheme} className="mt-4 text-[15px] leading-relaxed text-foreground">
          <MDEditor.Markdown source={job.description} style={{ backgroundColor: 'transparent', color: 'inherit' }} />
        </div>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-[15px] text-foreground">
          {job.responsibilities.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function RoundButton({ label, onClick, children }: { label: string; onClick?: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="inline-flex size-12 items-center justify-center rounded-lg bg-secondary text-secondary-foreground transition-colors hover:bg-accent"
    >
      {children}
    </button>
  );
}
