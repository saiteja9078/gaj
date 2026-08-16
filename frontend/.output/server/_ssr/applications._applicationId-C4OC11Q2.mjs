import { r as __toESM } from "../_runtime.mjs";
import { f as require_jsx_runtime, p as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as ChevronLeft, M as Building2, N as Briefcase, S as IndianRupee, r as Users, y as MapPin } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { E as getApplicationDetails, a as Route$8, l as useTheme } from "./router-BtZMXQ2R.mjs";
import { t as esm_default } from "../_libs/@uiw/react-md-editor+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/applications._applicationId-C4OC11Q2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ApplicationDetailRoute() {
	const { applicationId } = Route$8.useParams();
	const [app, setApp] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const { resolvedTheme } = useTheme();
	(0, import_react.useEffect)(() => {
		async function load() {
			try {
				setLoading(true);
				const data = await getApplicationDetails(Number(applicationId));
				setApp(data);
			} catch (err) {
				toast.error("Failed to load application details.");
			} finally {
				setLoading(false);
			}
		}
		load();
	}, [applicationId]);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex h-screen items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted-foreground",
			children: "Loading application..."
		})
	});
	if (!app) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex h-screen items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted-foreground",
			children: "Application not found."
		})
	});
	const formatSalary = (min, max) => {
		if (!min && !max) return "Not specified";
		if (min && !max) return `₹${min.toLocaleString()}+`;
		if (!min && max) return `Up to ₹${max.toLocaleString()}`;
		return `₹${min.toLocaleString()} - ₹${max.toLocaleString()}`;
	};
	const steps = [
		"APPLIED",
		"SCREENING",
		"INTERVIEW",
		"OFFER"
	];
	const currentStepIndex = steps.indexOf(app.status.toUpperCase());
	const isRejected = app.status.toUpperCase() === "REJECTED";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-b border-border bg-card",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto max-w-5xl px-4 py-4 sm:px-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/dashboard",
					className: "inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4" }), "Back to Dashboard"]
				})
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "mx-auto max-w-5xl px-4 py-8 sm:px-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-8 md:grid-cols-[1fr_2fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-card p-6 shadow-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-lg font-bold text-foreground mb-4",
									children: "Application Status"
								}),
								isRejected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg bg-destructive/10 p-4 border border-destructive/20 text-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-semibold text-destructive",
										children: "Rejected"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted-foreground mt-1",
										children: "Unfortunately, the company has decided to move forward with other candidates."
									})]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-4",
									children: steps.map((step, index) => {
										const isActive = index === currentStepIndex;
										const isPast = index < currentStepIndex;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: `flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold
                          ${isActive ? "border-primary bg-primary text-primary-foreground" : isPast ? "border-primary bg-primary/20 text-primary" : "border-border text-muted-foreground"}`,
												children: index + 1
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: `font-semibold capitalize ${isActive || isPast ? "text-foreground" : "text-muted-foreground"}`,
												children: step.toLowerCase()
											}), isActive && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted-foreground mt-0.5",
												children: "Current Phase"
											})] })]
										}, step);
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-6 pt-6 border-t border-border",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted-foreground mb-1",
										children: "Applied on"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-semibold text-foreground",
										children: new Date(app.appliedAt).toLocaleDateString()
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-card p-6 shadow-sm flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground mb-1",
								children: "Total Applicants"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-2xl font-bold text-foreground",
									children: app.totalApplicants
								})]
							})] }), app.totalApplicants > 10 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground",
								children: "High Demand"
							})]
						}),
						app.coverLetter && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-card p-6 shadow-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display font-semibold text-foreground mb-3",
								children: "Cover Letter Submitted"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground whitespace-pre-wrap",
								children: app.coverLetter
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "space-y-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-card p-8 shadow-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display text-3xl font-bold text-foreground",
								children: app.jobTitle
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: `/companies/${app.companyId}`,
										className: "hover:text-primary hover:underline",
										children: app.companyName
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-4" }), app.jobLocation ? `${app.jobLocation.city}, ${app.jobLocation.country}` : "Remote"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-8 grid gap-4 sm:grid-cols-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg bg-secondary/50 p-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "size-5 text-muted-foreground mb-2" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-muted-foreground",
											children: "Work Mode"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-semibold text-foreground capitalize",
											children: app.jobWorkMode?.toLowerCase().replace("_", " ") || "Not specified"
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg bg-secondary/50 p-4 sm:col-span-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IndianRupee, { className: "size-5 text-muted-foreground mb-2" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-muted-foreground",
											children: "Salary Range"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-semibold text-foreground",
											children: formatSalary(app.jobSalaryLower, app.jobSalaryHigher)
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-8 border-t border-border pt-8",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display text-lg font-bold text-foreground mb-4",
									children: "Job Description"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									"data-color-mode": resolvedTheme,
									className: "text-[15px] leading-relaxed text-foreground",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(esm_default.Markdown, {
										source: app.jobDescription,
										style: {
											backgroundColor: "transparent",
											color: "inherit"
										}
									})
								})]
							})
						]
					})
				})]
			})
		})]
	});
}
//#endregion
export { ApplicationDetailRoute as component };
