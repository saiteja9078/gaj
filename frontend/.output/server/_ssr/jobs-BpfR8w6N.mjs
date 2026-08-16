import { r as __toESM } from "../_runtime.mjs";
import { f as require_jsx_runtime, p as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { d as SlidersHorizontal, t as X } from "../_libs/lucide-react.mjs";
import { I as getJob, R as getMyApplications, U as listJobsPage, k as getCatalog, o as Route$15 } from "./router-BtZMXQ2R.mjs";
import { n as JobDetailPanel, t as JobCard } from "./JobDetailPanel-VDQuoslb.mjs";
import { t as SearchBar } from "./SearchBar-BDBS_5PB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/jobs-BpfR8w6N.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var jobTypeFilters = [
	{
		label: "Full-time",
		value: "FULL_TIME"
	},
	{
		label: "Part-time",
		value: "PART_TIME"
	},
	{
		label: "Internship",
		value: "INTERN"
	}
];
var dateFilters = [
	{
		label: "Last 24 hours",
		days: 1
	},
	{
		label: "Last 3 days",
		days: 3
	},
	{
		label: "Last 7 days",
		days: 7
	},
	{
		label: "Last 14 days",
		days: 14
	}
];
function JobsPage() {
	const [showFilters, setShowFilters] = (0, import_react.useState)(false);
	const search = Route$15.useSearch();
	const navigate = Route$15.useNavigate();
	const [jobs, setJobs] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const [query, setQuery] = (0, import_react.useState)(search.q || "");
	const [locationStr, setLocationStr] = (0, import_react.useState)(search.location || "");
	const [remoteOnly, setRemoteOnly] = (0, import_react.useState)(false);
	const [types, setTypes] = (0, import_react.useState)([]);
	const [datePostedDays, setDatePostedDays] = (0, import_react.useState)(null);
	const [salaryGe, setSalaryGe] = (0, import_react.useState)();
	const [salaryLe, setSalaryLe] = (0, import_react.useState)();
	const [page, setPage] = (0, import_react.useState)(0);
	const [totalPages, setTotalPages] = (0, import_react.useState)(1);
	const [totalElements, setTotalElements] = (0, import_react.useState)(0);
	const [skillIds, setSkillIds] = (0, import_react.useState)(search.skillIds || []);
	const [roleId, setRoleId] = (0, import_react.useState)(search.roleId);
	const [companyIds, setCompanyIds] = (0, import_react.useState)(search.companyIds || []);
	const [catalog, setCatalog] = (0, import_react.useState)({
		skills: [],
		roles: [],
		industries: [],
		companies: []
	});
	const [applications, setApplications] = (0, import_react.useState)([]);
	const [fullJob, setFullJob] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (localStorage.getItem("hirely-role") === "candidate") getMyApplications().then(setApplications).catch(() => {});
	}, []);
	(0, import_react.useEffect)(() => {
		if (search.jobId) getJob(String(search.jobId)).then(setFullJob).catch(() => setFullJob(null));
		else setFullJob(null);
	}, [search.jobId]);
	(0, import_react.useEffect)(() => {
		setPage(0);
	}, [
		query,
		locationStr,
		skillIds,
		roleId,
		companyIds,
		remoteOnly,
		datePostedDays,
		types,
		salaryGe,
		salaryLe
	]);
	(0, import_react.useEffect)(() => {
		let postedAfter = void 0;
		if (datePostedDays) {
			const d = /* @__PURE__ */ new Date();
			d.setDate(d.getDate() - datePostedDays);
			postedAfter = d.toISOString();
		}
		setLoading(true);
		listJobsPage(query, {
			location: locationStr || void 0,
			skillIds,
			roleId,
			companyIds,
			workMode: remoteOnly ? "REMOTE" : void 0,
			types: types.length > 0 ? types : void 0,
			postedAfter,
			salaryGe,
			salaryLe
		}, page, 20).then((res) => {
			const newJobs = res.content;
			setJobs(newJobs);
			setTotalPages(res.totalPages);
			setTotalElements(res.totalElements);
			const initialJobId = search.jobId;
			if (!initialJobId && newJobs.length > 0) navigate({
				search: (prev) => ({
					...prev,
					jobId: Number(newJobs[0].id)
				}),
				replace: true
			});
			else if (newJobs.length === 0 && initialJobId) navigate({
				search: (prev) => ({
					...prev,
					jobId: void 0
				}),
				replace: true
			});
		}).catch((e) => setError(e.message)).finally(() => setLoading(false));
	}, [
		query,
		locationStr,
		skillIds,
		roleId,
		companyIds,
		remoteOnly,
		datePostedDays,
		types,
		salaryGe,
		salaryLe,
		page
	]);
	(0, import_react.useEffect)(() => {
		getCatalog().then(setCatalog).catch(() => {});
	}, []);
	function toggleType(t) {
		setTypes((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-b border-border bg-surface",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto max-w-[1400px] px-4 py-6 sm:px-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchBar, {
					defaultQuery: search.q || "",
					defaultLocation: search.location || "",
					catalog,
					onSearch: (q, loc, filters) => {
						setQuery(q);
						setLocationStr(loc);
						if (filters) {
							setSkillIds(filters.skillIds || []);
							setCompanyIds(filters.companyIds || []);
							setRoleId(filters.roleId);
						}
					}
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "sticky top-16 z-30 flex items-center gap-3 border-b border-border bg-background px-4 py-2 sm:px-6 lg:hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => setShowFilters((v) => !v),
				className: "inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "size-4" }), "Filters"]
			}), (types.length > 0 || remoteOnly || datePostedDays || salaryGe || salaryLe || skillIds.length > 0 || roleId || companyIds.length > 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground",
				children: "Active"
			})]
		}),
		showFilters && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-40 bg-black/40 lg:hidden",
			onClick: () => setShowFilters(false)
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-[1400px] gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,420px)_minmax(0,1fr)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: `space-y-6 ${showFilters ? "fixed inset-y-0 left-0 z-50 w-[280px] overflow-y-auto bg-background p-4 shadow-xl lg:relative lg:inset-auto lg:z-auto lg:w-auto lg:overflow-visible lg:p-0 lg:shadow-none" : "hidden lg:block"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between lg:hidden",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-semibold text-foreground",
								children: "Filters"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setShowFilters(false),
								className: "inline-flex size-8 items-center justify-center rounded-full hover:bg-accent",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterGroup, {
							title: "Job type",
							children: jobTypeFilters.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex cursor-pointer items-center gap-3 py-1.5 text-sm text-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: types.includes(t.value),
									onChange: () => toggleType(t.value),
									className: "size-4 rounded border-input accent-primary"
								}), t.label]
							}, t.value))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterGroup, {
							title: "Remote",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex cursor-pointer items-center gap-3 py-1.5 text-sm text-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: remoteOnly,
									onChange: () => setRemoteOnly((v) => !v),
									className: "size-4 rounded border-input accent-primary"
								}), "Remote only"]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterGroup, {
							title: "Date posted",
							children: dateFilters.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex cursor-pointer items-center gap-3 py-1.5 text-sm text-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "radio",
									name: "date-posted",
									checked: datePostedDays === d.days,
									onChange: () => setDatePostedDays(d.days),
									onClick: () => {
										if (datePostedDays === d.days) setDatePostedDays(null);
									},
									className: "size-4 accent-primary"
								}), d.label]
							}, d.days))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterGroup, {
							title: "Salary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "number",
										placeholder: "Min ₹",
										value: salaryGe ?? "",
										onChange: (e) => setSalaryGe(e.target.value ? Number(e.target.value) : void 0),
										className: "w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "-"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "number",
										placeholder: "Max ₹",
										value: salaryLe ?? "",
										onChange: (e) => setSalaryLe(e.target.value ? Number(e.target.value) : void 0),
										className: "w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
									})
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterGroup, {
							title: "Skills",
							children: catalog.skills.slice(0, 8).map((skill) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-3 py-1.5 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: skillIds.includes(skill.id),
									onChange: () => setSkillIds((ids) => ids.includes(skill.id) ? ids.filter((id) => id !== skill.id) : [...ids, skill.id]),
									className: "accent-primary"
								}), skill.name]
							}, skill.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterGroup, {
							title: "Roles",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: roleId ?? "",
								onChange: (e) => setRoleId(e.target.value ? Number(e.target.value) : void 0),
								className: "w-full rounded-lg border border-input bg-card px-3 py-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "All roles"
								}), catalog.roles.map((role) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: role.id,
									children: role.name
								}, role.id))]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterGroup, {
							title: "Companies",
							children: catalog.companies.slice(0, 8).map((company) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-3 py-1.5 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: company.backendId ? companyIds.includes(company.backendId) : false,
									onChange: () => company.backendId && setCompanyIds((ids) => ids.includes(company.backendId) ? ids.filter((id) => id !== company.backendId) : [...ids, company.backendId]),
									className: "accent-primary"
								}), company.name]
							}, company.backendId))
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "space-y-4",
					children: [
						loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Loading live jobs…"
						}),
						error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "rounded-lg bg-destructive/10 p-3 text-sm text-destructive",
							children: error
						}),
						!loading && !error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted-foreground",
							children: [
								totalElements,
								" ",
								totalElements === 1 ? "job" : "jobs"
							]
						}),
						jobs.length === 0 && !loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-card p-10 text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-lg font-semibold text-foreground",
								children: "No matching jobs"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted-foreground",
								children: "Try removing a filter or searching a different title."
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [jobs.map((job) => {
							const highlights = {
								salary: salaryGe !== void 0 || salaryLe !== void 0,
								remote: remoteOnly,
								skills: skillIds.map((id) => catalog.skills.find((s) => s.id === id)?.name?.toLowerCase()).filter(Boolean),
								types: types.map((t) => t.replaceAll("_", " ").toLowerCase())
							};
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JobCard, {
								job,
								selected: Number(job.id) === search.jobId,
								onSelect: (j) => navigate({
									search: (prev) => ({
										...prev,
										jobId: Number(j.id)
									}),
									replace: true
								}),
								highlights
							}, job.id);
						}), jobs.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 flex items-center justify-between border-t border-border pt-6 pb-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									disabled: page === 0,
									onClick: () => setPage((p) => Math.max(0, p - 1)),
									className: "rounded-lg border border-input px-4 py-2 text-sm font-semibold hover:bg-accent disabled:opacity-50 text-foreground bg-card",
									children: "Previous"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-sm text-muted-foreground",
									children: [
										"Page ",
										page + 1,
										" of ",
										Math.max(1, totalPages)
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									disabled: page >= totalPages - 1,
									onClick: () => setPage((p) => p + 1),
									className: "rounded-lg border border-input px-4 py-2 text-sm font-semibold hover:bg-accent disabled:opacity-50 text-foreground bg-card",
									children: "Next"
								})
							]
						})] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "hidden xl:block",
					children: fullJob ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-xl scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent shadow-sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JobDetailPanel, {
							job: fullJob,
							hasApplied: applications.some((a) => String(a.jobId) === String(fullJob.id)),
							highlights: {
								salary: salaryGe !== void 0 || salaryLe !== void 0,
								remote: remoteOnly,
								skills: skillIds.map((id) => catalog.skills.find((s) => s.id === id)?.name?.toLowerCase()).filter(Boolean),
								types: types.map((t) => t.replaceAll("_", " ").toLowerCase())
							}
						})
					}) : null
				})
			]
		})
	] });
}
function FilterGroup({ title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
		className: "group rounded-xl border border-border bg-card",
		open: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
			className: "flex cursor-pointer list-none items-center justify-between p-4 text-sm font-semibold text-foreground select-none [&::-webkit-details-marker]:hidden",
			children: [title, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
				className: "size-4 transition-transform group-open:rotate-180 text-muted-foreground",
				xmlns: "http://www.w3.org/2000/svg",
				width: "24",
				height: "24",
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", { points: "6 9 12 15 18 9" })
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "px-4 pb-4 animate-in fade-in slide-in-from-top-1",
			children
		})]
	});
}
//#endregion
export { JobsPage as component };
