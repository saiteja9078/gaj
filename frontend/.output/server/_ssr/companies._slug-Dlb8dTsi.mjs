import { r as __toESM } from "../_runtime.mjs";
import { f as require_jsx_runtime, p as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as Star } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { T as formatErrorMessage, d as addCompanyReview, j as getCompanyReviews, r as Route$5 } from "./router-BtZMXQ2R.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/companies._slug-Dlb8dTsi.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CompanyDetail() {
	const { company, jobs: companyJobs } = Route$5.useLoaderData();
	const [reviews, setReviews] = (0, import_react.useState)([]);
	const [loadingReviews, setLoadingReviews] = (0, import_react.useState)(true);
	const [showAddReview, setShowAddReview] = (0, import_react.useState)(false);
	const [rating, setRating] = (0, import_react.useState)(5);
	const [comment, setComment] = (0, import_react.useState)("");
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (company.backendId) getCompanyReviews(company.backendId).then(setReviews).catch(() => setReviews([])).finally(() => setLoadingReviews(false));
		else setLoadingReviews(false);
	}, [company.backendId]);
	async function handleAddReview(e) {
		e.preventDefault();
		if (!company.backendId) return;
		if (!comment.trim()) {
			toast.error("Please provide a review comment.");
			return;
		}
		setSubmitting(true);
		try {
			const newRev = await addCompanyReview(company.backendId, rating, comment.trim());
			setReviews([newRev, ...reviews]);
			toast.success("Review posted!");
			setComment("");
			setShowAddReview(false);
		} catch (err) {
			toast.error(formatErrorMessage(err, "Must be signed in as a candidate to review"));
		} finally {
			setSubmitting(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-[900px] px-4 py-12 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/companies",
				className: "text-sm text-primary hover:underline",
				children: "← All companies"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-4 font-display text-4xl font-bold text-foreground",
				children: company.name
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-[15px] text-muted-foreground",
				children: [
					company.industry,
					" ",
					company.location ? `· ${company.location}` : ""
				]
			}),
			company.about && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-[15px] leading-relaxed text-foreground",
				children: company.about
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "mt-12 font-display text-2xl font-bold text-foreground",
				children: [
					"Open roles (",
					companyJobs.length,
					")"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 space-y-3",
				children: companyJobs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "No live roles right now."
				}) : companyJobs.map((j) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/apply/$jobId",
					params: { jobId: j.id },
					className: "block rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-lg font-semibold text-foreground",
						children: j.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: [
							j.location,
							" · ",
							j.payLabel
						]
					})]
				}, j.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-12 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "font-display text-2xl font-bold text-foreground",
					children: [
						"Reviews (",
						reviews.length,
						")"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setShowAddReview(!showAddReview),
					className: "rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-hover",
					children: "Write a review"
				})]
			}),
			showAddReview && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleAddReview,
				className: "mt-4 space-y-4 rounded-xl border border-border bg-card p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "font-semibold text-foreground text-sm",
						children: "Write a Company Review"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs text-muted-foreground mb-1",
						children: "Rating (1 to 5)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: rating,
						onChange: (e) => setRating(Number(e.target.value)),
						className: "w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: 5,
								children: "5 Stars - Excellent"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: 4,
								children: "4 Stars - Good"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: 3,
								children: "3 Stars - Average"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: 2,
								children: "2 Stars - Poor"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: 1,
								children: "1 Star - Terrible"
							})
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs text-muted-foreground mb-1",
						children: "Comment"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						rows: 4,
						value: comment,
						onChange: (e) => setComment(e.target.value),
						placeholder: "Share your experience working at or interviewing with this company…",
						className: "w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: submitting,
							className: "rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-hover",
							children: submitting ? "Submitting…" : "Submit Review"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setShowAddReview(false),
							className: "rounded-lg border border-input px-4 py-2 text-xs font-semibold text-foreground hover:bg-accent",
							children: "Cancel"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 space-y-4",
				children: loadingReviews ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Loading reviews…"
				}) : reviews.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "No reviews posted yet."
				}) : reviews.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-xl border border-border bg-card p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center gap-1",
							children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: `size-4 ${i < r.stars ? "fill-current text-chart-4" : "text-border"}` }, i))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-xs text-muted-foreground",
							children: [
								"By ",
								r.candidateName || "Candidate",
								" · ",
								new Date(r.createdAt).toLocaleDateString()
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-[15px] leading-relaxed text-foreground",
							children: r.text
						})
					]
				}, r.id))
			})
		]
	});
}
//#endregion
export { CompanyDetail as component };
