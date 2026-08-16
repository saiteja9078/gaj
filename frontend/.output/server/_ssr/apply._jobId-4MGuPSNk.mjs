import { r as __toESM } from "../_runtime.mjs";
import { f as require_jsx_runtime, p as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as Flag, O as CircleCheck } from "../_libs/lucide-react.mjs";
import { B as getResumes, M as getCurrentCandidate, T as formatErrorMessage, _ as currentUserId, f as applyToJob, i as Route$7 } from "./router-BtZMXQ2R.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/apply._jobId-4MGuPSNk.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ApplyPage() {
	const { job } = Route$7.useLoaderData();
	const [candidate, setCandidate] = (0, import_react.useState)(null);
	const [resumes, setResumes] = (0, import_react.useState)([]);
	const [stage, setStage] = (0, import_react.useState)("review");
	const [alerts, setAlerts] = (0, import_react.useState)(false);
	const [coverLetter, setCoverLetter] = (0, import_react.useState)("");
	const [selectedResumeId, setSelectedResumeId] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		getCurrentCandidate().then((c) => {
			setCandidate(c);
			getResumes().then((rs) => {
				setResumes(rs);
				if (rs.length > 0) setSelectedResumeId(rs[0].id);
			}).catch(() => []);
		}).catch(() => setCandidate(null));
	}, []);
	async function submit() {
		const candidateId = currentUserId();
		if (!candidateId) {
			setError("Please sign in as a candidate before applying.");
			return;
		}
		setSubmitting(true);
		setError(null);
		try {
			await applyToJob(job.id, candidateId, coverLetter, selectedResumeId || void 0, alerts);
			setStage("submitted");
		} catch (e) {
			setError(formatErrorMessage(e, "Unable to submit application"));
		} finally {
			setSubmitting(false);
		}
	}
	const name = candidate ? `${candidate.firstName} ${candidate.lastName}` : "Candidate";
	const location = candidate?.location ? [
		candidate.location.city,
		candidate.location.state,
		candidate.location.country
	].filter(Boolean).join(", ") : "India";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-[640px] px-4 py-10 sm:px-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl border border-border bg-card p-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-xl font-bold text-foreground",
				children: job.title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-[15px] text-muted-foreground",
				children: [
					job.company,
					" - ",
					job.location
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6 rounded-xl border border-border bg-card p-6",
			children: stage === "submitted" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "py-10 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mx-auto size-14 text-success" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-6 font-display text-2xl font-bold text-foreground",
						children: "Application submitted"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-[15px] text-muted-foreground",
						children: [
							"Your application was sent to ",
							job.company,
							". You can track it from your dashboard."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/dashboard",
						className: "mt-8 inline-flex rounded-lg bg-primary px-8 py-3 text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-primary-hover",
						children: "Back to jobs"
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg font-bold text-foreground",
						children: "Contact information"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 rounded-lg border border-border p-4 text-[15px] text-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold",
								children: name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted-foreground",
								children: candidate?.email || "No email"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted-foreground",
								children: location
							})
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-lg font-bold text-foreground",
							children: "Resume"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/profile",
							className: "font-semibold text-primary hover:underline text-sm",
							children: "Manage resumes"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 space-y-3",
						children: resumes.length > 0 ? resumes.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: `flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${selectedResumeId === r.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-5 items-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "radio",
									name: "resume",
									checked: selectedResumeId === r.id,
									onChange: () => setSelectedResumeId(r.id),
									className: "text-primary focus:ring-primary h-4 w-4"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold text-[15px] text-foreground",
								children: r.fileName
							}), r.extractedText && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs leading-relaxed text-muted-foreground line-clamp-2",
								children: r.extractedText
							})] })]
						}, r.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-lg border border-border p-4 text-[15px] text-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "No resume uploaded. You can upload one under Profile."
							})
						})
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg font-bold text-foreground mb-2",
						children: "Cover Note (Optional)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						rows: 4,
						value: coverLetter,
						onChange: (e) => setCoverLetter(e.target.value),
						placeholder: "Introduce yourself or highlight relevant experience for this role…",
						className: "w-full rounded-lg border border-input bg-card px-4 py-3 text-[15px] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "flex items-start justify-between gap-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-lg font-bold text-foreground",
							children: "Get email updates for jobs matching this role"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: "Receive alerts when new jobs are posted that match this role."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							role: "switch",
							"aria-checked": alerts,
							"aria-label": "Get email updates",
							onClick: () => setAlerts((v) => !v),
							className: `mt-1 inline-flex h-7 w-12 shrink-0 items-center rounded-full border border-border p-0.5 transition-colors ${alerts ? "bg-primary" : "bg-secondary"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `size-6 rounded-full bg-white shadow transition-transform ${alerts ? "translate-x-5" : ""}` })
						})]
					}),
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-destructive",
						children: error
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: submit,
						disabled: submitting,
						className: "w-full rounded-lg bg-primary py-4 text-[16px] font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-50",
						children: submitting ? "Submitting…" : "Submit your application"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "flex items-center justify-center gap-2 text-sm text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, { className: "size-4" }),
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "underline",
								children: "Report an issue"
							})
						]
					})
				]
			}) })
		})]
	});
}
//#endregion
export { ApplyPage as component };
