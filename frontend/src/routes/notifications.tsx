import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { EmptyState } from "@/components/site/EmptyState";
import { getNotifications, type AppNotificationResponse } from "@/lib/api";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — Hirely" },
      { name: "description", content: "Updates about your job applications and searches on Hirely." },
      { property: "og:title", content: "Notifications — Hirely" },
      { property: "og:description", content: "Updates about your job applications and searches." },
    ],
  }),
  component: NotificationsPage,
});

function NotificationsPage() {
  const [notifications, setNotifications] = useState<AppNotificationResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNotifications()
      .then(setNotifications)
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="mx-auto max-w-[760px] px-4 py-12 text-muted-foreground">Loading notifications…</div>;
  }

  if (notifications.length === 0) {
    return (
      <EmptyState
        illustration={<BellIllustration />}
        title="Nothing right now. Check back later!"
        description="This is where we'll notify you about your job applications and other useful information to help you with your job search."
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

  return (
    <div className="mx-auto max-w-[760px] px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-foreground">Notifications</h1>
      <div className="mt-6 space-y-3">
        {notifications.map((n) => (
          <div key={n.id} className="rounded-xl border border-border bg-card p-5">
            <p className="font-semibold text-foreground">{n.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{n.message}</p>
            <p className="mt-2 text-xs text-muted-foreground">{new Date(n.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function BellIllustration() {
  return (
    <svg width="200" height="150" viewBox="0 0 200 150" fill="none" aria-hidden>
      <rect x="20" y="40" width="130" height="80" rx="4" className="fill-chart-4/40" />
      <circle cx="120" cy="55" r="26" className="fill-chart-3/50" />
      <path
        d="M60 100c0-6 6-8 8-14 3-9 1-20 9-27 8-7 20-5 26 3 6 8 4 18 8 26 3 6 9 8 9 12H60z"
        className="fill-primary"
      />
      <circle cx="88" cy="112" r="8" className="fill-background" />
    </svg>
  );
}
