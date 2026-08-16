import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, useCallback } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { SearchBar } from "@/components/site/SearchBar";
import { JobCard } from "@/components/site/JobCard";
import { JobDetailPanel } from "@/components/site/JobDetailPanel";
import { getCatalog, listJobsPage, getMyApplications, getJob } from "@/lib/api";
import type { Job } from "@/types";

export const Route = createFileRoute("/jobs")({
  validateSearch: (search: Record<string, unknown>) => {
    const parseIds = (val: unknown) => {
      if (Array.isArray(val)) return val.map(Number);
      if (typeof val === 'string') return [Number(val)];
      if (typeof val === 'number') return [val];
      return [];
    };
    return {
      q: search.q as string | undefined,
      location: search.location as string | undefined,
      roleId: search.roleId ? Number(search.roleId) : undefined,
      companyIds: parseIds(search.companyIds).length > 0 ? parseIds(search.companyIds) : undefined,
      skillIds: parseIds(search.skillIds).length > 0 ? parseIds(search.skillIds) : undefined,
      jobId: search.jobId ? Number(search.jobId) : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Search jobs — Hirely" },
      {
        name: "description",
        content: "Browse open roles by pay, job type, and location on Hirely.",
      },
      { property: "og:title", content: "Search jobs — Hirely" },
      { property: "og:description", content: "Browse open roles by pay, job type, and location." },
    ],
  }),
  component: JobsPage,
});

const jobTypeFilters = [
  { label: "Full-time", value: "FULL_TIME" },
  { label: "Part-time", value: "PART_TIME" },
  { label: "Internship", value: "INTERN" }
];
const dateFilters = [
  { label: "Last 24 hours", days: 1 },
  { label: "Last 3 days", days: 3 },
  { label: "Last 7 days", days: 7 },
  { label: "Last 14 days", days: 14 }
];



