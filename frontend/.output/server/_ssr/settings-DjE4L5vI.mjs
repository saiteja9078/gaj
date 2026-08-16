import { r as __toESM } from "../_runtime.mjs";
import { f as require_jsx_runtime, p as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as UserRound, b as Mail, f as ShieldCheck, g as Monitor, k as ChevronRight, x as Lock } from "../_libs/lucide-react.mjs";
import { M as getCurrentCandidate, N as getCurrentCompany, P as getCurrentHiringManager, c as useRole } from "./router-BtZMXQ2R.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-DjE4L5vI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var sections = [
	{
		id: "account",
		title: "Account settings",
		blurb: "Your contact information",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, { className: "size-5" })
	},
	{
		id: "security",
		title: "Security settings",
		blurb: "Manage your account security",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-5" }),
		badge: "New"
	},
	{
		id: "communications",
		title: "Communications settings",
		blurb: "Manage notifications and message settings",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "size-5" })
	},
	{
		id: "devices",
		title: "Device management",
		blurb: "Manage your active devices and sessions",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Monitor, { className: "size-5" })
	},
	{
		id: "privacy",
		title: "Privacy settings",
		blurb: "Information about your privacy on Hirely",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-5" })
	}
];
function SettingsPage() {
	const [active, setActive] = (0, import_react.useState)("account");
	const { role, setRole } = useRole();
	const navigate = useNavigate();
	const [userInfo, setUserInfo] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (role === "candidate") getCurrentCandidate().then((c) => setUserInfo({
			email: c.email,
			name: `${c.firstName} ${c.lastName}`
		})).catch(() => setUserInfo(null));
		else if (role === "company") getCurrentCompany().then((c) => setUserInfo({
			email: c.email || c.name,
			name: c.name
		})).catch(() => setUserInfo(null));
		else if (role === "hiring") getCurrentHiringManager().then((m) => setUserInfo({
			email: m.email,
			name: `${m.firstName} ${m.lastName}`
		})).catch(() => setUserInfo(null));
	}, [role]);
	function handleSignOut() {
		setRole(null);
		navigate({ to: "/" });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto grid max-w-[1400px] lg:grid-cols-[420px_minmax(0,1fr)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "border-border bg-surface lg:border-r",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "px-6 py-10 font-display text-4xl font-bold text-foreground sm:px-10",
				children: "Settings"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", { children: sections.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => setActive(s.id),
				className: `flex w-full items-start gap-4 border-t border-border px-6 py-6 text-left transition-colors sm:px-10 ${active === s.id ? "border-l-4 border-l-primary bg-card pl-5 sm:pl-9" : "hover:bg-accent/40"}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-0.5 text-foreground/70",
						children: s.icon
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-lg font-semibold text-foreground",
								children: s.title
							}), s.badge && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-md bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground",
								children: s.badge
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 block text-sm text-muted-foreground",
							children: s.blurb
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "mt-1 size-5 shrink-0 text-foreground/40" })
				]
			}, s.id)) })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "px-6 py-10 sm:px-12",
			children: [
				active === "account" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					title: "Account settings",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Account type:",
							value: role ? role.toUpperCase() : "Guest",
							action: "Active role"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Name:",
							value: userInfo?.name || "User",
							action: "Registered Name"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Email",
							value: userInfo?.email || "Signed in account",
							action: "Account email"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pt-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: handleSignOut,
								className: "rounded-lg bg-destructive px-6 py-2.5 text-sm font-semibold text-destructive-foreground hover:bg-destructive/90 transition-colors",
								children: "Sign out of account"
							})
						})
					]
				}),
				active === "security" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					title: "Security settings",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: "Two-step verification",
						value: "Off",
						action: "Manage"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: "Password & Authentication",
						value: "JWT Session Active",
						action: "Secure"
					})]
				}),
				active === "communications" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					title: "Communications settings",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: "Job alert emails",
						value: "Weekly summary",
						action: "Change"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: "Employer messages",
						value: "Enabled",
						action: "Change"
					})]
				}),
				active === "devices" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					title: "Device management",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: "Current Browser Session",
						value: "Active now",
						action: "Current device"
					})
				}),
				active === "privacy" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					title: "Privacy settings",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: "Profile visibility",
						value: "Employers can search your profile",
						action: "Change"
					})
				})
			]
		})]
	});
}
function Panel({ title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-3xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-3xl font-bold text-foreground",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-8 space-y-0",
			children
		})]
	});
}
function Row({ label, value, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap items-center justify-between gap-4 border-t border-border py-7",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-semibold text-foreground",
			children: label
		}), value && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-[15px] text-muted-foreground",
			children: value
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-sm font-medium text-muted-foreground",
			children: action
		})]
	});
}
//#endregion
export { SettingsPage as component };
