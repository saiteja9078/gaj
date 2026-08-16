import { r as __toESM } from "../_runtime.mjs";
import { f as require_jsx_runtime, p as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { g as Navigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as getEmployerJobs, L as getJobApplicants, P as getCurrentHiringManager, c as useRole } from "./router-BtZMXQ2R.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/hiring.index-gZOZU6BC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var stages = [
	{
		id: "APPLIED",
		label: "Applied"
	},
	{
		id: "SCREENING",
		label: "Screening"
	},
	{
		id: "INTERVIEW",
		label: "Interview"
	},
	{
		id: "OFFER",
		label: "Offer"
	}
];
function HiringDashboard() {
	const { role } = useRole();
	const [manager, setManager] = (0, import_react.useState)(null);
	const [jobs, setJobs] = (0, import_react.useState)([]);
	const [allApplicants, setAllApplicants] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	if (role !== "hiring") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/signin" });
	(0, import_react.useEffect)(() => {
		Promise.all([getCurrentHiringManager().catch(() => null), getEmployerJobs().catch(() => [])]).then(async ([mgr, jbs]) => {
			setManager(mgr);
			setJobs(jbs);
			const apps = await Promise.all(jbs.map(async (j) => {
				const list = await getJobApplicants(j.id).catch(() => []);
				return {
					jobId: j.id,
					applicants: list
				};
			}));
			setAllApplicants(apps);
			setLoading(false);
		});
	}, []);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-[1100px] px-4 py-12 text-muted-foreground",
		children: "Loading hiring dashboard…"
	});
	const flatApplicants = allApplicants.flatMap((a) => a.applicants);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-[1100px] px-4 py-12 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl font-bold text-foreground sm:text-4xl",
					children: "Hiring dashboard"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-[15px] text-muted-foreground",
					children: manager ? `Welcome back, ${manager.firstName}` : "Your pipeline across all open roles."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/company/post-job",
					className: "rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover",
					children: "Post a job"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 grid gap-4 sm:grid-cols-4",
				children: stages.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: s.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-display text-3xl font-bold text-foreground",
						children: flatApplicants.filter((a) => a.status === s.id).length
					})]
				}, s.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "mt-12 font-display text-2xl font-bold text-foreground",
				children: [
					"My open roles (",
					jobs.length,
					")"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 space-y-3",
				children: jobs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground",
					children: "No open roles. Post a job to start receiving applicants."
				}) : jobs.map((job) => {
					const count = allApplicants.find((a) => a.jobId === job.id)?.applicants.length || 0;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/hiring/jobs/$jobId/applicants",
						params: { jobId: job.id },
						className: "flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-lg font-semibold text-foreground",
							children: job.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: [
								job.location,
								" · ",
								job.payLabel
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-sm font-medium text-primary",
							children: [count, " applicants →"]
						})]
					}, job.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-12 font-display text-2xl font-bold text-foreground",
				children: "Recent applicant activity"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 space-y-3",
				children: flatApplicants.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "text-sm text-muted-foreground",
					children: "No recent applicant activity."
				}) : flatApplicants.slice(0, 5).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-xl border border-border bg-card p-5 text-[15px] text-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold",
							children: a.candidateName
						}),
						" applied for a role · stage:",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "capitalize font-medium text-primary",
							children: a.status.toLowerCase()
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted-foreground",
							children: [" · ", a.appliedAt]
						})
					]
				}, a.applicationId))
			})
		]
	});
}
//#endregion
export { HiringDashboard as component };
