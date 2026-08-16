import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Building2, Search, Star, Users } from "lucide-react";
import { SearchBar } from "@/components/site/SearchBar";
import { getCatalog, listCompanies, listJobs, type CatalogItem } from "@/lib/api";
import { useEffect, useState } from "react";
import type { Company, Job } from "@/types";

import { ROLE_HOME, useRole } from "@/lib/role";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hirely — Find your next job or your next hire" },
      {
        name: "description",
        content:
          "Search thousands of jobs, read company reviews, compare salaries, and manage hiring — all on Hirely.",
      },
      { property: "og:title", content: "Hirely — Find your next job or your next hire" },
      {
        property: "og:description",
        content:
          "Search jobs, read company reviews, compare salaries, and manage hiring on Hirely.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const navigate = useNavigate();
  const { role } = useRole();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [categories, setCategories] = useState<CatalogItem[]>([]);
  const [catalog, setCatalog] = useState<{
    skills: { id: number; name: string }[];
    roles: { id: number; name: string }[];
    industries: { id: number; name: string }[];
    companies: { slug: string; name: string; backendId?: number }[];
  }>({ skills: [], roles: [], industries: [], companies: [] });

  useEffect(() => {
    if (role) {
      navigate({ to: ROLE_HOME[role], replace: true });
      return;
    }
    listJobs()
      .then(setJobs)
      .catch(() => {});
    listCompanies()
      .then(setCompanies)
      .catch(() => {});
    getCatalog()
      .then((cat) => {
        setCategories(cat.roles);
        setCatalog(cat as any);
      })
      .catch(() => {});
  }, [role, navigate]);

  if (role) {
    return null;
  }

  return (
    <div>
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-[1100px] px-4 py-20 text-center sm:px-6 sm:py-28">
          <h1 className="font-display text-4xl font-bold leading-tight text-foreground sm:text-6xl">
            Work you want,
            <br />
            people you need.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-[17px] leading-relaxed text-muted-foreground">
            One place for candidates, hiring managers, and companies. Search openings, track
            applicants, and post roles without the noise.
          </p>

          <div className="mx-auto mt-10 max-w-3xl">
            <SearchBar 
              catalog={catalog}
              onSearch={(q, loc, filters) => {
              navigate({
                to: "/jobs",
                search: {
                  q: q || undefined,
                  location: loc || undefined,
                  roleId: filters?.roleId,
                  companyIds: filters?.companyIds?.length ? filters.companyIds : undefined,
                  skillIds: filters?.skillIds?.length ? filters.skillIds : undefined,
                } as any,
              });
            }} />
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {categories.slice(0, 8).map((c) => (
              <Link
                key={c.id}
                to="/jobs"
                search={{ roleId: c.id } as any}
                className="rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1100px] px-4 py-16 sm:px-6">
        <div className="grid gap-6 md:grid-cols-3">
          <ValueProp icon={<Search className="size-5" />} title="Jobs that fit">
            Matches based on the pay, schedule, and location you actually want — no endless filters.
          </ValueProp>
          <ValueProp icon={<Users className="size-5" />} title="A pipeline you can read">
            Hiring managers see every applicant by stage, with notes and next steps in one view.
          </ValueProp>
          <ValueProp icon={<Building2 className="size-5" />} title="Company profiles that help">
            Ratings, reviews, and open roles together, so candidates decide with real information.
          </ValueProp>
        </div>
      </section>

      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-[1100px] px-4 py-16 sm:px-6">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display text-2xl font-bold text-foreground">Featured jobs</h2>
            <Link
              to="/jobs"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              See all jobs <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {jobs.slice(0, 3).map((job) => (
              <Link
                key={job.id}
                to="/jobs"
                className="rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md"
              >
                <h3 className="font-display text-lg font-semibold text-foreground">{job.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{job.company}</p>
                <p className="text-sm text-muted-foreground">{job.location}</p>
                <p className="mt-4 text-sm font-medium text-foreground">{job.payLabel}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1100px] px-4 py-16 sm:px-6">
        <h2 className="font-display text-2xl font-bold text-foreground">Companies hiring now</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {companies.map((c) => (
            <Link
              key={c.slug}
              to="/companies/$slug"
              params={{ slug: c.slug }}
              className="rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md"
            >
              <p className="font-display font-semibold text-foreground">{c.name}</p>
              <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="size-4 fill-current text-chart-4" /> {c.industry}
              </p>
              <p className="mt-3 text-sm text-muted-foreground">{c.location}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-surface">
        <div className="mx-auto grid max-w-[1100px] gap-4 px-4 py-16 sm:px-6 md:grid-cols-2">
          <CtaCard
            title="I'm looking for work"
            body="Build a profile, save jobs, and apply in a couple of clicks."
            to="/signup"
            cta="Create a candidate account"
          />
          <CtaCard
            title="I'm hiring"
            body="Post roles, review applicants, and move people through your pipeline."
            to="/signup"
            cta="Get started as an employer"
          />
        </div>
      </section>
    </div>
  );
}

function ValueProp({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="inline-flex size-10 items-center justify-center rounded-lg bg-info-muted text-info-muted-foreground">
        {icon}
      </div>
      <h3 className="mt-4 font-display text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{children}</p>
    </div>
  );
}

function CtaCard({
  title,
  body,
  to,
  cta,
}: {
  title: string;
  body: string;
  to: string;
  cta: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-8">
      <h3 className="font-display text-xl font-bold text-foreground">{title}</h3>
      <p className="mt-2 text-[15px] text-muted-foreground">{body}</p>
      <Link
        to={to}
        className="mt-6 inline-flex rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
      >
        {cta}
      </Link>
    </div>
  );
}
