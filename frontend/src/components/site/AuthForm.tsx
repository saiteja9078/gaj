import { Link, useNavigate } from "@tanstack/react-router";
import { Briefcase, Building2, UserRound } from "lucide-react";
import { useState, useEffect, type FormEvent } from "react";
import { ROLE_HOME, useRole } from "@/lib/role";
import type { UserRole } from "@/types";
import { authenticate, formatErrorMessage, getCatalog, type CatalogItem } from "@/lib/api";

const roleOptions: { value: UserRole; label: string; blurb: string; icon: React.ReactNode }[] = [
  {
    value: "candidate",
    label: "Candidate",
    blurb: "Find jobs and track applications",
    icon: <UserRound className="size-5" />,
  },
  {
    value: "hiring",
    label: "Hiring Manager",
    blurb: "Review applicants and run interviews",
    icon: <Briefcase className="size-5" />,
  },
  {
    value: "company",
    label: "Company",
    blurb: "Post jobs and manage your profile",
    icon: <Building2 className="size-5" />,
  },
];

export function AuthForm({ mode }: { mode: "signin" | "signup" }) {
  const [selected, setSelected] = useState<UserRole>("candidate");
  const { setRole } = useRole();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [industries, setIndustries] = useState<CatalogItem[]>([]);
  const [industryId, setIndustryId] = useState<string>("");
  const [industryName, setIndustryName] = useState<string>("");

  useEffect(() => {
    if (mode === "signup") {
      getCatalog().then(c => setIndustries(c.industries)).catch(() => {});
    }
  }, [mode]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const payload =
        mode === "signin"
          ? { email, password }
          : selected === "candidate"
            ? {
                firstName: firstName.trim() || "User",
                lastName: lastName.trim() || "User",
                email,
                password,
                description: "",
                age: 18,
              }
            : selected === "company"
              ? { 
                  name: companyName.trim() || "New Company", 
                  email, 
                  password,
                  industry_id: industryId && industryId !== "new" ? Number(industryId) : undefined,
                }
              : {
                  firstName: firstName.trim() || "User",
                  lastName: lastName.trim() || "User",
                  email,
                  password,
                };
      await authenticate(selected, mode, payload);
      setRole(selected);
      navigate({ to: ROLE_HOME[selected] });
    } catch (e) {
      setError(formatErrorMessage(e, "Unable to authenticate"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-[520px] px-4 py-14 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-foreground">
        {mode === "signin" ? "Sign in to Hirely" : "Create your Hirely account"}
      </h1>
      <p className="mt-2 text-[15px] text-muted-foreground">
        Choose the account you want to use. You can switch at any time.
      </p>

      <div className="mt-8 space-y-3">
        {roleOptions.filter(opt => !(mode === "signup" && opt.value === "hiring")).map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setSelected(opt.value)}
            className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-colors ${
              selected === opt.value
                ? "border-primary bg-info-muted"
                : "border-border bg-card hover:border-input"
            }`}
          >
            <span
              className={`inline-flex size-10 shrink-0 items-center justify-center rounded-lg ${
                selected === opt.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              {opt.icon}
            </span>
            <span>
              <span className="block font-semibold text-foreground">{opt.label}</span>
              <span className="block text-sm text-muted-foreground">{opt.blurb}</span>
            </span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {mode === "signup" && selected === "company" && (
          <>
            <Field
              label="Company name"
              type="text"
              placeholder="Acme Inc."
              value={companyName}
              onChange={setCompanyName}
            />
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-foreground">Industry</span>
              <select
                value={industryId}
                onChange={(e) => setIndustryId(e.target.value)}
                className="w-full rounded-lg border border-input bg-card px-4 py-2.5 text-[15px] text-foreground focus:border-primary focus:outline-none mb-3"
              >
                <option value="" disabled>Select an industry</option>
                {industries.map(i => (
                  <option key={i.id} value={i.id}>{i.name}</option>
                ))}
                <option value="new">+ Create new industry...</option>
              </select>
            </label>
            {industryId === "new" && (
              <Field
                label="New Industry Name"
                type="text"
                placeholder="e.g. Space Tech"
                value={industryName}
                onChange={setIndustryName}
              />
            )}
          </>
        )}
        {mode === "signup" && selected !== "company" && (
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="First name"
              type="text"
              placeholder="John"
              value={firstName}
              onChange={setFirstName}
            />
            <Field
              label="Last name"
              type="text"
              placeholder="Doe"
              value={lastName}
              onChange={setLastName}
            />
          </div>
        )}
        <Field
          label="Email address"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={setEmail}
        />
        <Field
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={setPassword}
        />
        {error && <p className="text-sm text-destructive">{error}</p>}

        <button
          type="submit"
          className="w-full rounded-lg bg-primary py-3 text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          {busy ? "Working…" : mode === "signin" ? "Sign in" : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {mode === "signin" ? (
          <>
            New to Hirely?{" "}
            <Link to="/signup" className="text-primary hover:underline">
              Create an account
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link to="/signin" className="text-primary hover:underline">
              Sign in
            </Link>
          </>
        )}
      </p>
    </div>
  );
}

function Field({
  label,
  type,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-input bg-card px-4 py-2.5 text-[15px] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
      />
    </label>
  );
}
