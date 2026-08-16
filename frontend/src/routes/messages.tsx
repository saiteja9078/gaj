import { createFileRoute, Link } from "@tanstack/react-router";
import { EmptyState } from "@/components/site/EmptyState";

export const Route = createFileRoute("/messages")({
  head: () => ({
    meta: [
      { title: "Messages — Hirely" },
      { name: "description", content: "Conversations with employers about your applications." },
      { property: "og:title", content: "Messages — Hirely" },
      { property: "og:description", content: "Conversations with employers about your applications." },
    ],
  }),
  component: MessagesPage,
});

function MessagesPage() {
  return (
    <EmptyState
      illustration={
        <svg width="180" height="130" viewBox="0 0 180 130" fill="none" aria-hidden>
          <rect x="20" y="25" width="120" height="72" rx="8" className="fill-chart-4/40" />
          <rect x="45" y="45" width="110" height="66" rx="8" className="fill-primary" />
          <rect x="60" y="65" width="60" height="6" rx="3" className="fill-background/70" />
          <rect x="60" y="80" width="40" height="6" rx="3" className="fill-background/50" />
        </svg>
      }
      title="No messages yet"
      description="When an employer replies to one of your applications, the conversation will show up here."
      action={
        <Link
          to="/jobs"
          className="inline-flex rounded-lg bg-primary px-12 py-3.5 text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          Find jobs
        </Link>
      }
    />
  );
}
