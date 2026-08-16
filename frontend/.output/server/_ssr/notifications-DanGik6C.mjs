import { r as __toESM } from "../_runtime.mjs";
import { f as require_jsx_runtime, p as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { z as getNotifications } from "./router-BtZMXQ2R.mjs";
import { t as EmptyState } from "./EmptyState-DrF5VNIe.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/notifications-DanGik6C.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function NotificationsPage() {
	const [notifications, setNotifications] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		getNotifications().then(setNotifications).catch(() => setNotifications([])).finally(() => setLoading(false));
	}, []);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-[760px] px-4 py-12 text-muted-foreground",
		children: "Loading notifications…"
	});
	if (notifications.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
		illustration: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BellIllustration, {}),
		title: "Nothing right now. Check back later!",
		description: "This is where we'll notify you about your job applications and other useful information to help you with your job search.",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/jobs",
			className: "inline-flex rounded-lg bg-primary px-12 py-3.5 text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-primary-hover",
			children: "Find jobs"
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-[760px] px-4 py-12 sm:px-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl font-bold text-foreground",
			children: "Notifications"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6 space-y-3",
			children: notifications.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-card p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold text-foreground",
						children: n.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: n.message
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-muted-foreground",
						children: new Date(n.createdAt).toLocaleString()
					})
				]
			}, n.id))
		})]
	});
}
function BellIllustration() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		width: "200",
		height: "150",
		viewBox: "0 0 200 150",
		fill: "none",
		"aria-hidden": true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "20",
				y: "40",
				width: "130",
				height: "80",
				rx: "4",
				className: "fill-chart-4/40"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "120",
				cy: "55",
				r: "26",
				className: "fill-chart-3/50"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M60 100c0-6 6-8 8-14 3-9 1-20 9-27 8-7 20-5 26 3 6 8 4 18 8 26 3 6 9 8 9 12H60z",
				className: "fill-primary"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "88",
				cy: "112",
				r: "8",
				className: "fill-background"
			})
		]
	});
}
//#endregion
export { NotificationsPage as component };
