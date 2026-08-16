import { createFileRoute, Link, Navigate, redirect } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { useRole } from "@/lib/role";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  getCompanyHiringManagers,
  getCurrentCompany,
  getEmployerJobs,
  createHiringManager,
  deleteHiringManager,
  getCatalog,
  createDepartment,
  type HiringManagerMember,
  type CatalogDepartmentItem,
} from "@/lib/api";
import type { Job } from "@/types";
import { Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/company/")({
  beforeLoad: () => { if (typeof window === "undefined") return;
    const token = localStorage.getItem("hirely-token");
    const role = localStorage.getItem("hirely-role");
    if (!token || role !== "company") {
      throw redirect({ to: "/signin" });
    }
  },
  head: () => ({
    meta: [
      { title: "Company dashboard — Hirely" },
      { name: "description", content: "Manage posted jobs, your team, and your company profile on Hirely." },
      { property: "og:title", content: "Company dashboard — Hirely" },
      { property: "og:description", content: "Manage posted jobs, your team, and your company profile." },
    ],
  }),
  component: CompanyDashboard,
});

function CompanyDashboard() {
  const { role } = useRole();
  const [company, setCompany] = useState<Awaited<ReturnType<typeof getCurrentCompany>> | null>(null);
  const [postedJobs, setPostedJobs] = useState<Job[]>([]);
  const [team, setTeam] = useState<HiringManagerMember[]>([]);
  const [departments, setDepartments] = useState<CatalogDepartmentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAddManager, setShowAddManager] = useState(false);
  const [newManager, setNewManager] = useState({ firstName: "", lastName: "", email: "", password: "", gender: "MALE", departmentId: "" });
  const [addBusy, setAddBusy] = useState(false);
  const [isCreatingDept, setIsCreatingDept] = useState(false);
  const [newDeptName, setNewDeptName] = useState("");

  useEffect(() => {
    Promise.all([
      getCurrentCompany().catch(() => null),
      getEmployerJobs().catch(() => []),
      getCompanyHiringManagers().catch(() => []),
      getCatalog().then(c => c.departments).catch(() => []),
    ]).then(([comp, jobs, managers, deps]) => {
      setCompany(comp);
      setPostedJobs(jobs);
      setTeam(managers);
      if (comp) {
        setDepartments(deps.filter(d => d.companyId === comp.id));
      }
      setLoading(false);
    });
  }, []);

  async function handleAddManager(e: FormEvent) {
    e.preventDefault();
    setAddBusy(true);
    try {
      let deptId = newManager.departmentId ? Number(newManager.departmentId) : null;
      if (isCreatingDept && newDeptName.trim() && company) {
        const createdDept = await createDepartment(newDeptName.trim(), company.id);
        deptId = createdDept.id;
        setDepartments(prev => [...prev, createdDept]);
      }
      
      if (!deptId) {
        toast.error("Please select or create a department");
        setAddBusy(false);
        return;
      }

      await createHiringManager({
        ...newManager,
        departmentId: deptId
      });
      // Refresh team
      const newTeam = await getCompanyHiringManagers().catch(() => team);
      setTeam(newTeam);
      setShowAddManager(false);
      setNewManager({ firstName: "", lastName: "", email: "", password: "", gender: "MALE", departmentId: "" });
      setIsCreatingDept(false);
      setNewDeptName("");
    } catch (err) {
      toast.error("Failed to add manager: " + String(err));
    } finally {
      setAddBusy(false);
    }
  }

  async function handleDeleteManager(id: number) {
    try {
      await deleteHiringManager(id);
      setTeam(team.filter(m => m.id !== id));
    } catch (err) {
      toast.error("Failed to delete manager: " + String(err));
    }
  }

  if (loading) {
    return <div className="mx-auto max-w-[1100px] px-4 py-12 text-muted-foreground">Loading dashboard…</div>;
  }

  if (role !== "company") {
    return <Navigate to="/signin" />;
  }

  if (!company) {
    return (
      <div className="mx-auto max-w-[1100px] px-4 py-12 text-center text-muted-foreground">
        <p className="text-lg">Sign in as an employer or company to view your company dashboard.</p>
        <Link to="/signin" className="mt-4 inline-block font-semibold text-primary hover:underline">
          Sign in →
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">{company.name}</h1>
          <p className="mt-2 text-[15px] text-muted-foreground">
            {company.industry?.name || "Company"} {company.location?.state ? `· ${company.location.state}` : ""}
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/company/profile"
            className="rounded-lg border border-input px-4 py-2 text-sm font-semibold text-foreground hover:bg-accent"
          >
            Edit profile
          </Link>
          <Link
            to="/company/post-job"
            className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            Post a job
          </Link>
        </div>
      </div>

      <h2 className="mt-12 font-display text-2xl font-bold text-foreground">Posted jobs ({postedJobs.length})</h2>
      <div className="mt-4 space-y-3">
        {postedJobs.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-6 text-center text-muted-foreground text-sm">
            No active job postings. Click "Post a job" above to create one.
          </div>
        ) : (
          postedJobs.map((j) => (
            <div key={j.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-5">
              <div>
                <p className="font-display text-lg font-semibold text-foreground">{j.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {j.location} · {j.payLabel}
                </p>
              </div>
              <Link
                to="/hiring/jobs/$jobId/applicants"
                params={{ jobId: j.id }}
                className="text-sm font-medium text-primary hover:underline"
              >
                View applicants →
              </Link>
            </div>
          ))
        )}
      </div>

      <div className="mt-12 flex items-center justify-between flex-wrap gap-4">
        <h2 className="font-display text-2xl font-bold text-foreground">Hiring Managers &amp; Team</h2>
        <button
          onClick={() => setShowAddManager(!showAddManager)}
          className="flex items-center gap-2 rounded-lg border border-input px-4 py-2 text-sm font-semibold text-foreground hover:bg-accent"
        >
          <Plus className="size-4" />
          Add Manager
        </button>
      </div>
      
      {showAddManager && (
        <form onSubmit={handleAddManager} className="mt-6 rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-4 font-semibold text-foreground text-lg">Create a Hiring Manager Account</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-foreground">First name</span>
              <input required value={newManager.firstName} onChange={e => setNewManager(prev => ({...prev, firstName: e.target.value}))} className="w-full rounded-md border border-input px-3 py-2 text-sm focus:border-primary focus:outline-none bg-transparent" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-foreground">Last name</span>
              <input required value={newManager.lastName} onChange={e => setNewManager(prev => ({...prev, lastName: e.target.value}))} className="w-full rounded-md border border-input px-3 py-2 text-sm focus:border-primary focus:outline-none bg-transparent" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-foreground">Email</span>
              <input type="email" required value={newManager.email} onChange={e => setNewManager(prev => ({...prev, email: e.target.value}))} className="w-full rounded-md border border-input px-3 py-2 text-sm focus:border-primary focus:outline-none bg-transparent" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-foreground">Password</span>
              <input type="password" required value={newManager.password} onChange={e => setNewManager(prev => ({...prev, password: e.target.value}))} className="w-full rounded-md border border-input px-3 py-2 text-sm focus:border-primary focus:outline-none bg-transparent" />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1 block text-sm font-medium text-foreground">Department</span>
              <div className="flex gap-2 items-center">
                <select 
                  required={!isCreatingDept} 
                  value={newManager.departmentId} 
                  onChange={e => setNewManager(prev => ({...prev, departmentId: e.target.value}))} 
                  disabled={isCreatingDept}
                  className="w-full rounded-md border border-input px-3 py-2 text-sm focus:border-primary focus:outline-none bg-card text-foreground disabled:opacity-50"
                >
                  <option value="" disabled>Select a department</option>
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
                <span className="text-sm font-medium text-muted-foreground">or</span>
                <button
                  type="button"
                  onClick={() => setIsCreatingDept(!isCreatingDept)}
                  className="whitespace-nowrap text-sm font-medium text-primary hover:underline"
                >
                  {isCreatingDept ? "Select existing" : "Create new"}
                </button>
              </div>
              {isCreatingDept && (
                <input
                  type="text"
                  required
                  placeholder="New department name"
                  value={newDeptName}
                  onChange={e => setNewDeptName(e.target.value)}
                  className="mt-2 w-full rounded-md border border-input px-3 py-2 text-sm focus:border-primary focus:outline-none bg-transparent"
                />
              )}
              {departments.length === 0 && !isCreatingDept && (
                <p className="mt-1 text-xs text-destructive">No departments found. Please click "Create new" to add one.</p>
              )}
            </label>
          </div>
          <div className="mt-5 flex justify-end gap-3">
            <button type="button" onClick={() => setShowAddManager(false)} className="rounded-md px-4 py-2 text-sm font-medium hover:bg-accent">Cancel</button>
            <button type="submit" disabled={addBusy || (departments.length === 0 && !isCreatingDept)} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50">
              {addBusy ? "Saving..." : "Create Account"}
            </button>
          </div>
        </form>
      )}

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {team.length === 0 ? (
          <p className="text-sm text-muted-foreground col-span-3">No hiring managers linked yet.</p>
        ) : (
          team.map((m) => {
            const initials = `${m.firstName?.[0] || ""}${m.lastName?.[0] || ""}`.toUpperCase() || "HM";
            return (
              <div key={m.id} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-5">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">
                    {initials}
                  </span>
                  <span>
                    <span className="block font-medium text-foreground">
                      {m.firstName} {m.lastName}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {m.hiringDepartment?.name || "Hiring Manager"}
                    </span>
                  </span>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="size-5" />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will immediately remove the hiring manager from your company account.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteManager(m.id)}>Remove</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
