globalThis.__nitro_main__ = import.meta.url;
import { n as HTTPError, r as defineLazyEventHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { t as HookableCore } from "./_libs/hookable.mjs";
import { r as FastResponse } from "./_libs/h3-v2+rou3+srvx.mjs";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"a0-CKGXSIe7TSsqDTmGm/nY1t/o5d0\"",
		"mtime": "2026-08-16T09:05:52.975Z",
		"size": 160,
		"path": "../public/robots.txt"
	},
	"/favicon.svg": {
		"type": "image/svg+xml",
		"etag": "\"10b-AcXVtNhVfn2dwzjO1JYXyxiEeCY\"",
		"mtime": "2026-08-16T09:05:52.975Z",
		"size": 267,
		"path": "../public/favicon.svg"
	},
	"/assets/AuthForm-CLk1NCm_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"14e8-bCyesI0wr7QUMxkeozQbT5SrV4g\"",
		"mtime": "2026-08-16T09:05:52.487Z",
		"size": 5352,
		"path": "../public/assets/AuthForm-CLk1NCm_.js"
	},
	"/assets/EmptyState-DOP-NYC5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1f4-00SyMjUSI/XH+WGELjq2OTw1pTg\"",
		"mtime": "2026-08-16T09:05:52.487Z",
		"size": 500,
		"path": "../public/assets/EmptyState-DOP-NYC5.js"
	},
	"/assets/JobDetailPanel-CjnkYg7x.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2173-RKkrOQ0hktZhMTARwqWptJ2ynW4\"",
		"mtime": "2026-08-16T09:05:52.487Z",
		"size": 8563,
		"path": "../public/assets/JobDetailPanel-CjnkYg7x.js"
	},
	"/assets/SearchBar-rip_SrcQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1051-9ukZ2b9G25Z5wta2Q+fP7vTLgok\"",
		"mtime": "2026-08-16T09:05:52.487Z",
		"size": 4177,
		"path": "../public/assets/SearchBar-rip_SrcQ.js"
	},
	"/assets/applications._applicationId-D8qLihnT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1a1d-eLeM2N40ZRFK876j2cCPCcIF3Mg\"",
		"mtime": "2026-08-16T09:05:52.488Z",
		"size": 6685,
		"path": "../public/assets/applications._applicationId-D8qLihnT.js"
	},
	"/assets/briefcase-CBfHjyMH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d1-nw3aNuUwu3CV1RLP9gn7NX8L8IQ\"",
		"mtime": "2026-08-16T09:05:52.488Z",
		"size": 209,
		"path": "../public/assets/briefcase-CBfHjyMH.js"
	},
	"/assets/apply._jobId-t0-__a2x.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1773-td6ANg6GPYyihmY++H1+HX+8Mj4\"",
		"mtime": "2026-08-16T09:05:52.488Z",
		"size": 6003,
		"path": "../public/assets/apply._jobId-t0-__a2x.js"
	},
	"/assets/building-2-BaypBz-Y.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"174-uLOCGyLyrOx5f30JTnFpv443Mug\"",
		"mtime": "2026-08-16T09:05:52.488Z",
		"size": 372,
		"path": "../public/assets/building-2-BaypBz-Y.js"
	},
	"/assets/chevron-down-DNaFrePX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"75-fckYiHVhobVKa8hqbgHXjw6v37E\"",
		"mtime": "2026-08-16T09:05:52.488Z",
		"size": 117,
		"path": "../public/assets/chevron-down-DNaFrePX.js"
	},
	"/assets/companies._slug-Bc-CYrzu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1357-FgZtGa9dWHtjgeETCS2E1W/NSQ4\"",
		"mtime": "2026-08-16T09:05:52.488Z",
		"size": 4951,
		"path": "../public/assets/companies._slug-Bc-CYrzu.js"
	},
	"/assets/companies.index-xe17yUdi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8f9-RmfnPjks8tHaUyBAzHocId+r/2k\"",
		"mtime": "2026-08-16T09:05:52.488Z",
		"size": 2297,
		"path": "../public/assets/companies.index-xe17yUdi.js"
	},
	"/assets/company.post-job-VXQGTwYv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c6a-BoMv/eNnyNxEfzgHAoiz7Dt0C10\"",
		"mtime": "2026-08-16T09:05:52.488Z",
		"size": 7274,
		"path": "../public/assets/company.post-job-VXQGTwYv.js"
	},
	"/assets/company.index-CY9gwqRK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2496-HUJHVnprPcP5mJ7+9yZHNSnKM38\"",
		"mtime": "2026-08-16T09:05:52.488Z",
		"size": 9366,
		"path": "../public/assets/company.index-CY9gwqRK.js"
	},
	"/assets/dashboard-Drt89hnk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"11c1-0XEAVuoCVuEmfs6/nJaYisY2Bpo\"",
		"mtime": "2026-08-16T09:05:52.489Z",
		"size": 4545,
		"path": "../public/assets/dashboard-Drt89hnk.js"
	},
	"/assets/company.profile-Dlthl_SS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8dc-hCOzYaBnPfsw7Q68DiMvygnETk0\"",
		"mtime": "2026-08-16T09:05:52.488Z",
		"size": 2268,
		"path": "../public/assets/company.profile-Dlthl_SS.js"
	},
	"/assets/alert-dialog-DoCGf51O.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"112c9-5z7WtpEeluGJHV0gkMJVYe1xB8s\"",
		"mtime": "2026-08-16T09:05:52.487Z",
		"size": 70345,
		"path": "../public/assets/alert-dialog-DoCGf51O.js"
	},
	"/assets/esm-B3nhPqbA.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"85b9-yME0qB2vl8feUzCF+qK/JJT2oIk\"",
		"mtime": "2026-08-16T09:05:52.494Z",
		"size": 34233,
		"path": "../public/assets/esm-B3nhPqbA.css"
	},
	"/assets/hiring.index-BaotAGB2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e84-uHUpUIETonvotroCabqSAq1el/Q\"",
		"mtime": "2026-08-16T09:05:52.490Z",
		"size": 3716,
		"path": "../public/assets/hiring.index-BaotAGB2.js"
	},
	"/assets/hiring.jobs._jobId.applicants-CgcDy4P3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1d9d-jcPZ4j1NTNX4G7Rj/t29nqz+Db4\"",
		"mtime": "2026-08-16T09:05:52.490Z",
		"size": 7581,
		"path": "../public/assets/hiring.jobs._jobId.applicants-CgcDy4P3.js"
	},
	"/assets/jobs-DP_8S9GC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"274c-gueOLAWgPWGl/9kDxsyC46MXM90\"",
		"mtime": "2026-08-16T09:05:52.490Z",
		"size": 10060,
		"path": "../public/assets/jobs-DP_8S9GC.js"
	},
	"/assets/jsx-runtime-B-hcVAMW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"216d-pcqlp1Bv4Kt7yFmWJlJC8xMXx/k\"",
		"mtime": "2026-08-16T09:05:52.491Z",
		"size": 8557,
		"path": "../public/assets/jsx-runtime-B-hcVAMW.js"
	},
	"/assets/index-BtyxpMFw.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5c45f-cNAVQo3CxZm8wYkcQjE2SMviEEA\"",
		"mtime": "2026-08-16T09:05:52.487Z",
		"size": 377951,
		"path": "../public/assets/index-BtyxpMFw.js"
	},
	"/assets/esm-CXUf96Fo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"100b71-DM5xVzw2UMMPw4BUMIGZ6iYZo6I\"",
		"mtime": "2026-08-16T09:05:52.490Z",
		"size": 1051505,
		"path": "../public/assets/esm-CXUf96Fo.js"
	},
	"/assets/link-BvMAjrDW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"591d-JcyaTI1hV1mcojDqMxrt1cDql+U\"",
		"mtime": "2026-08-16T09:05:52.492Z",
		"size": 22813,
		"path": "../public/assets/link-BvMAjrDW.js"
	},
	"/assets/mail-CsHxcfqu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ca-+nhN8UYZrYzvy5MmUv3MvEh3Cm8\"",
		"mtime": "2026-08-16T09:05:52.492Z",
		"size": 202,
		"path": "../public/assets/mail-CsHxcfqu.js"
	},
	"/assets/map-pin-DKoOGucC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f8-HgGQywek6ymtEtW9BEkEec2DjTA\"",
		"mtime": "2026-08-16T09:05:52.492Z",
		"size": 248,
		"path": "../public/assets/map-pin-DKoOGucC.js"
	},
	"/assets/messages-BGXbnr3J.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3f7-sriHMoy1g4r36rx/y4VSAsFTpNA\"",
		"mtime": "2026-08-16T09:05:52.492Z",
		"size": 1015,
		"path": "../public/assets/messages-BGXbnr3J.js"
	},
	"/assets/not-found-i5RsCZif.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"76-Trmr7GZIBZuvfg4uM18tBiRtOXg\"",
		"mtime": "2026-08-16T09:05:52.492Z",
		"size": 118,
		"path": "../public/assets/not-found-i5RsCZif.js"
	},
	"/assets/notifications-D6vCMy68.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"800-1SlbOPJ+cfxKNw6T3vjMR82gLCU\"",
		"mtime": "2026-08-16T09:05:52.493Z",
		"size": 2048,
		"path": "../public/assets/notifications-D6vCMy68.js"
	},
	"/assets/plus-zz4mrG19.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8e-BYVg3pjR2jpGTo/9d83uJ+H+BC0\"",
		"mtime": "2026-08-16T09:05:52.493Z",
		"size": 142,
		"path": "../public/assets/plus-zz4mrG19.js"
	},
	"/assets/routes-CPtLwweS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1805-Umc9iH3Qv9XcNxmvc4xlBjZ+5Vg\"",
		"mtime": "2026-08-16T09:05:52.493Z",
		"size": 6149,
		"path": "../public/assets/routes-CPtLwweS.js"
	},
	"/assets/signin-BKuW2_jF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"10a-y+LAWosimIU/i78LSOB2F0bJPJ0\"",
		"mtime": "2026-08-16T09:05:52.493Z",
		"size": 266,
		"path": "../public/assets/signin-BKuW2_jF.js"
	},
	"/assets/signup-DKVCobg1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"10a-P9kYHsl3H106b/FH25ZJu5UPTgU\"",
		"mtime": "2026-08-16T09:05:52.493Z",
		"size": 266,
		"path": "../public/assets/signup-DKVCobg1.js"
	},
	"/assets/star-CzMhiFUI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1cd-Ev02JALPrFQtpb7gGNu/qDjD258\"",
		"mtime": "2026-08-16T09:05:52.493Z",
		"size": 461,
		"path": "../public/assets/star-CzMhiFUI.js"
	},
	"/assets/profile-Dy-Tungb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4d6a-kCJMdc/713gnyU3lp+7+fBeRHgY\"",
		"mtime": "2026-08-16T09:05:52.493Z",
		"size": 19818,
		"path": "../public/assets/profile-Dy-Tungb.js"
	},
	"/assets/settings-57fiF7if.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"14d3-AOcB7GrKveub2iUBsSxGBcmTBbo\"",
		"mtime": "2026-08-16T09:05:52.493Z",
		"size": 5331,
		"path": "../public/assets/settings-57fiF7if.js"
	},
	"/assets/trash-2-CO_ZBb-c.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13d-f/w38cEPsNC8XnPdkqyLPIG3gLM\"",
		"mtime": "2026-08-16T09:05:52.493Z",
		"size": 317,
		"path": "../public/assets/trash-2-CO_ZBb-c.js"
	},
	"/assets/useRouter-BXRWbVwb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2b2-kmTbqrd3v/cnErCEBIMPSeSagCY\"",
		"mtime": "2026-08-16T09:05:52.493Z",
		"size": 690,
		"path": "../public/assets/useRouter-BXRWbVwb.js"
	},
	"/assets/user-round-DroMe-Wd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ab-b06h1uBG6m3nJmaKgUMWdLHsQE8\"",
		"mtime": "2026-08-16T09:05:52.494Z",
		"size": 171,
		"path": "../public/assets/user-round-DroMe-Wd.js"
	},
	"/assets/users-DjxCmz5s.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"127-wZF4hj0hCRHAnMmY/zUi7MehE4Y\"",
		"mtime": "2026-08-16T09:05:52.494Z",
		"size": 295,
		"path": "../public/assets/users-DjxCmz5s.js"
	},
	"/assets/x-4PWJ9EJe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8f-RE6HOmnYwrmaWL9S8xfLBZNqox4\"",
		"mtime": "2026-08-16T09:05:52.494Z",
		"size": 143,
		"path": "../public/assets/x-4PWJ9EJe.js"
	},
	"/assets/react-dom-sF8Euvcq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"dde-aqKHuf81fP3cShclx8Jw44pWPro\"",
		"mtime": "2026-08-16T09:05:52.493Z",
		"size": 3550,
		"path": "../public/assets/react-dom-sF8Euvcq.js"
	},
	"/assets/styles-DDk4rGWX.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"16087-23C1AU0huaY+yR77FlqMhq1uJyU\"",
		"mtime": "2026-08-16T09:05:52.494Z",
		"size": 90247,
		"path": "../public/assets/styles-DDk4rGWX.css"
	}
};
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_RwAuIN = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_RwAuIN
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
[].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new FastResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function useNitroHooks() {
	const nitroApp = useNitroApp();
	const hooks = nitroApp.hooks;
	if (hooks) return hooks;
	return nitroApp.hooks = new HookableCore();
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/_module-handler.mjs
function createHandler(hooks) {
	const nitroApp = useNitroApp();
	const nitroHooks = useNitroHooks();
	return {
		async fetch(request, env, context) {
			globalThis.__env__ = env;
			augmentReq(request, {
				env,
				context
			});
			const ctxExt = {};
			const url = new URL(request.url);
			if (hooks.fetch) {
				const res = await hooks.fetch(request, env, context, url, ctxExt);
				if (res) return res;
			}
			return await nitroApp.fetch(request);
		},
		scheduled(controller, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:scheduled", {
				controller,
				env,
				context
			}) || Promise.resolve());
		},
		email(message, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:email", {
				message,
				event: message,
				env,
				context
			}) || Promise.resolve());
		},
		queue(batch, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:queue", {
				batch,
				event: batch,
				env,
				context
			}) || Promise.resolve());
		},
		tail(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:tail", {
				traces,
				env,
				context
			}) || Promise.resolve());
		},
		trace(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:trace", {
				traces,
				env,
				context
			}) || Promise.resolve());
		}
	};
}
function augmentReq(cfReq, ctx) {
	const req = cfReq;
	req.ip = cfReq.headers.get("cf-connecting-ip") || void 0;
	req.runtime ??= { name: "cloudflare" };
	req.runtime.cloudflare = {
		...req.runtime.cloudflare,
		...ctx
	};
	req.waitUntil = ctx.context?.waitUntil.bind(ctx.context);
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/cloudflare-module.mjs
var cloudflare_module_default = createHandler({ fetch(cfRequest, env, context, url) {
	if (env.ASSETS && isPublicAssetURL(url.pathname)) return env.ASSETS.fetch(cfRequest);
} });
//#endregion
export { cloudflare_module_default as default };
