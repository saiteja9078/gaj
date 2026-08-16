import { Bookmark, Check, ThumbsDown } from "lucide-react";
import type { Job } from "@/types";

interface JobCardProps {
  job: Job;
  selected?: boolean;
  onSelect?: (job: Job) => void;
  highlights?: { salary?: boolean; remote?: boolean; types?: string[]; skills?: string[] };
}

export function JobCard({ job, selected = false, onSelect, highlights }: JobCardProps) {
  return (
    <article
      onClick={() => onSelect?.(job)}
      className={`relative cursor-pointer rounded-xl border bg-card p-5 transition-shadow hover:shadow-md ${
        selected ? "border-primary ring-1 ring-primary" : "border-border"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          {job.easyApply && (
            <span className="inline-block rounded-md bg-info-muted px-2 py-1 text-xs font-semibold text-info-muted-foreground">
              Easily apply
            </span>
          )}
          <h3 className="mt-3 font-display text-xl font-semibold text-foreground">{job.title}</h3>
          <p className="mt-2 text-[15px] text-muted-foreground">{job.company}</p>
          <p className="text-[15px] text-muted-foreground">{job.location} · {job.postedAt}</p>
        </div>
        <div className="flex shrink-0 flex-col gap-3">
          <IconButton label="Save job">
            <Bookmark className="size-5" />
          </IconButton>
          <IconButton label="Not interested">
            <ThumbsDown className="size-5" />
          </IconButton>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium ${highlights?.salary ? "bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400" : "bg-secondary text-secondary-foreground"}`}>
          {job.payLabel}
        </span>
        {job.jobTypes.slice(0, 1).map((t) => (
          <Chip key={t} active={highlights?.types?.includes(t.toLowerCase())}>{t}</Chip>
        ))}
        {job.jobTypes.length > 1 && <Chip>+{job.jobTypes.length - 1}</Chip>}
        {job.tags.map((t) => (
          <Chip key={t} active={highlights?.remote && t === "Work from home"}>{t}</Chip>
        ))}
      </div>
    </article>
  );
}

function Chip({ children, active }: { children: React.ReactNode, active?: boolean }) {
  return (
    <span className={`rounded-md px-3 py-1.5 text-sm font-medium ${active ? "bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400" : "bg-secondary text-secondary-foreground"}`}>
      {children}
    </span>
  );
}

function IconButton({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={(e) => e.stopPropagation()}
      className="inline-flex size-8 items-center justify-center rounded-full text-foreground/70 transition-colors hover:bg-accent hover:text-foreground"
    >
      {children}
    </button>
  );
}
