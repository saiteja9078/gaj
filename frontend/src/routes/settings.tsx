import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronRight, Mail, Monitor, Lock, ShieldCheck, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { getCurrentCandidate, getCurrentCompany, getCurrentHiringManager } from "@/lib/api";
import { useRole } from "@/lib/role";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Hirely" },
      { name: "description", content: "Manage your account, security, communications, devices, and privacy." },
      { property: "og:title", content: "Settings — Hirely" },
      { property: "og:description", content: "Manage your account, security, communications, and privacy." },
    ],
  }),
  component: SettingsPage,
});

type SectionId = "account" | "security" | "communications" | "devices" | "privacy";

const sections: { id: SectionId; title: string; blurb: string; icon: React.ReactNode; badge?: string }[] = [
  { id: "account", title: "Account settings", blurb: "Your contact information", icon: <UserRound className="size-5" /> },
  { id: "security", title: "Security settings", blurb: "Manage your account security", icon: <Lock className="size-5" />, badge: "New" },
  { id: "communications", title: "Communications settings", blurb: "Manage notifications and message settings", icon: <Mail className="size-5" /> },
  { id: "devices", title: "Device management", blurb: "Manage your active devices and sessions", icon: <Monitor className="size-5" /> },
  { id: "privacy", title: "Privacy settings", blurb: "Information about your privacy on Hirely", icon: <ShieldCheck className="size-5" /> },
];

function SettingsPage() {
  const [active, setActive] = useState<SectionId>("account");
  const { role, setRole } = useRole();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<{ email: string; name: string } | null>(null);

  useEffect(() => {
    if (role === "candidate") {
      getCurrentCandidate()
        .then((c) => setUserInfo({ email: c.email, name: `${c.firstName} ${c.lastName}` }))
        .catch(() => setUserInfo(null));
    } else if (role === "company") {
      getCurrentCompany()
        .then((c) => setUserInfo({ email: (c as any).email || c.name, name: c.name }))
        .catch(() => setUserInfo(null));
    } else if (role === "hiring") {
      getCurrentHiringManager()
        .then((m) => setUserInfo({ email: m.email, name: `${m.firstName} ${m.lastName}` }))
        .catch(() => setUserInfo(null));
    }
  }, [role]);

  function handleSignOut() {
    setRole(null);
    navigate({ to: "/" });
  }

  return (
    <div className="mx-auto grid max-w-[1400px] lg:grid-cols-[420px_minmax(0,1fr)]">
      <aside className="border-border bg-surface lg:border-r">
        <h1 className="px-6 py-10 font-display text-4xl font-bold text-foreground sm:px-10">Settings</h1>
        <nav>
          {sections.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setActive(s.id)}
              className={`flex w-full items-start gap-4 border-t border-border px-6 py-6 text-left transition-colors sm:px-10 ${
                active === s.id ? "border-l-4 border-l-primary bg-card pl-5 sm:pl-9" : "hover:bg-accent/40"
              }`}
            >
              <span className="mt-0.5 text-foreground/70">{s.icon}</span>
              <span className="flex-1">
                <span className="flex items-center gap-2">
                  <span className="font-display text-lg font-semibold text-foreground">{s.title}</span>
                  {s.badge && (
                    <span className="rounded-md bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                      {s.badge}
                    </span>
                  )}
                </span>
                <span className="mt-1 block text-sm text-muted-foreground">{s.blurb}</span>
              </span>
              <ChevronRight className="mt-1 size-5 shrink-0 text-foreground/40" />
            </button>
          ))}
        </nav>
      </aside>

      <section className="px-6 py-10 sm:px-12">
        {active === "account" && (
          <Panel title="Account settings">
            <Row label="Account type:" value={role ? role.toUpperCase() : "Guest"} action="Active role" />
            <Row label="Name:" value={userInfo?.name || "User"} action="Registered Name" />
            <Row label="Email" value={userInfo?.email || "Signed in account"} action="Account email" />
            <div className="pt-6">
              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-lg bg-destructive px-6 py-2.5 text-sm font-semibold text-destructive-foreground hover:bg-destructive/90 transition-colors"
              >
                Sign out of account
              </button>
            </div>
          </Panel>
        )}
        {active === "security" && (
          <Panel title="Security settings">
            <Row label="Two-step verification" value="Off" action="Manage" />
            <Row label="Password & Authentication" value="JWT Session Active" action="Secure" />
          </Panel>
        )}
        {active === "communications" && (
          <Panel title="Communications settings">
            <Row label="Job alert emails" value="Weekly summary" action="Change" />
            <Row label="Employer messages" value="Enabled" action="Change" />
          </Panel>
        )}
        {active === "devices" && (
          <Panel title="Device management">
            <Row label="Current Browser Session" value="Active now" action="Current device" />
          </Panel>
        )}
        {active === "privacy" && (
          <Panel title="Privacy settings">
            <Row label="Profile visibility" value="Employers can search your profile" action="Change" />
          </Panel>
        )}
      </section>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="max-w-3xl">
      <h2 className="font-display text-3xl font-bold text-foreground">{title}</h2>
      <div className="mt-8 space-y-0">{children}</div>
    </div>
  );
}

function Row({ label, value, action }: { label: string; value: string; action: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border py-7">
      <div>
        <p className="font-semibold text-foreground">{label}</p>
        {value && <p className="mt-1 text-[15px] text-muted-foreground">{value}</p>}
      </div>
      <span className="text-sm font-medium text-muted-foreground">{action}</span>
    </div>
  );
}
