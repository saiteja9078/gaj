import { r as __toESM } from "../_runtime.mjs";
import { f as require_jsx_runtime, p as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { _ as useNavigate, g as Navigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as Briefcase, s as Trash2 } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { H as listJobs, I as getJob, M as getCurrentCandidate, R as getMyApplications, c as useRole, k as getCatalog, x as deleteJobApplication } from "./router-BtZMXQ2R.mjs";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, l as AlertDialogTrigger, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./alert-dialog-CXo_-D8n.mjs";
import { n as JobDetailPanel, t as JobCard } from "./JobDetailPanel-VDQuoslb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-DrVkdKxI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Dashboard() {
	const { role } = useRole();
	const dashNavigate = useNavigate();
	const [candidate, setCandidate] = (0, import_react.useState)(null);
	const [applications, setApplications] = (0, import_react.useState)([]);
	const [jobs, setJobs] = (0, import_react.useState)([]);
	const [selectedId, setSelectedId] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [fullJob, setFullJob] = (0, import_react.useState)(null);
	const [catalog, setCatalog] = (0, import_react.useState)({
		roles: [],
		skills: [],
		companies: []
	});
	(0, import_react.useEffect)(() => {
		if (selectedId) getJob(selectedId).then(setFullJob).catch(() => setFullJob(null));
		else setFullJob(null);
	}, [selectedId]);
	(0, import_react.useEffect)(() => {
		Promise.all([
			getCurrentCandidate().catch(() => null),
			getMyApplications().catch(() => []),
			listJobs().catch(() => []),
			getCatalog().catch(() => ({
				roles: [],
				skills: [],
				companies: [],
				industries: []
			}))
		]).then(([cand, apps, jbs, cat]) => {
			setCandidate(cand);
			setApplications(apps);
			const appliedIds = new Set(apps.map((a) => String(a.jobId)));
			const unappliedJbs = jbs.filter((j) => !appliedIds.has(j.id));
			setJobs(unappliedJbs);
			setCatalog(cat);
			if (unappliedJbs.length > 0) setSelectedId(unappliedJbs[0].id);
			else setSelectedId(null);
			setLoading(false);
		});
	}, []);
	if (role !== "candidate") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/signin" });
	const selected = jobs.find((j) => j.id === selectedId) ?? jobs[0];
	async function handleDeleteApplication(appId) {
		try {
			await deleteJobApplication(appId);
			setApplications((prev) => prev.filter((app) => app.id !== appId));
			toast.success("Application removed.");
		} catch (e) {
			toast.error(e.message || "Failed to remove application.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-[1400px] px-4 pt-10 sm:px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "font-display text-3xl font-bold text-foreground sm:text-4xl",
				children: ["Welcome, ", candidate ? candidate.firstName : "Candidate"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 flex flex-wrap gap-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "size-4 text-primary" }),
						applications.length,
						" Applied Jobs"
					]
				})
			})]
		}),
		applications.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-[1400px] px-4 pt-8 sm:px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-xl font-bold text-foreground",
				children: "My Applications"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 grid gap-3 sm:grid-cols-2 md:grid-cols-3",
				children: applications.map((app) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: `/applications/${app.id}`,
							className: "font-semibold text-foreground hover:text-primary hover:underline block",
							children: app.jobTitle
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: app.companyName
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded bg-secondary px-2 py-0.5 text-xs font-semibold capitalize text-secondary-foreground",
								children: app.status.toLowerCase()
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground ml-3",
								children: app.appliedAt
							})] }), app.status === "REJECTED" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialog, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTrigger, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "text-muted-foreground hover:text-destructive transition-colors",
									title: "Delete application",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Are you absolutely sure?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, { children: "This will permanently delete your job application and remove it from your dashboard." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Cancel" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
								onClick: () => handleDeleteApplication(app.id),
								children: "Delete"
							})] })] })] })]
						})
					]
				}, app.id))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-[1400px] gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl font-bold text-foreground",
				children: "Jobs for you"
			}), loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-5 text-sm text-muted-foreground",
				children: "Loading recommended jobs…"
			}) : jobs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-5 text-sm text-muted-foreground",
				children: "No jobs posted yet."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 space-y-4",
				children: jobs.map((job) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JobCard, {
					job,
					selected: selected?.id === job.id,
					onSelect: (j) => {
						setSelectedId(j.id);
						if (window.innerWidth < 1024) dashNavigate({
							to: "/jobs",
							search: { jobId: Number(j.id) }
						});
					}
				}, job.id))
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "hidden lg:block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto",
					children: fullJob ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JobDetailPanel, {
						job: fullJob,
						hasApplied: applications.some((a) => String(a.jobId) === String(fullJob.id))
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-xl border border-border bg-card p-8 text-center text-muted-foreground",
						children: "Select a job to view details."
					})
				})
			})]
		})
	] });
}
//#endregion
export { Dashboard as component };
