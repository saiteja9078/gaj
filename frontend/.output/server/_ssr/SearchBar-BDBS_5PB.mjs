import { r as __toESM } from "../_runtime.mjs";
import { f as require_jsx_runtime, p as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { p as Search, y as MapPin } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/SearchBar-BDBS_5PB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SearchBar({ defaultQuery = "", defaultLocation = "", catalog, onSearch }) {
	const [query, setQuery] = (0, import_react.useState)(defaultQuery);
	const [location, setLocation] = (0, import_react.useState)(defaultLocation);
	const [showSuggestions, setShowSuggestions] = (0, import_react.useState)(false);
	const [tokens, setTokens] = (0, import_react.useState)([]);
	const containerRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		function handleClickOutside(e) {
			if (containerRef.current && !containerRef.current.contains(e.target)) setShowSuggestions(false);
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);
	function handleSubmit(e) {
		e.preventDefault();
		setShowSuggestions(false);
		const skillIds = tokens.filter((t) => t.type === "skill").map((t) => t.item.id);
		const companyIds = tokens.filter((t) => t.type === "company").map((t) => t.item.backendId).filter(Boolean);
		const roleToken = tokens.find((t) => t.type === "role");
		const roleId = roleToken ? roleToken.item.id : void 0;
		onSearch?.(query, location, {
			skillIds,
			companyIds,
			roleId
		});
	}
	function handleSelectSuggestion(suggestion) {
		const suggestionId = suggestion.type === "company" ? suggestion.item.backendId : suggestion.item.id;
		if (!tokens.some((t) => {
			return (t.type === "company" ? t.item.backendId : t.item.id) === suggestionId && t.type === suggestion.type;
		})) setTokens([...tokens, suggestion]);
		setQuery("");
		setShowSuggestions(false);
	}
	const suggestions = [];
	if (catalog && query.trim().length > 0) {
		const q = query.toLowerCase();
		catalog.roles.filter((r) => r.name.toLowerCase().includes(q)).forEach((r) => suggestions.push({
			type: "role",
			item: r
		}));
		catalog.skills.filter((s) => s.name.toLowerCase().includes(q)).forEach((s) => suggestions.push({
			type: "skill",
			item: s
		}));
		catalog.companies.filter((c) => c.name.toLowerCase().includes(q)).forEach((c) => suggestions.push({
			type: "company",
			item: c
		}));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		ref: containerRef,
		onSubmit: handleSubmit,
		className: "relative flex flex-col gap-2 rounded-2xl border border-border bg-card p-2 shadow-sm md:flex-row md:items-center md:rounded-full md:pl-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex flex-1 items-center gap-2 px-3 py-2 md:px-0 flex-wrap md:flex-nowrap",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-5 shrink-0 text-muted-foreground" }),
					tokens.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-1 overflow-x-auto no-scrollbar items-center shrink-0 max-w-[200px] md:max-w-xs",
						children: tokens.map((t, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1 rounded-md bg-accent px-2 py-1 text-xs font-medium text-foreground whitespace-nowrap",
							children: [t.item.name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: (e) => {
									e.preventDefault();
									e.stopPropagation();
									setTokens(tokens.filter((_, i) => i !== idx));
								},
								className: "text-muted-foreground hover:text-foreground",
								children: "×"
							})]
						}, idx))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: query,
						onChange: (e) => {
							setQuery(e.target.value);
							setShowSuggestions(true);
						},
						onKeyDown: (e) => {
							if (e.key === "Backspace" && query === "" && tokens.length > 0) setTokens(tokens.slice(0, -1));
						},
						onFocus: () => setShowSuggestions(true),
						placeholder: "Job title, keywords, or company",
						className: "w-full bg-transparent min-w-[120px] text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none"
					}),
					showSuggestions && suggestions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute left-0 top-full mt-4 w-full md:w-[200%] z-50 overflow-y-auto overflow-x-hidden rounded-xl border border-border bg-card shadow-lg max-h-[300px]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "px-3 py-1.5 text-xs font-semibold text-muted-foreground",
								children: "Suggestions"
							}), suggestions.slice(0, 15).map((s, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onMouseDown: (e) => {
									e.preventDefault();
									handleSelectSuggestion(s);
								},
								className: "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-[15px] text-foreground transition-colors hover:bg-accent",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate pr-4",
									children: s.item.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "shrink-0 text-xs capitalize text-muted-foreground",
									children: s.type
								})]
							}, `${s.type}-${s.type === "company" ? s.item.backendId : s.item.id}-${idx}`))]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "hidden h-8 w-px bg-border md:block" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-1 items-center gap-3 px-3 py-2 md:px-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-5 shrink-0 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: location,
					onChange: (e) => setLocation(e.target.value),
					placeholder: "City, state, zip code, or \"remote\"",
					className: "w-full bg-transparent text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "submit",
				className: "rounded-full bg-primary px-7 py-3 text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-primary-hover",
				children: "Find jobs"
			})
		]
	});
}
//#endregion
export { SearchBar as t };
