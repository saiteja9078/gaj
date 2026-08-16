import { r as __toESM } from "../_runtime.mjs";
import { f as require_jsx_runtime, p as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { N as getCurrentCompany, T as formatErrorMessage, q as updateCompany } from "./router-BtZMXQ2R.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/company.profile-BRMSBEIk.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CompanyProfilePage() {
	const [company, setCompany] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [saving, setSaving] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		getCurrentCompany().then(setCompany).catch(() => setCompany(null)).finally(() => setLoading(false));
	}, []);
	async function handleSubmit(e) {
		e.preventDefault();
		if (!company) return;
		const form = new FormData(e.currentTarget);
		setSaving(true);
		try {
			const updated = await updateCompany({
				name: String(form.get("name") || ""),
				companyProfileUrl: String(form.get("companyProfileUrl") || ""),
				email: String(form.get("email") || "")
			});
			setCompany(updated);
			toast.success("Company profile saved.");
		} catch (err) {
			toast.error(formatErrorMessage(err, "Failed to save profile"));
		} finally {
			setSaving(false);
		}
	}
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-[720px] px-4 py-12 text-muted-foreground",
		children: "Loading company profile…"
	});
	if (!company) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-[720px] px-4 py-12 text-muted-foreground",
		children: "Please sign in as a company to edit profile settings."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-[720px] px-4 py-12 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-bold text-foreground sm:text-4xl",
				children: "Company profile"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-[15px] text-muted-foreground",
				children: "This is what candidates see on your job listings."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "mt-8 space-y-4 rounded-xl border border-border bg-card p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Company name",
						name: "name",
						defaultValue: company.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Website / Profile URL",
						name: "companyProfileUrl",
						defaultValue: company.companyProfileUrl || ""
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Contact Email",
						name: "email",
						defaultValue: company.email || ""
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: saving,
						className: "w-full rounded-lg bg-primary py-3 text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-50",
						children: saving ? "Saving…" : "Save changes"
					})
				]
			})
		]
	});
}
function Field({ label, name, defaultValue }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "mb-1.5 block text-sm font-medium text-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			name,
			defaultValue,
			className: "w-full rounded-lg border border-input bg-card px-4 py-2.5 text-[15px] text-foreground focus:border-primary focus:outline-none"
		})]
	});
}
//#endregion
export { CompanyProfilePage as component };
