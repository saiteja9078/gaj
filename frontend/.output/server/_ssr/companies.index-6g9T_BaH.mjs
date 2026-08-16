import { r as __toESM } from "../_runtime.mjs";
import { f as require_jsx_runtime, p as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as Star } from "../_libs/lucide-react.mjs";
import { V as listCompanies } from "./router-BtZMXQ2R.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/companies.index-6g9T_BaH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CompaniesPage() {
	const [query, setQuery] = (0, import_react.useState)("");
	const [companies, setCompanies] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		listCompanies().then(setCompanies).catch((e) => setError(e.message)).finally(() => setLoading(false));
	}, []);
	const results = companies.filter((c) => c.name.toLowerCase().includes(query.trim().toLowerCase()));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-[900px] px-4 py-12 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl font-bold text-foreground",
				children: "Company reviews"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-[17px] text-muted-foreground",
				children: "Find out what it's really like to work somewhere before you apply."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value: query,
				onChange: (e) => setQuery(e.target.value),
				placeholder: "Search company name",
				className: "mt-8 w-full rounded-xl border border-input bg-card px-4 py-3 text-[15px] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-8 rounded-lg bg-destructive/10 p-3 text-sm text-destructive",
				children: error
			}),
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-8 text-center text-sm text-muted-foreground",
				children: "Loading companies…"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 space-y-4",
				children: [results.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/companies/$slug",
					params: { slug: c.slug },
					className: "block rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl font-semibold text-foreground",
							children: c.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1.5 text-sm text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-4 fill-current text-chart-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-foreground",
								children: c.rating || "N/A"
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: [
							c.industry,
							" ",
							c.location ? `· ${c.location}` : ""
						]
					})]
				}, c.slug)), results.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground",
					children: "No companies match that search."
				})]
			})
		]
	});
}
//#endregion
export { CompaniesPage as component };
