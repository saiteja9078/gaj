import { f as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as EmptyState } from "./EmptyState-DrF5VNIe.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/messages-BoSXw_K1.js
var import_jsx_runtime = require_jsx_runtime();
function MessagesPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
		illustration: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			width: "180",
			height: "130",
			viewBox: "0 0 180 130",
			fill: "none",
			"aria-hidden": true,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "20",
					y: "25",
					width: "120",
					height: "72",
					rx: "8",
					className: "fill-chart-4/40"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "45",
					y: "45",
					width: "110",
					height: "66",
					rx: "8",
					className: "fill-primary"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "60",
					y: "65",
					width: "60",
					height: "6",
					rx: "3",
					className: "fill-background/70"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "60",
					y: "80",
					width: "40",
					height: "6",
					rx: "3",
					className: "fill-background/50"
				})
			]
		}),
		title: "No messages yet",
		description: "When an employer replies to one of your applications, the conversation will show up here.",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/jobs",
			className: "inline-flex rounded-lg bg-primary px-12 py-3.5 text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-primary-hover",
			children: "Find jobs"
		})
	});
}
//#endregion
export { MessagesPage as component };
