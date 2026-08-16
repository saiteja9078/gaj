import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

const columns = [
  {
    title: "Job seekers",
    links: [
      { to: "/jobs", label: "Find jobs" },
      { to: "/companies", label: "Company reviews" },
      { to: "/profile", label: "Your profile" },
    ],
  },
  {
    title: "Employers",
    links: [
      { to: "/company/post-job", label: "Post a job" },
      { to: "/hiring", label: "Hiring dashboard" },
      { to: "/company", label: "Company account" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-4 py-12 sm:px-6 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Hirely connects candidates, hiring managers, and companies in one simple place.
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="text-sm font-semibold text-foreground">{col.title}</h3>
            <ul className="mt-3 space-y-2">
              {col.links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-[1400px] px-4 py-5 text-xs text-muted-foreground sm:px-6">
          © {new Date().getFullYear()} Hirely. Demo interface — no real listings.
        </div>
      </div>
    </footer>
  );
}
