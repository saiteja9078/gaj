import { f as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/EmptyState-DrF5VNIe.js
var import_jsx_runtime = require_jsx_runtime();
function EmptyState({ illustration, title, description, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex max-w-xl flex-col items-center px-4 py-20 text-center",
		children: [
			illustration,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-8 font-display text-3xl font-bold text-foreground sm:text-4xl",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-[17px] leading-relaxed text-muted-foreground",
				children: description
			}),
			action && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8",
				children: action
			})
		]
	});
}
//#endregion
export { EmptyState as t };
