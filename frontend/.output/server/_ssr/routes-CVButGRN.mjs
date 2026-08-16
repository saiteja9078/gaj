import { r as __toESM } from "../_runtime.mjs";
import { f as require_jsx_runtime, p as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { _ as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { L as ArrowRight, M as Building2, p as Search, r as Users, u as Star } from "../_libs/lucide-react.mjs";
import { H as listJobs, V as listCompanies, c as useRole, k as getCatalog, s as ROLE_HOME } from "./router-BtZMXQ2R.mjs";
import { t as SearchBar } from "./SearchBar-BDBS_5PB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CVButGRN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Landing() {
	const navigate = useNavigate();
	const { role } = useRole();
	const [jobs, setJobs] = (0, import_react.useState)([]);
	const [companies, setCompanies] = (0, import_react.useState)([]);
	const [categories, setCategories] = (0, import_react.useState)([]);
	const [catalog, setCatalog] = (0, import_react.useState)({
		skills: [],
		roles: [],
		industries: [],
		companies: []
	});
	(0, import_react.useEffect)(() => {
		if (role) {
			navigate({
				to: ROLE_HOME[role],
				replace: true
			});
			return;
		}
		listJobs().then(setJobs).catch(() => {});
		listCompanies().then(setCompanies).catch(() => {});
		getCatalog().then((cat) => {
			setCategories(cat.roles);
			setCatalog(cat);
		}).catch(() => {});
	}, [role, navigate]);
	if (role) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "border-b border-border bg-surface",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-[1100px] px-4 py-20 text-center sm:px-6 sm:py-28",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "font-display text-4xl font-bold leading-tight text-foreground sm:text-6xl",
						children: [
							"Work you want,",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							"people you need."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mx-auto mt-6 max-w-xl text-[17px] leading-relaxed text-muted-foreground",
						children: "One place for candidates, hiring managers, and companies. Search openings, track applicants, and post roles without the noise."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto mt-10 max-w-3xl",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchBar, {
							catalog,
							onSearch: (q, loc, filters) => {
								navigate({
									to: "/jobs",
									search: {
										q: q || void 0,
										location: loc || void 0,
										roleId: filters?.roleId,
										companyIds: filters?.companyIds?.length ? filters.companyIds : void 0,
										skillIds: filters?.skillIds?.length ? filters.skillIds : void 0
									}
								});
							}
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 flex flex-wrap justify-center gap-2",
						children: categories.slice(0, 8).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/jobs",
							search: { roleId: c.id },
							className: "rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-foreground",
							children: c.name
						}, c.id))
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "mx-auto max-w-[1100px] px-4 py-16 sm:px-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 md:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ValueProp, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-5" }),
						title: "Jobs that fit",
						children: "Matches based on the pay, schedule, and location you actually want — no endless filters."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ValueProp, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-5" }),
						title: "A pipeline you can read",
						children: "Hiring managers see every applicant by stage, with notes and next steps in one view."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ValueProp, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "size-5" }),
						title: "Company profiles that help",
						children: "Ratings, reviews, and open roles together, so candidates decide with real information."
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "border-y border-border bg-surface",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-[1100px] px-4 py-16 sm:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-end justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl font-bold text-foreground",
						children: "Featured jobs"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/jobs",
						className: "inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline",
						children: ["See all jobs ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 grid gap-4 md:grid-cols-3",
					children: jobs.slice(0, 3).map((job) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/jobs",
						className: "rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-lg font-semibold text-foreground",
								children: job.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: job.company
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: job.location
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 text-sm font-medium text-foreground",
								children: job.payLabel
							})
						]
					}, job.id))
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-[1100px] px-4 py-16 sm:px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl font-bold text-foreground",
				children: "Companies hiring now"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: companies.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/companies/$slug",
					params: { slug: c.slug },
					className: "rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display font-semibold text-foreground",
							children: c.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 flex items-center gap-1 text-sm text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-4 fill-current text-chart-4" }),
								" ",
								c.industry
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm text-muted-foreground",
							children: c.location
						})
					]
				}, c.slug))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "border-t border-border bg-surface",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto grid max-w-[1100px] gap-4 px-4 py-16 sm:px-6 md:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CtaCard, {
					title: "I'm looking for work",
					body: "Build a profile, save jobs, and apply in a couple of clicks.",
					to: "/signup",
					cta: "Create a candidate account"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CtaCard, {
					title: "I'm hiring",
					body: "Post roles, review applicants, and move people through your pipeline.",
					to: "/signup",
					cta: "Get started as an employer"
				})]
			})
		})
	] });
}
function ValueProp({ icon, title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-card p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "inline-flex size-10 items-center justify-center rounded-lg bg-info-muted text-info-muted-foreground",
				children: icon
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-4 font-display text-lg font-semibold text-foreground",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm leading-relaxed text-muted-foreground",
				children
			})
		]
	});
}
function CtaCard({ title, body, to, cta }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-card p-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-display text-xl font-bold text-foreground",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-[15px] text-muted-foreground",
				children: body
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to,
				className: "mt-6 inline-flex rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover",
				children: cta
			})
		]
	});
}
//#endregion
export { Landing as component };
