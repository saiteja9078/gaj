import { f as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { D as Copy, N as Briefcase, P as Bookmark, c as ThumbsDown, j as ChevronDown, n as Wallet } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { l as useTheme } from "./router-BtZMXQ2R.mjs";
import { t as esm_default } from "../_libs/@uiw/react-md-editor+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/JobDetailPanel-VDQuoslb.js
var import_jsx_runtime = require_jsx_runtime();
function JobCard({ job, selected = false, onSelect, highlights }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		onClick: () => onSelect?.(job),
		className: `relative cursor-pointer rounded-xl border bg-card p-5 transition-shadow hover:shadow-md ${selected ? "border-primary ring-1 ring-primary" : "border-border"}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [
					job.easyApply && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "inline-block rounded-md bg-info-muted px-2 py-1 text-xs font-semibold text-info-muted-foreground",
						children: "Easily apply"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-3 font-display text-xl font-semibold text-foreground",
						children: job.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-[15px] text-muted-foreground",
						children: job.company
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[15px] text-muted-foreground",
						children: [
							job.location,
							" · ",
							job.postedAt
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex shrink-0 flex-col gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
					label: "Save job",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "size-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
					label: "Not interested",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThumbsDown, { className: "size-5" })
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 flex flex-wrap items-center gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: `inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium ${highlights?.salary ? "bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400" : "bg-secondary text-secondary-foreground"}`,
					children: job.payLabel
				}),
				job.jobTypes.slice(0, 1).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
					active: highlights?.types?.includes(t.toLowerCase()),
					children: t
				}, t)),
				job.jobTypes.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Chip, { children: ["+", job.jobTypes.length - 1] }),
				job.tags.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
					active: highlights?.remote && t === "Work from home",
					children: t
				}, t))
			]
		})]
	});
}
function Chip({ children, active }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `rounded-md px-3 py-1.5 text-sm font-medium ${active ? "bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400" : "bg-secondary text-secondary-foreground"}`,
		children
	});
}
function IconButton({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-label": label,
		onClick: (e) => e.stopPropagation(),
		className: "inline-flex size-8 items-center justify-center rounded-full text-foreground/70 transition-colors hover:bg-accent hover:text-foreground",
		children
	});
}
function JobDetailPanel({ job, hasApplied, highlights }) {
	const { resolvedTheme } = useTheme();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "overflow-hidden rounded-xl border border-border bg-card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-7",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-3xl font-bold text-foreground",
						children: job.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-[17px] text-muted-foreground",
						children: job.company
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[17px] text-muted-foreground",
						children: job.location
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[17px] text-muted-foreground",
						children: [
							job.payLabel,
							" · Posted ",
							job.postedAt
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex flex-wrap items-center gap-3",
						children: [hasApplied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-lg bg-secondary px-6 py-3 text-[15px] font-semibold text-secondary-foreground",
							children: "Applied"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/apply/$jobId",
							params: { jobId: job.id },
							className: "rounded-lg bg-primary px-6 py-3 text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-primary-hover",
							children: "Apply with Hirely"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoundButton, {
							label: "Copy link",
							onClick: () => {
								const url = `${window.location.origin}/jobs?jobId=${job.id}`;
								if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(url).then(() => toast.success("Link copied to clipboard!")).catch(() => toast.error("Failed to copy link"));
								else try {
									const textArea = document.createElement("textarea");
									textArea.value = url;
									textArea.style.position = "fixed";
									textArea.style.left = "-9999px";
									document.body.appendChild(textArea);
									textArea.focus();
									textArea.select();
									document.execCommand("copy");
									document.body.removeChild(textArea);
									toast.success("Link copied to clipboard!");
								} catch (err) {
									toast.error("Failed to copy link");
								}
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-5" })
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-t border-border p-7",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-2xl font-bold text-foreground",
						children: "Job details"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: [
							"Here's how the job details align with your",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/profile",
								className: "text-primary underline underline-offset-2",
								children: "profile"
							}),
							"."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex items-start gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "mt-1 size-5 text-foreground/70" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold text-foreground",
							children: "Pay"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `mt-2 inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium ${highlights?.salary ? "bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400" : "bg-secondary text-secondary-foreground"}`,
							children: job.payLabel
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex items-start gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "mt-1 size-5 text-foreground/70" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold text-foreground",
							children: "Job type"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 flex flex-wrap gap-2",
							children: job.jobTypes.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: `inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium ${highlights?.types?.includes(t.toLowerCase()) ? "bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400" : "bg-secondary text-secondary-foreground"}`,
								children: [t, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-4 opacity-60" })]
							}, t))
						})] })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-t border-border p-7",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-2xl font-bold text-foreground",
						children: "Benefits"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Pulled from the full job description"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 space-y-2",
						children: job.benefits.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "text-[15px] text-foreground",
							children: b
						}, b))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-t border-border p-7",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-2xl font-bold text-foreground",
						children: "Requirements"
					}),
					job.experience && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold text-foreground text-[15px]",
							children: "Minimum Experience"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-[15px] text-muted-foreground",
							children: job.experience
						})]
					}),
					job.skills && job.skills.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold text-foreground text-[15px]",
							children: "Skills"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 flex flex-wrap gap-2",
							children: job.skills.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: `inline-flex items-center rounded-md px-2.5 py-1 text-sm font-medium ${highlights?.skills?.includes(s.name.toLowerCase()) ? "bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400" : "bg-secondary text-secondary-foreground"}`,
								children: [
									s.name,
									" ",
									s.required ? "(Required)" : "(Preferred)"
								]
							}, s.name))
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-t border-border p-7",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-2xl font-bold text-foreground",
						children: "Full job description"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						"data-color-mode": resolvedTheme,
						className: "mt-4 text-[15px] leading-relaxed text-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(esm_default.Markdown, {
							source: job.description,
							style: {
								backgroundColor: "transparent",
								color: "inherit"
							}
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 list-disc space-y-2 pl-5 text-[15px] text-foreground",
						children: job.responsibilities.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: r }, r))
					})
				]
			})
		]
	});
}
function RoundButton({ label, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		"aria-label": label,
		className: "inline-flex size-12 items-center justify-center rounded-lg bg-secondary text-secondary-foreground transition-colors hover:bg-accent",
		children
	});
}
//#endregion
export { JobDetailPanel as n, JobCard as t };
