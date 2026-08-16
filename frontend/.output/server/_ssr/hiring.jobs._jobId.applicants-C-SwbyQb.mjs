import { r as __toESM } from "../_runtime.mjs";
import { f as require_jsx_runtime, p as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { C as downloadApplicationResumeBlob, G as updateApplicationStatus, L as getJobApplicants, T as formatErrorMessage, n as Route } from "./router-BtZMXQ2R.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/hiring.jobs._jobId.applicants-C-SwbyQb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var stageOptions = [
	"APPLIED",
	"SCREENING",
	"INTERVIEW",
	"OFFER",
	"REJECTED"
];
function ApplicantsPage() {
	const { job } = Route.useLoaderData();
	const [list, setList] = (0, import_react.useState)([]);
	const [selectedId, setSelectedId] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [resumeBlobUrl, setResumeBlobUrl] = (0, import_react.useState)(null);
	const [loadingResume, setLoadingResume] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (resumeBlobUrl) {
			URL.revokeObjectURL(resumeBlobUrl);
			setResumeBlobUrl(null);
		}
	}, [selectedId]);
	(0, import_react.useEffect)(() => {
		getJobApplicants(job.id).then((apps) => {
			setList(apps);
			if (apps.length > 0) setSelectedId(apps[0].applicationId);
		}).catch(() => setList([])).finally(() => setLoading(false));
	}, [job.id]);
	const selected = list.find((a) => a.applicationId === selectedId) ?? list[0];
	async function handleSetStage(applicationId, status) {
		try {
			await updateApplicationStatus(applicationId, status);
			setList((prev) => prev.map((a) => a.applicationId === applicationId ? {
				...a,
				status
			} : a));
			toast.success(`Application status updated to ${status.toLowerCase()}`);
		} catch (err) {
			toast.error(formatErrorMessage(err, "Failed to update application status"));
		}
	}
	async function handleViewResume(applicationId) {
		try {
			setLoadingResume(true);
			const blob = await downloadApplicationResumeBlob(applicationId);
			const url = URL.createObjectURL(blob);
			setResumeBlobUrl(url);
		} catch (err) {
			toast.error(formatErrorMessage(err, "Failed to load resume"));
		} finally {
			setLoadingResume(false);
		}
	}
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-[1200px] px-4 py-10 sm:px-6 text-muted-foreground",
		children: "Loading applicants…"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-[1200px] px-4 py-10 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/hiring",
				className: "text-sm text-primary hover:underline",
				children: "← Hiring dashboard"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-4 font-display text-3xl font-bold text-foreground",
				children: job.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-[15px] text-muted-foreground",
				children: [
					job.company,
					" · ",
					list.length,
					" applicants"
				]
			}),
			list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 rounded-xl border border-border bg-card p-10 text-center text-muted-foreground",
				children: "No applicants for this role yet."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3",
					children: list.map((a) => {
						const fullName = `${a.firstName || ""} ${a.lastName || ""}`.trim() || "Candidate";
						const initials = `${a.firstName?.[0] || ""}${a.lastName?.[0] || ""}` || "C";
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setSelectedId(a.applicationId),
							className: `flex w-full items-center gap-4 rounded-xl border bg-card p-5 text-left transition-shadow hover:shadow-md ${selected?.applicationId === a.applicationId ? "border-primary ring-1 ring-primary" : "border-border"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex size-11 shrink-0 items-center justify-center rounded-full bg-secondary font-semibold text-secondary-foreground",
									children: initials
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block font-semibold text-foreground",
										children: fullName
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-sm text-muted-foreground",
										children: a.email
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "shrink-0 rounded-md bg-secondary px-2.5 py-1 text-xs font-medium capitalize text-secondary-foreground",
									children: a.status.toLowerCase()
								})
							]
						}, a.applicationId);
					})
				}), selected && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-6 lg:sticky lg:top-24 lg:self-start",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl font-bold text-foreground",
							children: `${selected.firstName || ""} ${selected.lastName || ""}`.trim() || "Candidate"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-[15px] text-muted-foreground",
							children: [
								selected.email,
								" · ",
								selected.location?.city ? `${selected.location.city}, ${selected.location.country || ""}` : selected.location?.country || "India"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: ["Applied ", selected.appliedAt]
						}),
						selected.description && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold text-muted-foreground mb-2",
								children: "About:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-foreground whitespace-pre-wrap",
								children: selected.description
							})]
						}),
						selected.skills && selected.skills.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold text-muted-foreground mb-2",
								children: "Candidate Skills:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-1.5",
								children: selected.skills.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "rounded-md bg-secondary px-2.5 py-1 text-xs text-secondary-foreground font-medium",
									children: [
										s.name,
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "opacity-70",
											children: [
												"(",
												s.proficiency.toLowerCase(),
												")"
											]
										})
									]
								}, i))
							})]
						}),
						selected.experiences && selected.experiences.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold text-muted-foreground mb-2",
								children: "Experience:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-3",
								children: selected.experiences.map((exp, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg border border-border p-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-semibold text-sm text-foreground",
											children: exp.roleName
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: exp.organizationName || exp.companyName
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-muted-foreground mt-0.5",
											children: [
												new Date(exp.fromDate).toLocaleDateString(),
												" - ",
												exp.toDate ? new Date(exp.toDate).toLocaleDateString() : "Present"
											]
										}),
										exp.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-2 text-xs text-muted-foreground whitespace-pre-wrap",
											children: exp.description
										})
									]
								}, i))
							})]
						}),
						selected.coverLetter && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold text-muted-foreground mb-2",
								children: "Cover Letter:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-lg bg-secondary/40 p-3 text-xs text-muted-foreground max-h-48 overflow-y-auto whitespace-pre-wrap",
								children: selected.coverLetter
							})]
						}),
						selected.resumeId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-5",
							children: !resumeBlobUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => handleViewResume(selected.applicationId),
								disabled: loadingResume,
								className: "inline-flex items-center justify-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/20 transition-colors disabled:opacity-50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
									xmlns: "http://www.w3.org/2000/svg",
									width: "16",
									height: "16",
									viewBox: "0 0 24 24",
									fill: "none",
									stroke: "currentColor",
									strokeWidth: "2",
									strokeLinecap: "round",
									strokeLinejoin: "round",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", { points: "14 2 14 8 20 8" })]
								}), loadingResume ? "Loading..." : selected.resumeName ? `View Resume (${selected.resumeName})` : "View Resume"]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between items-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-semibold text-muted-foreground",
										children: "Resume Preview:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: resumeBlobUrl,
										download: selected.resumeName || "resume.pdf",
										className: "inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
											xmlns: "http://www.w3.org/2000/svg",
											width: "14",
											height: "14",
											viewBox: "0 0 24 24",
											fill: "none",
											stroke: "currentColor",
											strokeWidth: "2",
											strokeLinecap: "round",
											strokeLinejoin: "round",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", { points: "7 10 12 15 17 10" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
													x1: "12",
													y1: "15",
													x2: "12",
													y2: "3"
												})
											]
										}), "Download PDF"]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
									src: resumeBlobUrl,
									className: "w-full rounded-lg border bg-card",
									style: { height: "500px" },
									title: "Resume Preview"
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-8 text-sm font-semibold text-foreground",
							children: "Move to stage"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 flex flex-wrap gap-2",
							children: stageOptions.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => handleSetStage(selected.applicationId, s),
								className: `rounded-lg border px-4 py-2 text-xs font-medium capitalize transition-colors ${selected.status === s ? "border-primary bg-primary text-primary-foreground" : "border-input text-foreground hover:bg-accent"}`,
								children: s.toLowerCase()
							}, s))
						})
					]
				})]
			})
		]
	});
}
//#endregion
export { ApplicantsPage as component };
