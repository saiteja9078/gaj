import { r as __toESM } from "../_runtime.mjs";
import { f as require_jsx_runtime, p as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { _ as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { M as Building2, N as Briefcase, a as UserRound } from "../_libs/lucide-react.mjs";
import { T as formatErrorMessage, c as useRole, k as getCatalog, p as authenticate, s as ROLE_HOME } from "./router-BtZMXQ2R.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AuthForm-DQLlBcNA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var roleOptions = [
	{
		value: "candidate",
		label: "Candidate",
		blurb: "Find jobs and track applications",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, { className: "size-5" })
	},
	{
		value: "hiring",
		label: "Hiring Manager",
		blurb: "Review applicants and run interviews",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "size-5" })
	},
	{
		value: "company",
		label: "Company",
		blurb: "Post jobs and manage your profile",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "size-5" })
	}
];
function AuthForm({ mode }) {
	const [selected, setSelected] = (0, import_react.useState)("candidate");
	const { setRole } = useRole();
	const navigate = useNavigate();
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [firstName, setFirstName] = (0, import_react.useState)("");
	const [lastName, setLastName] = (0, import_react.useState)("");
	const [companyName, setCompanyName] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [industries, setIndustries] = (0, import_react.useState)([]);
	const [industryId, setIndustryId] = (0, import_react.useState)("");
	const [industryName, setIndustryName] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (mode === "signup") getCatalog().then((c) => setIndustries(c.industries)).catch(() => {});
	}, [mode]);
	async function handleSubmit(e) {
		e.preventDefault();
		setBusy(true);
		setError(null);
		try {
			const payload = mode === "signin" ? {
				username: email,
				password
			} : selected === "candidate" ? {
				firstName: firstName.trim() || "User",
				lastName: lastName.trim() || "User",
				email,
				password,
				description: "",
				age: 18
			} : selected === "company" ? {
				name: companyName.trim() || "New Company",
				email,
				password,
				industryId: industryId && industryId !== "new" ? Number(industryId) : void 0,
				industryName: industryId === "new" ? industryName : void 0
			} : {
				firstName: firstName.trim() || "User",
				lastName: lastName.trim() || "User",
				email,
				password
			};
			await authenticate(selected, mode, payload);
			setRole(selected);
			navigate({ to: ROLE_HOME[selected] });
		} catch (e) {
			setError(formatErrorMessage(e, "Unable to authenticate"));
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-[520px] px-4 py-14 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-bold text-foreground",
				children: mode === "signin" ? "Sign in to Hirely" : "Create your Hirely account"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-[15px] text-muted-foreground",
				children: "Choose the account you want to use. You can switch at any time."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 space-y-3",
				children: roleOptions.filter((opt) => !(mode === "signup" && opt.value === "hiring")).map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setSelected(opt.value),
					className: `flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-colors ${selected === opt.value ? "border-primary bg-info-muted" : "border-border bg-card hover:border-input"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `inline-flex size-10 shrink-0 items-center justify-center rounded-lg ${selected === opt.value ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`,
						children: opt.icon
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block font-semibold text-foreground",
						children: opt.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-sm text-muted-foreground",
						children: opt.blurb
					})] })]
				}, opt.value))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "mt-8 space-y-4",
				children: [
					mode === "signup" && selected === "company" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Company name",
							type: "text",
							placeholder: "Acme Inc.",
							value: companyName,
							onChange: setCompanyName
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mb-1.5 block text-sm font-medium text-foreground",
								children: "Industry"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: industryId,
								onChange: (e) => setIndustryId(e.target.value),
								className: "w-full rounded-lg border border-input bg-card px-4 py-2.5 text-[15px] text-foreground focus:border-primary focus:outline-none mb-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										disabled: true,
										children: "Select an industry"
									}),
									industries.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: i.id,
										children: i.name
									}, i.id)),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "new",
										children: "+ Create new industry..."
									})
								]
							})]
						}),
						industryId === "new" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "New Industry Name",
							type: "text",
							placeholder: "e.g. Space Tech",
							value: industryName,
							onChange: setIndustryName
						})
					] }),
					mode === "signup" && selected !== "company" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "First name",
							type: "text",
							placeholder: "John",
							value: firstName,
							onChange: setFirstName
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Last name",
							type: "text",
							placeholder: "Doe",
							value: lastName,
							onChange: setLastName
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Email address",
						type: "email",
						placeholder: "you@example.com",
						value: email,
						onChange: setEmail
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Password",
						type: "password",
						placeholder: "••••••••",
						value: password,
						onChange: setPassword
					}),
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-destructive",
						children: error
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						className: "w-full rounded-lg bg-primary py-3 text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-primary-hover",
						children: busy ? "Working…" : mode === "signin" ? "Sign in" : "Create account"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-center text-sm text-muted-foreground",
				children: mode === "signin" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					"New to Hirely?",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/signup",
						className: "text-primary hover:underline",
						children: "Create an account"
					})
				] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					"Already have an account?",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/signin",
						className: "text-primary hover:underline",
						children: "Sign in"
					})
				] })
			})
		]
	});
}
function Field({ label, type, placeholder, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "mb-1.5 block text-sm font-medium text-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type,
			placeholder,
			value,
			onChange: (e) => onChange(e.target.value),
			className: "w-full rounded-lg border border-input bg-card px-4 py-2.5 text-[15px] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
		})]
	});
}
//#endregion
export { AuthForm as t };
