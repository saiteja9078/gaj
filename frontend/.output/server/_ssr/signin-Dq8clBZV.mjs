import { f as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { g as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as useRole, s as ROLE_HOME } from "./router-BtZMXQ2R.mjs";
import { t as AuthForm } from "./AuthForm-DQLlBcNA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/signin-Dq8clBZV.js
var import_jsx_runtime = require_jsx_runtime();
function SignInPage() {
	const { role } = useRole();
	if (role) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: ROLE_HOME[role] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthForm, { mode: "signin" });
}
//#endregion
export { SignInPage as component };