function JobsPage() {
  const [showFilters, setShowFilters] = useState(false);
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState(search.q || "");
  const [locationStr, setLocationStr] = useState(search.location || "");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [types, setTypes] = useState<string[]>([]);
  const [datePostedDays, setDatePostedDays] = useState<number | null>(null);
  const [salaryGe, setSalaryGe] = useState<number | undefined>();
  const [salaryLe, setSalaryLe] = useState<number | undefined>();
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [skillIds, setSkillIds] = useState<number[]>(search.skillIds || []);
  const [roleId, setRoleId] = useState<number | undefined>(search.roleId);
  const [companyIds, setCompanyIds] = useState<number[]>(search.companyIds || []);
  const [catalog, setCatalog] = useState<{
    skills: { id: number; name: string }[];
    roles: { id: number; name: string }[];
    industries: { id: number; name: string }[];
    companies: { slug: string; name: string; backendId?: number }[];
  }>({ skills: [], roles: [], industries: [], companies: [] });
  const [applications, setApplications] = useState<any[]>([]);
  const [fullJob, setFullJob] = useState<Job | null>(null);

  useEffect(() => {
    const role = localStorage.getItem("hirely-role");
    if (role === "candidate") {
      getMyApplications().then(setApplications).catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (search.jobId) {
      getJob(String(search.jobId)).then(setFullJob).catch(() => setFullJob(null));
    } else {
      setFullJob(null);
    }
  }, [search.jobId]);

  useEffect(() => {
    setPage(0);
  }, [query, locationStr, skillIds, roleId, companyIds, remoteOnly, datePostedDays, types, salaryGe, salaryLe]);

  useEffect(() => {
    let postedAfter: string | undefined = undefined;
    if (datePostedDays) {
      const d = new Date();
      d.setDate(d.getDate() - datePostedDays);
      postedAfter = d.toISOString();
    }
    setLoading(true);
    listJobsPage(query, { location: locationStr || undefined, skillIds, roleId, companyIds, workMode: remoteOnly ? "REMOTE" : undefined, types: types.length > 0 ? types : undefined, postedAfter, salaryGe, salaryLe }, page, 20)
      .then((res) => {
        const newJobs = res.content;
        setJobs(newJobs);
        setTotalPages(res.totalPages);
        setTotalElements(res.totalElements);
        const initialJobId = search.jobId;
        if (!initialJobId && newJobs.length > 0) {
          navigate({ search: (prev) => ({ ...prev, jobId: Number(newJobs[0].id) }), replace: true });
        } else if (newJobs.length === 0 && initialJobId) {
          navigate({ search: (prev) => ({ ...prev, jobId: undefined }), replace: true });
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [query, locationStr, skillIds, roleId, companyIds, remoteOnly, datePostedDays, types, salaryGe, salaryLe, page]);
  useEffect(() => {
    getCatalog()
      .then(setCatalog)
      .catch(() => {});
  }, []);


  function toggleType(t: string) {
    setTypes((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  }

  return (
    <div>
      <div className="border-b border-border bg-surface">
        <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6">
          <SearchBar 
            defaultQuery={search.q || ""}
            defaultLocation={search.location || ""}
            catalog={catalog}
            onSearch={(q, loc, filters) => {
              setQuery(q);
              setLocationStr(loc);
              if (filters) {
                setSkillIds(filters.skillIds || []);
                setCompanyIds(filters.companyIds || []);
                setRoleId(filters.roleId);
              }
            }} 
          />
        </div>
      </div>

      {/* Mobile filter toggle button */}
      <div className="sticky top-16 z-30 flex items-center gap-3 border-b border-border bg-background px-4 py-2 sm:px-6 lg:hidden">
        <button
          type="button"
          onClick={() => setShowFilters(v => !v)}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
        >
          <SlidersHorizontal className="size-4" />
          Filters
        </button>
        {(types.length > 0 || remoteOnly || datePostedDays || salaryGe || salaryLe || skillIds.length > 0 || roleId || companyIds.length > 0) && (
          <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
            Active
          </span>
        )}
      </div>

      {/* Mobile filter overlay backdrop */}
      {showFilters && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setShowFilters(false)}
        />
      )}

      <div className="mx-auto grid max-w-[1400px] gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,420px)_minmax(0,1fr)]">
        <aside className={`space-y-6 ${
          showFilters
            ? 'fixed inset-y-0 left-0 z-50 w-[280px] overflow-y-auto bg-background p-4 shadow-xl lg:relative lg:inset-auto lg:z-auto lg:w-auto lg:overflow-visible lg:p-0 lg:shadow-none'
            : 'hidden lg:block'
        }`}>
          {/* Mobile close button */}
          <div className="flex items-center justify-between lg:hidden">
            <span className="text-sm font-semibold text-foreground">Filters</span>
            <button
              type="button"
              onClick={() => setShowFilters(false)}
              className="inline-flex size-8 items-center justify-center rounded-full hover:bg-accent"
            >
              <X className="size-5" />
            </button>
          </div>
          <FilterGroup title="Job type">
            {jobTypeFilters.map((t) => (
              <label
                key={t.value}
                className="flex cursor-pointer items-center gap-3 py-1.5 text-sm text-foreground"
              >
                <input
                  type="checkbox"
                  checked={types.includes(t.value)}
                  onChange={() => toggleType(t.value)}
                  className="size-4 rounded border-input accent-primary"
                />
                {t.label}
              </label>
            ))}
          </FilterGroup>

          <FilterGroup title="Remote">
            <label className="flex cursor-pointer items-center gap-3 py-1.5 text-sm text-foreground">
              <input
                type="checkbox"
                checked={remoteOnly}
                onChange={() => setRemoteOnly((v) => !v)}
                className="size-4 rounded border-input accent-primary"
              />
              Remote only
            </label>
          </FilterGroup>

          <FilterGroup title="Date posted">
            {dateFilters.map((d) => (
              <label
                key={d.days}
                className="flex cursor-pointer items-center gap-3 py-1.5 text-sm text-foreground"
              >
                <input
                  type="radio"
                  name="date-posted"
                  checked={datePostedDays === d.days}
                  onChange={() => setDatePostedDays(d.days)}
                  onClick={() => { if (datePostedDays === d.days) setDatePostedDays(null) }}
                  className="size-4 accent-primary"
                />
                {d.label}
              </label>
            ))}
          </FilterGroup>

          <FilterGroup title="Salary">
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min ₹"
                value={salaryGe ?? ""}
                onChange={(e) => setSalaryGe(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <span className="text-muted-foreground">-</span>
              <input
                type="number"
                placeholder="Max ₹"
                value={salaryLe ?? ""}
                onChange={(e) => setSalaryLe(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </FilterGroup>
          <FilterGroup title="Skills">
            {catalog.skills.slice(0, 8).map((skill) => (
              <label key={skill.id} className="flex items-center gap-3 py-1.5 text-sm">
                <input
                  type="checkbox"
                  checked={skillIds.includes(skill.id)}
                  onChange={() =>
                    setSkillIds((ids) =>
                      ids.includes(skill.id)
                        ? ids.filter((id) => id !== skill.id)
                        : [...ids, skill.id],
                    )
                  }
                  className="accent-primary"
                />
                {skill.name}
              </label>
            ))}
          </FilterGroup>
          <FilterGroup title="Roles">
            <select
              value={roleId ?? ""}
              onChange={(e) => setRoleId(e.target.value ? Number(e.target.value) : undefined)}
              className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm"
            >
              <option value="">All roles</option>
              {catalog.roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </FilterGroup>
          <FilterGroup title="Companies">
            {catalog.companies.slice(0, 8).map((company) => (
              <label key={company.backendId} className="flex items-center gap-3 py-1.5 text-sm">
                <input
                  type="checkbox"
                  checked={company.backendId ? companyIds.includes(company.backendId) : false}
                  onChange={() =>
                    company.backendId &&
                    setCompanyIds((ids) =>
                      ids.includes(company.backendId!)
                        ? ids.filter((id) => id !== company.backendId)
                        : [...ids, company.backendId!],
                    )
                  }
                  className="accent-primary"
                />
                {company.name}
              </label>
            ))}
          </FilterGroup>
        </aside>


        <section className="space-y-4">
          {loading && <p className="text-sm text-muted-foreground">Loading live jobs…</p>}
          {error && (
            <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p>
          )}
          {!loading && !error && (
            <p className="text-sm text-muted-foreground">
              {totalElements} {totalElements === 1 ? "job" : "jobs"}
            </p>
          )}
          {jobs.length === 0 && !loading ? (
            <div className="rounded-xl border border-border bg-card p-10 text-center">
              <p className="font-display text-lg font-semibold text-foreground">No matching jobs</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Try removing a filter or searching a different title.
              </p>
            </div>
          ) : (
            <>
              {jobs.map((job) => {
                const highlights = {
                  salary: salaryGe !== undefined || salaryLe !== undefined,
                  remote: remoteOnly,
                  skills: skillIds.map(id => catalog.skills.find(s => s.id === id)?.name?.toLowerCase()).filter(Boolean) as string[],
                  types: types.map(t => t.replaceAll("_", " ").toLowerCase()),
                };
                return (
                  <JobCard
                    key={job.id}
                    job={job}
                    selected={Number(job.id) === search.jobId}
                    onSelect={(j) => navigate({ search: (prev) => ({ ...prev, jobId: Number(j.id) }), replace: true })}
                    highlights={highlights}
                  />
                );
              })}
              {jobs.length > 0 && (
                <div className="mt-8 flex items-center justify-between border-t border-border pt-6 pb-2">
                  <button
                    disabled={page === 0}
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    className="rounded-lg border border-input px-4 py-2 text-sm font-semibold hover:bg-accent disabled:opacity-50 text-foreground bg-card"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-muted-foreground">
                    Page {page + 1} of {Math.max(1, totalPages)}
                  </span>
                  <button
                    disabled={page >= totalPages - 1}
                    onClick={() => setPage(p => p + 1)}
                    className="rounded-lg border border-input px-4 py-2 text-sm font-semibold hover:bg-accent disabled:opacity-50 text-foreground bg-card"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        <section className="hidden xl:block">
          {fullJob ? (
            <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-xl scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent shadow-sm">
              <JobDetailPanel 
                job={fullJob} 
                hasApplied={applications.some(a => String(a.jobId) === String(fullJob.id))}
                highlights={{
                  salary: salaryGe !== undefined || salaryLe !== undefined,
                  remote: remoteOnly,
                  skills: skillIds.map(id => catalog.skills.find(s => s.id === id)?.name?.toLowerCase()).filter(Boolean) as string[],
                  types: types.map(t => t.replaceAll("_", " ").toLowerCase()),
                }}
              />
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="group rounded-xl border border-border bg-card" open>
      <summary className="flex cursor-pointer list-none items-center justify-between p-4 text-sm font-semibold text-foreground select-none [&::-webkit-details-marker]:hidden">
        {title}
        <svg
          className="size-4 transition-transform group-open:rotate-180 text-muted-foreground"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </summary>
      <div className="px-4 pb-4 animate-in fade-in slide-in-from-top-1">
        {children}
      </div>
    </details>
  );
}
