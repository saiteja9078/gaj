import { r as __toESM } from "../_runtime.mjs";
import { f as require_jsx_runtime, p as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { A as redirect, N as notFound, _ as useNavigate, c as HeadContent, d as Outlet, f as lazyRouteComponent, h as Link, m as createRootRouteWithContext, p as createFileRoute, s as Scripts, u as createRouter, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { F as Bell, P as Bookmark, _ as MessageSquare, h as Moon, i as User, l as Sun, v as Menu } from "../_libs/lucide-react.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-CjYXQpa3.js
var API_URL = "http://localhost:8000";
function slugify(value) {
	return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
function locationLabel(location) {
	if (!location) return "India";
	const parts = [
		location.city,
		location.state,
		location.country
	].filter(Boolean);
	return parts.length > 0 ? parts.join(", ") : "India";
}
function money(value) {
	if (value == null || value === 0) return "Salary not listed";
	return `₹${value.toLocaleString("en-IN")}`;
}
function toJob(job) {
	const remote = job.workMode?.toLowerCase().includes("remote") ?? false;
	const low = job.salaryLower ?? void 0;
	const high = job.salaryHigher ?? void 0;
	return {
		id: String(job.id),
		title: job.title,
		company: job.companyName ?? "Company",
		companySlug: slugify(job.companyName ?? "company"),
		location: remote ? "Remote" : locationLabel(job.location),
		remote,
		payLabel: low && high ? `${money(low)} - ${money(high)}` : money(low ?? high),
		payMin: low,
		payMax: high,
		jobTypes: job.type ? [job.type.replaceAll("_", " ")] : [],
		tags: remote ? ["Work from home"] : [],
		easyApply: true,
		postedAt: job.postedAt ? new Date(job.postedAt).toLocaleDateString() : "Recently",
		description: job.description ?? "See the full job description for details.",
		skills: job.jobSkillRequirements?.map((s) => ({
			name: s.name,
			required: s.required
		})) ?? [],
		experience: job.minimumExperienceInMonths ? `${Math.floor(job.minimumExperienceInMonths / 12)} years ${job.minimumExperienceInMonths % 12 > 0 ? `${job.minimumExperienceInMonths % 12} months` : ""}`.trim() : void 0,
		responsibilities: [],
		benefits: []
	};
}
function formatErrorMessage(err, fallback = "An error occurred") {
	if (!err) return fallback;
	const msg = err instanceof Error ? err.message : String(err);
	if (msg.toLowerCase().includes("failed to fetch") || msg.toLowerCase().includes("networkerror") || msg.toLowerCase().includes("load failed") || msg.toLowerCase().includes("err_failed")) return "Unable to connect to the server. Please check your connection or ensure the backend server is running.";
	return msg || fallback;
}
async function request(path, init) {
	const token = typeof window !== "undefined" ? localStorage.getItem("hirely-token") : null;
	const isFormData = init?.body instanceof FormData;
	const headers = { ...token ? { Authorization: `Bearer ${token}` } : {} };
	if (!isFormData) headers["Content-Type"] = "application/json";
	if (init?.headers) Object.assign(headers, init.headers);
	let response;
	try {
		response = await fetch(`${API_URL}${path}`, {
			...init,
			headers
		});
	} catch (err) {
		throw new Error("Unable to connect to the server. Please try again later.");
	}
	if ((response.status === 401 || response.status === 403) && typeof window !== "undefined") {
		localStorage.removeItem("hirely-token");
		localStorage.removeItem("hirely-role");
		window.dispatchEvent(new Event("hirely-auth-change"));
		if (window.location.pathname !== "/signin" && window.location.pathname !== "/signup" && window.location.pathname !== "/") window.location.href = "/signin";
	}
	if (!response.ok) {
		let msg = `Request failed (${response.status})`;
		try {
			const body = await response.text();
			if (body) try {
				const parsed = JSON.parse(body);
				msg = parsed.message || parsed.error || body;
			} catch {
				msg = body;
			}
		} catch {}
		throw new Error(formatErrorMessage(msg));
	}
	if (response.status === 204) return;
	const text = await response.text();
	return text ? JSON.parse(text) : void 0;
}
function currentUserId() {
	if (typeof window === "undefined") return null;
	const token = localStorage.getItem("hirely-token");
	if (!token) return null;
	try {
		const payload = JSON.parse(atob(token.split(".")[1]));
		return typeof payload.userId === "number" ? payload.userId : null;
	} catch {
		return null;
	}
}
async function authenticate(role, mode, data) {
	const result = await request(mode === "signin" ? `/auth/login/${role === "hiring" ? "hm" : role}` : `/auth/signup/${role === "hiring" ? "hm" : role}`, {
		method: "POST",
		body: JSON.stringify(data)
	});
	localStorage.setItem("hirely-token", result.token);
	try {
		const payload = JSON.parse(atob(result.token.split(".")[1]));
		let derivedRole = null;
		if (payload.type === "CANDIDATE") derivedRole = "candidate";
		else if (payload.type === "COMPANY") derivedRole = "company";
		else if (payload.type === "HIRING_MANAGER") derivedRole = "hiring";
		if (derivedRole) localStorage.setItem("hirely-role", derivedRole);
		else localStorage.setItem("hirely-role", role);
	} catch {
		localStorage.setItem("hirely-role", role);
	}
	if (typeof window !== "undefined") window.dispatchEvent(new Event("hirely-auth-change"));
	return result;
}
async function getCatalog() {
	const [skills, roles, industries, companies, departments] = await Promise.all([
		request("/catalog/skills").catch(() => []),
		request("/catalog/roles").catch(() => []),
		request("/catalog/industries").catch(() => []),
		listCompanies().catch(() => []),
		Promise.resolve([])
	]);
	return {
		skills,
		roles,
		industries,
		companies,
		departments
	};
}
async function listJobs(query = "", filters = {}) {
	return (await request("/job/postings", { method: "GET" }).catch(() => [])).map(toJob);
}
async function listJobsPage(query = "", filters = {}, page = 0, size = 20) {
	const jobs = await request("/job/postings", { method: "GET" }).catch(() => []);
	return {
		content: jobs.map(toJob),
		totalPages: 1,
		totalElements: jobs.length
	};
}
async function getJob(id) {
	const job = (await request("/job/postings").catch(() => [])).find((j) => String(j.id) === id);
	if (!job) throw new Error("Job not found");
	return toJob(job);
}
async function createJobPosting(data) {
	return request("/job/postings", {
		method: "POST",
		body: JSON.stringify(data)
	});
}
async function getEmployerJobs() {
	return (await request("/job/postings").catch(() => [])).map(toJob);
}
async function createDepartment(name, companyId) {
	return request("/company/departments", {
		method: "POST",
		body: JSON.stringify({
			name,
			companyId
		})
	});
}
async function listCompanies() {
	return Promise.resolve([]);
}
async function getCurrentCompany() {
	return request("/company/me");
}
async function updateCompany(data) {
	return Promise.resolve({});
}
async function getCompanyHiringManagers() {
	return Promise.resolve([]);
}
async function createHiringManager(data) {
	return request("/company/hiring-managers", {
		method: "POST",
		body: JSON.stringify(data)
	});
}
async function deleteHiringManager(id) {
	return Promise.resolve();
}
async function getCurrentHiringManager() {
	return Promise.resolve({});
}
async function getCompanyReviews(companyId) {
	return Promise.resolve([]);
}
async function addCompanyReview(companyId, stars, text) {
	return request("/company/reviews", {
		method: "POST",
		body: JSON.stringify({
			company_id: companyId,
			stars,
			text
		})
	});
}
async function getCurrentCandidate() {
	return request("/api/candidates/me");
}
async function updateCandidate(data) {
	return request("/api/candidates/me", {
		method: "PATCH",
		body: JSON.stringify(data)
	});
}
async function getCandidateSkills() {
	return Promise.resolve([]);
}
async function saveCandidateSkills(addExistingSkills, createNewSkills) {
	return Promise.resolve();
}
async function deleteCandidateSkill(skillId) {
	return Promise.resolve();
}
async function getCandidateExperiences() {
	return Promise.resolve([]);
}
async function addCandidateExperience(exp) {
	return request("/candidate/experiences", {
		method: "POST",
		body: JSON.stringify({
			role_id: 1,
			company_id: 1,
			organizationName: exp.organizationName,
			description: exp.description || "",
			fromDate: exp.fromDate ? `${exp.fromDate}T00:00:00` : (/* @__PURE__ */ new Date()).toISOString(),
			toDate: exp.toDate ? `${exp.toDate}T00:00:00` : null
		})
	});
}
async function deleteCandidateExperience(id) {
	return Promise.resolve();
}
async function getResumes() {
	return Promise.resolve([]);
}
async function uploadResume(file) {
	const formData = new FormData();
	formData.append("file", file);
	return request("/candidate/resumes", {
		method: "POST",
		body: formData
	});
}
async function deleteResume(id) {
	return Promise.resolve();
}
async function fetchResumeBlobUrl(id) {
	return Promise.resolve("");
}
async function applyToJob(jobId, candidateId, coverLetter, resumeId, alerts) {
	return request("/job/apply", {
		method: "POST",
		body: JSON.stringify({
			job_posting_id: Number(jobId),
			coverLetter: coverLetter || "",
			resume_id: resumeId || 1,
			status: "APPLIED"
		})
	});
}
async function getMyApplications() {
	return Promise.resolve([]);
}
async function getJobApplicants(jobId) {
	return Promise.resolve([]);
}
async function updateApplicationStatus(applicationId, status) {
	return Promise.resolve({});
}
async function deleteJobApplication(applicationId) {
	return Promise.resolve();
}
async function getApplicationDetails(applicationId) {
	return Promise.resolve({});
}
async function downloadApplicationResumeBlob(applicationId) {
	return Promise.resolve(new Blob());
}
async function getNotifications() {
	return Promise.resolve([]);
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-BtZMXQ2R.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var styles_default = "/assets/styles-DDk4rGWX.css";
var STORAGE_KEY$1 = "hirely-theme";
var ThemeContext = (0, import_react.createContext)({
	theme: "system",
	resolvedTheme: "light",
	setTheme: () => {},
	toggleTheme: () => {}
});
/** Applied before paint so there is no flash of the wrong theme. */
var themeInitScript = `(function(){try{var t=localStorage.getItem("${STORAGE_KEY$1}")||"system";var d=t==="dark"||(t==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);document.documentElement.style.colorScheme=d?"dark":"light";}catch(e){}})();`;
function systemPrefersDark() {
	return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
}
function ThemeProvider({ children }) {
	const [theme, setThemeState] = (0, import_react.useState)("system");
	const [resolvedTheme, setResolvedTheme] = (0, import_react.useState)("light");
	const apply = (0, import_react.useCallback)((next) => {
		const dark = next === "dark" || next === "system" && systemPrefersDark();
		document.documentElement.classList.toggle("dark", dark);
		document.documentElement.style.colorScheme = dark ? "dark" : "light";
		setResolvedTheme(dark ? "dark" : "light");
	}, []);
	(0, import_react.useEffect)(() => {
		const stored = localStorage.getItem(STORAGE_KEY$1) ?? "system";
		setThemeState(stored);
		apply(stored);
		const mq = window.matchMedia("(prefers-color-scheme: dark)");
		const onChange = () => {
			if (localStorage.getItem(STORAGE_KEY$1) !== "dark" && localStorage.getItem(STORAGE_KEY$1) !== "light") apply("system");
		};
		mq.addEventListener("change", onChange);
		return () => mq.removeEventListener("change", onChange);
	}, [apply]);
	const setTheme = (0, import_react.useCallback)((next) => {
		localStorage.setItem(STORAGE_KEY$1, next);
		setThemeState(next);
		apply(next);
	}, [apply]);
	const toggleTheme = (0, import_react.useCallback)(() => {
		setTheme(resolvedTheme === "dark" ? "light" : "dark");
	}, [resolvedTheme, setTheme]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeContext.Provider, {
		value: {
			theme,
			resolvedTheme,
			setTheme,
			toggleTheme
		},
		children
	});
}
function useTheme() {
	return (0, import_react.useContext)(ThemeContext);
}
var STORAGE_KEY = "hirely-role";
var TOKEN_KEY = "hirely-token";
var ROLE_LABELS = {
	candidate: "Candidate",
	hiring: "Hiring Manager",
	company: "Company"
};
var ROLE_HOME = {
	candidate: "/dashboard",
	hiring: "/hiring",
	company: "/company"
};
var RoleContext = (0, import_react.createContext)({
	role: null,
	setRole: () => {},
	logout: () => {}
});
function RoleProvider({ children }) {
	const [role, setRoleState] = (0, import_react.useState)(null);
	const checkAuth = (0, import_react.useCallback)(() => {
		if (typeof window === "undefined") return;
		const token = localStorage.getItem(TOKEN_KEY);
		let storedRole = localStorage.getItem(STORAGE_KEY);
		if (token) try {
			const payload = JSON.parse(atob(token.split(".")[1]));
			if (payload.exp * 1e3 < Date.now()) {
				localStorage.removeItem(STORAGE_KEY);
				localStorage.removeItem(TOKEN_KEY);
				setRoleState(null);
				return;
			}
			if (!storedRole) {
				if (payload.type === "CANDIDATE") storedRole = "candidate";
				else if (payload.type === "COMPANY") storedRole = "company";
				else if (payload.type === "HIRING_MANAGER") storedRole = "hiring";
				if (storedRole) localStorage.setItem(STORAGE_KEY, storedRole);
			}
		} catch (err) {
			localStorage.removeItem(STORAGE_KEY);
			localStorage.removeItem(TOKEN_KEY);
			setRoleState(null);
			return;
		}
		if (token && storedRole && (storedRole === "candidate" || storedRole === "hiring" || storedRole === "company")) setRoleState(storedRole);
		else {
			localStorage.removeItem(STORAGE_KEY);
			localStorage.removeItem(TOKEN_KEY);
			setRoleState(null);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		checkAuth();
		const handleAuthChange = () => {
			checkAuth();
		};
		window.addEventListener("hirely-auth-change", handleAuthChange);
		return () => window.removeEventListener("hirely-auth-change", handleAuthChange);
	}, [checkAuth]);
	const setRole = (0, import_react.useCallback)((next) => {
		if (next) localStorage.setItem(STORAGE_KEY, next);
		else {
			localStorage.removeItem(STORAGE_KEY);
			localStorage.removeItem(TOKEN_KEY);
		}
		setRoleState(next);
		window.dispatchEvent(new Event("hirely-auth-change"));
	}, []);
	const logout = (0, import_react.useCallback)(() => {
		localStorage.removeItem(STORAGE_KEY);
		localStorage.removeItem(TOKEN_KEY);
		setRoleState(null);
		window.dispatchEvent(new Event("hirely-auth-change"));
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleContext.Provider, {
		value: {
			role,
			setRole,
			logout
		},
		children
	});
}
function useRole() {
	return (0, import_react.useContext)(RoleContext);
}
function Logo({ className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/",
		className: `inline-flex items-baseline gap-0.5 ${className}`,
		"aria-label": "Hirely home",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-display text-2xl font-bold tracking-tight text-primary",
			children: "hirely"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "size-1.5 rounded-full bg-primary",
			"aria-hidden": true
		})]
	});
}
function ThemeToggle() {
	const { resolvedTheme, toggleTheme } = useTheme();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick: toggleTheme,
		"aria-label": resolvedTheme === "dark" ? "Switch to light theme" : "Switch to dark theme",
		className: "inline-flex size-9 items-center justify-center rounded-full text-foreground/70 transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
		children: resolvedTheme === "dark" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "size-5" })
	});
}
var publicNav = [
	{
		to: "/",
		label: "Home"
	},
	{
		to: "/jobs",
		label: "Find jobs"
	},
	{
		to: "/companies",
		label: "Company reviews"
	}
];
var activeProps = { className: "text-foreground after:scale-x-100" };
function Header() {
	const { role, logout } = useRole();
	const navigate = useNavigate();
	const [open, setOpen] = (0, import_react.useState)(false);
	function handleSignOut() {
		logout();
		navigate({ to: "/" });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex h-16 max-w-[1400px] items-center gap-8 px-4 sm:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "hidden items-center gap-7 md:flex",
					children: [publicNav.map((item) => {
						if (role && item.to === "/") return null;
						if ((role === "company" || role === "hiring") && item.to !== "/") return null;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: item.to,
							activeOptions: { exact: item.to === "/" },
							activeProps,
							className: "relative py-5 text-[15px] text-muted-foreground transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-[3px] after:scale-x-0 after:bg-primary after:transition-transform hover:text-foreground",
							children: item.label
						}, item.to);
					}), role && role !== "candidate" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: ROLE_HOME[role],
						activeProps,
						className: "relative py-5 text-[15px] text-muted-foreground transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-[3px] after:scale-x-0 after:bg-primary after:transition-transform hover:text-foreground",
						children: "Dashboard"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ml-auto flex items-center gap-1",
					children: [
						role === "candidate" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hidden items-center gap-1 sm:flex",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconLink, {
									to: "/jobs",
									label: "Saved jobs",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "size-5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconLink, {
									to: "/messages",
									label: "Messages",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "size-5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconLink, {
									to: "/notifications",
									label: "Notifications",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "size-5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconLink, {
									to: "/profile",
									label: "Profile",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "size-5" })
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeToggle, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-2 hidden h-6 w-px bg-border sm:block" }),
						role ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hidden items-center gap-3 sm:flex",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground",
								children: ROLE_LABELS[role]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: handleSignOut,
								className: "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
								children: "Sign out"
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hidden items-center gap-4 sm:flex",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/signin",
								className: "text-sm font-medium text-foreground hover:underline",
								children: "Sign in"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/signup",
								className: "rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover",
								children: "Employers / Post Job"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": "Open menu",
							onClick: () => setOpen((v) => !v),
							className: "inline-flex size-9 items-center justify-center rounded-full text-foreground md:hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
						})
					]
				})
			]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
			className: "border-t border-border bg-background px-4 pb-4 md:hidden",
			children: [
				[...publicNav.filter((item) => {
					if (role && item.to === "/") return false;
					if ((role === "company" || role === "hiring") && item.to !== "/") return false;
					return true;
				}), ...role && role !== "candidate" ? [{
					to: ROLE_HOME[role],
					label: "Dashboard"
				}] : []].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: item.to,
					onClick: () => setOpen(false),
					className: "block border-b border-border py-3 text-[15px] text-foreground last:border-0",
					children: item.label
				}, item.to)),
				role === "candidate" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-2 border-b border-border py-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/profile",
							onClick: () => setOpen(false),
							className: "flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-accent",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "size-4" }), " Profile"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/notifications",
							onClick: () => setOpen(false),
							className: "flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-accent",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "size-4" }), " Notifications"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/messages",
							onClick: () => setOpen(false),
							className: "flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-accent",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "size-4" }), " Messages"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/dashboard",
							onClick: () => setOpen(false),
							className: "flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-accent",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "size-4" }), " Dashboard"]
						})
					]
				}),
				role ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between pt-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground",
						children: ROLE_LABELS[role]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							setOpen(false);
							handleSignOut();
						},
						className: "rounded-lg border border-input px-4 py-2 text-sm font-medium text-foreground hover:bg-accent",
						children: "Sign out"
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-3 pt-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/signin",
						onClick: () => setOpen(false),
						className: "flex-1 rounded-lg border border-input py-2 text-center text-sm font-medium",
						children: "Sign in"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/signup",
						onClick: () => setOpen(false),
						className: "flex-1 rounded-lg bg-primary py-2 text-center text-sm font-semibold text-primary-foreground",
						children: "Sign up"
					})]
				})
			]
		})]
	});
}
function IconLink({ to, label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to,
		"aria-label": label,
		activeProps: { className: "text-primary" },
		className: "inline-flex size-9 items-center justify-center rounded-full text-foreground/80 transition-colors hover:bg-accent",
		children
	});
}
var columns = [{
	title: "Job seekers",
	links: [
		{
			to: "/jobs",
			label: "Find jobs"
		},
		{
			to: "/companies",
			label: "Company reviews"
		},
		{
			to: "/profile",
			label: "Your profile"
		}
	]
}, {
	title: "Employers",
	links: [
		{
			to: "/company/post-job",
			label: "Post a job"
		},
		{
			to: "/hiring",
			label: "Hiring dashboard"
		},
		{
			to: "/company",
			label: "Company account"
		}
	]
}];
function Footer() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "border-t border-border bg-surface",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-[1400px] gap-10 px-4 py-12 sm:px-6 md:grid-cols-[2fr_1fr_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-xs text-sm text-muted-foreground",
				children: "Hirely connects candidates, hiring managers, and companies in one simple place."
			})] }), columns.map((col) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-sm font-semibold text-foreground",
				children: col.title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 space-y-2",
				children: col.links.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: l.to,
					className: "text-sm text-muted-foreground transition-colors hover:text-foreground",
					children: l.label
				}) }, l.to))
			})] }, col.title))]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-t border-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-[1400px] px-4 py-5 text-xs text-muted-foreground sm:px-6",
				children: [
					"© ",
					(/* @__PURE__ */ new Date()).getFullYear(),
					" Hirely. Demo interface — no real listings."
				]
			})
		})]
	});
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$18 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Hirely — Jobs, company reviews and hiring" },
			{
				name: "description",
				content: "Hirely helps candidates find jobs and helps teams hire, all in one simple place."
			},
			{
				property: "og:title",
				content: "Hirely — Jobs, company reviews and hiring"
			},
			{
				property: "og:description",
				content: "Hirely helps candidates find jobs and helps teams hire, all in one simple place."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&family=Inter:wght@400;500;600&display=swap"
			},
			{
				rel: "icon",
				href: "/favicon.svg",
				type: "image/svg+xml"
			}
		],
		scripts: [{ children: themeInitScript }]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			suppressHydrationWarning: true,
			children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})]
		})]
	});
}
function RootComponent() {
	const { queryClient } = Route$18.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RoleProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-h-screen flex-col",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "flex-1",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {})] }) })
	});
}
var $$splitComponentImporter$17 = () => import("./routes-CVButGRN.mjs");
var Route$17 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "Hirely — Find your next job or your next hire" },
		{
			name: "description",
			content: "Search thousands of jobs, read company reviews, compare salaries, and manage hiring — all on Hirely."
		},
		{
			property: "og:title",
			content: "Hirely — Find your next job or your next hire"
		},
		{
			property: "og:description",
			content: "Search jobs, read company reviews, compare salaries, and manage hiring on Hirely."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
var $$splitComponentImporter$16 = () => import("./dashboard-DrVkdKxI.mjs");
var Route$16 = createFileRoute("/dashboard")({
	beforeLoad: () => {
		if (typeof window === "undefined") return;
		const token = localStorage.getItem("hirely-token");
		const role = localStorage.getItem("hirely-role");
		if (!token || role !== "candidate") throw redirect({ to: "/signin" });
	},
	head: () => ({ meta: [
		{ title: "Jobs for you — Hirely" },
		{
			name: "description",
			content: "Your personalised job feed and application activity."
		},
		{
			property: "og:title",
			content: "Jobs for you — Hirely"
		},
		{
			property: "og:description",
			content: "Your personalised job feed and application activity."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
var $$splitComponentImporter$15 = () => import("./jobs-BpfR8w6N.mjs");
var Route$15 = createFileRoute("/jobs")({
	validateSearch: (search) => {
		const parseIds = (val) => {
			if (Array.isArray(val)) return val.map(Number);
			if (typeof val === "string") return [Number(val)];
			if (typeof val === "number") return [val];
			return [];
		};
		return {
			q: search.q,
			location: search.location,
			roleId: search.roleId ? Number(search.roleId) : void 0,
			companyIds: parseIds(search.companyIds).length > 0 ? parseIds(search.companyIds) : void 0,
			skillIds: parseIds(search.skillIds).length > 0 ? parseIds(search.skillIds) : void 0,
			jobId: search.jobId ? Number(search.jobId) : void 0
		};
	},
	head: () => ({ meta: [
		{ title: "Search jobs — Hirely" },
		{
			name: "description",
			content: "Browse open roles by pay, job type, and location on Hirely."
		},
		{
			property: "og:title",
			content: "Search jobs — Hirely"
		},
		{
			property: "og:description",
			content: "Browse open roles by pay, job type, and location."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
var $$splitComponentImporter$14 = () => import("./messages-BoSXw_K1.mjs");
var Route$14 = createFileRoute("/messages")({
	head: () => ({ meta: [
		{ title: "Messages — Hirely" },
		{
			name: "description",
			content: "Conversations with employers about your applications."
		},
		{
			property: "og:title",
			content: "Messages — Hirely"
		},
		{
			property: "og:description",
			content: "Conversations with employers about your applications."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("./notifications-DanGik6C.mjs");
var Route$13 = createFileRoute("/notifications")({
	head: () => ({ meta: [
		{ title: "Notifications — Hirely" },
		{
			name: "description",
			content: "Updates about your job applications and searches on Hirely."
		},
		{
			property: "og:title",
			content: "Notifications — Hirely"
		},
		{
			property: "og:description",
			content: "Updates about your job applications and searches."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./profile-2QCEuggu.mjs");
var Route$12 = createFileRoute("/profile")({
	beforeLoad: () => {
		if (typeof window === "undefined") return;
		const token = localStorage.getItem("hirely-token");
		const role = localStorage.getItem("hirely-role");
		if (!token || role !== "candidate") throw redirect({ to: "/signin" });
	},
	head: () => ({ meta: [
		{ title: "Your profile — Hirely" },
		{
			name: "description",
			content: "Manage your contact details, skills, experiences, and resume."
		},
		{
			property: "og:title",
			content: "Your profile — Hirely"
		},
		{
			property: "og:description",
			content: "Manage your contact details, skills, experiences, and resume."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./settings-DjE4L5vI.mjs");
var Route$11 = createFileRoute("/settings")({
	head: () => ({ meta: [
		{ title: "Settings — Hirely" },
		{
			name: "description",
			content: "Manage your account, security, communications, devices, and privacy."
		},
		{
			property: "og:title",
			content: "Settings — Hirely"
		},
		{
			property: "og:description",
			content: "Manage your account, security, communications, and privacy."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./signin-Dq8clBZV.mjs");
var Route$10 = createFileRoute("/signin")({
	head: () => ({ meta: [
		{ title: "Sign in — Hirely" },
		{
			name: "description",
			content: "Sign in to Hirely as a candidate, hiring manager, or company."
		},
		{
			property: "og:title",
			content: "Sign in — Hirely"
		},
		{
			property: "og:description",
			content: "Sign in as a candidate, hiring manager, or company."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./signup-HrcAMODQ.mjs");
var Route$9 = createFileRoute("/signup")({
	head: () => ({ meta: [
		{ title: "Create an account — Hirely" },
		{
			name: "description",
			content: "Create a Hirely account as a candidate, hiring manager, or company."
		},
		{
			property: "og:title",
			content: "Create an account — Hirely"
		},
		{
			property: "og:description",
			content: "Create an account as a candidate, hiring manager, or company."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./applications._applicationId-C4OC11Q2.mjs");
var Route$8 = createFileRoute("/applications/$applicationId")({
	beforeLoad: () => {
		if (typeof window === "undefined") return;
		const token = localStorage.getItem("hirely-token");
		const role = localStorage.getItem("hirely-role");
		if (!token || role !== "candidate") throw redirect({ to: "/signin" });
	},
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./apply._jobId-4MGuPSNk.mjs");
var Route$7 = createFileRoute("/apply/$jobId")({
	beforeLoad: () => {
		if (typeof window === "undefined") return;
		const token = localStorage.getItem("hirely-token");
		const role = localStorage.getItem("hirely-role");
		if (!token || role !== "candidate") throw redirect({ to: "/signin" });
	},
	loader: async ({ params }) => {
		try {
			return { job: await getJob(params.jobId) };
		} catch {
			throw notFound();
		}
	},
	head: ({ loaderData }) => {
		if (!loaderData) return { meta: [{ title: "Application unavailable — Hirely" }, {
			name: "robots",
			content: "noindex"
		}] };
		const title = `Apply: ${loaderData.job.title} — Hirely`;
		const description = `Review and submit your application for ${loaderData.job.title} at ${loaderData.job.company}.`;
		return { meta: [
			{ title },
			{
				name: "description",
				content: description
			},
			{
				property: "og:title",
				content: title
			},
			{
				property: "og:description",
				content: description
			}
		] };
	},
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./companies.index-6g9T_BaH.mjs");
var Route$6 = createFileRoute("/companies/")({
	head: () => ({ meta: [
		{ title: "Company reviews — Hirely" },
		{
			name: "description",
			content: "Read ratings and reviews from people who work at these companies."
		},
		{
			property: "og:title",
			content: "Company reviews — Hirely"
		},
		{
			property: "og:description",
			content: "Ratings and reviews from people who work at these companies."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./companies._slug-Dlb8dTsi.mjs");
var Route$5 = createFileRoute("/companies/$slug")({
	loader: async ({ params }) => {
		const company = (await listCompanies()).find((item) => item.slug === params.slug);
		if (!company) throw notFound();
		let jobs = [];
		if (company.backendId) jobs = (await listJobsPage("", { companyIds: [company.backendId] }, 0, 100)).content;
		return {
			company,
			jobs
		};
	},
	head: ({ loaderData }) => {
		if (!loaderData) return { meta: [{ title: "Company not found — Hirely" }, {
			name: "robots",
			content: "noindex"
		}] };
		const title = `${loaderData.company.name} reviews — Hirely`;
		const description = `Learn more about open roles and reviews for ${loaderData.company.name}.`;
		return { meta: [
			{ title },
			{
				name: "description",
				content: description
			},
			{
				property: "og:title",
				content: title
			},
			{
				property: "og:description",
				content: description
			}
		] };
	},
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./company.index-BHj58xMq.mjs");
var Route$4 = createFileRoute("/company/")({
	beforeLoad: () => {
		if (typeof window === "undefined") return;
		const token = localStorage.getItem("hirely-token");
		const role = localStorage.getItem("hirely-role");
		if (!token || role !== "company") throw redirect({ to: "/signin" });
	},
	head: () => ({ meta: [
		{ title: "Company dashboard — Hirely" },
		{
			name: "description",
			content: "Manage posted jobs, your team, and your company profile on Hirely."
		},
		{
			property: "og:title",
			content: "Company dashboard — Hirely"
		},
		{
			property: "og:description",
			content: "Manage posted jobs, your team, and your company profile."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./company.post-job-DTg05Lj7.mjs");
var Route$3 = createFileRoute("/company/post-job")({
	beforeLoad: () => {
		if (typeof window === "undefined") return;
		const token = localStorage.getItem("hirely-token");
		const role = localStorage.getItem("hirely-role");
		if (!token || role !== "company" && role !== "hiring") throw redirect({ to: "/signin" });
	},
	head: () => ({ meta: [
		{ title: "Post a job — Hirely" },
		{
			name: "description",
			content: "Create a job listing with pay, location, and requirements."
		},
		{
			property: "og:title",
			content: "Post a job — Hirely"
		},
		{
			property: "og:description",
			content: "Create a job listing with pay, location, and requirements."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./company.profile-BRMSBEIk.mjs");
var Route$2 = createFileRoute("/company/profile")({
	head: () => ({ meta: [
		{ title: "Company profile — Hirely" },
		{
			name: "description",
			content: "Edit the company profile candidates see alongside your job listings."
		},
		{
			property: "og:title",
			content: "Company profile — Hirely"
		},
		{
			property: "og:description",
			content: "Edit the profile candidates see alongside your job listings."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./hiring.index-gZOZU6BC.mjs");
var Route$1 = createFileRoute("/hiring/")({
	beforeLoad: () => {
		if (typeof window === "undefined") return;
		const token = localStorage.getItem("hirely-token");
		const role = localStorage.getItem("hirely-role");
		if (!token || role !== "hiring" && role !== "company") throw redirect({ to: "/signin" });
	},
	head: () => ({ meta: [
		{ title: "Hiring dashboard — Hirely" },
		{
			name: "description",
			content: "Track open roles, applicants by stage, and recent hiring activity."
		},
		{
			property: "og:title",
			content: "Hiring dashboard — Hirely"
		},
		{
			property: "og:description",
			content: "Track open roles, applicants by stage, and recent activity."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./hiring.jobs._jobId.applicants-C-SwbyQb.mjs");
var Route = createFileRoute("/hiring/jobs/$jobId/applicants")({
	loader: async ({ params }) => {
		try {
			return { job: await getJob(params.jobId) };
		} catch {
			throw notFound();
		}
	},
	head: ({ loaderData }) => {
		if (!loaderData) return { meta: [{ title: "Role not found — Hirely" }, {
			name: "robots",
			content: "noindex"
		}] };
		const title = `Applicants: ${loaderData.job.title} — Hirely`;
		const description = `Review and move applicants for ${loaderData.job.title} at ${loaderData.job.company}.`;
		return { meta: [
			{ title },
			{
				name: "description",
				content: description
			},
			{
				property: "og:title",
				content: title
			},
			{
				property: "og:description",
				content: description
			}
		] };
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var IndexRoute = Route$17.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$18
});
var DashboardRoute = Route$16.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => Route$18
});
var JobsRoute = Route$15.update({
	id: "/jobs",
	path: "/jobs",
	getParentRoute: () => Route$18
});
var MessagesRoute = Route$14.update({
	id: "/messages",
	path: "/messages",
	getParentRoute: () => Route$18
});
var NotificationsRoute = Route$13.update({
	id: "/notifications",
	path: "/notifications",
	getParentRoute: () => Route$18
});
var ProfileRoute = Route$12.update({
	id: "/profile",
	path: "/profile",
	getParentRoute: () => Route$18
});
var SettingsRoute = Route$11.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => Route$18
});
var SigninRoute = Route$10.update({
	id: "/signin",
	path: "/signin",
	getParentRoute: () => Route$18
});
var SignupRoute = Route$9.update({
	id: "/signup",
	path: "/signup",
	getParentRoute: () => Route$18
});
var ApplicationsApplicationIdRoute = Route$8.update({
	id: "/applications/$applicationId",
	path: "/applications/$applicationId",
	getParentRoute: () => Route$18
});
var ApplyJobIdRoute = Route$7.update({
	id: "/apply/$jobId",
	path: "/apply/$jobId",
	getParentRoute: () => Route$18
});
var CompaniesIndexRoute = Route$6.update({
	id: "/companies/",
	path: "/companies/",
	getParentRoute: () => Route$18
});
var CompaniesSlugRoute = Route$5.update({
	id: "/companies/$slug",
	path: "/companies/$slug",
	getParentRoute: () => Route$18
});
var CompanyIndexRoute = Route$4.update({
	id: "/company/",
	path: "/company/",
	getParentRoute: () => Route$18
});
var rootRouteChildren = {
	IndexRoute,
	DashboardRoute,
	JobsRoute,
	MessagesRoute,
	NotificationsRoute,
	ProfileRoute,
	SettingsRoute,
	SigninRoute,
	SignupRoute,
	ApplicationsApplicationIdRoute,
	ApplyJobIdRoute,
	CompaniesSlugRoute,
	CompanyPostJobRoute: Route$3.update({
		id: "/company/post-job",
		path: "/company/post-job",
		getParentRoute: () => Route$18
	}),
	CompanyProfileRoute: Route$2.update({
		id: "/company/profile",
		path: "/company/profile",
		getParentRoute: () => Route$18
	}),
	CompaniesIndexRoute,
	CompanyIndexRoute,
	HiringIndexRoute: Route$1.update({
		id: "/hiring/",
		path: "/hiring/",
		getParentRoute: () => Route$18
	}),
	HiringJobsJobIdApplicantsRoute: Route.update({
		id: "/hiring/jobs/$jobId/applicants",
		path: "/hiring/jobs/$jobId/applicants",
		getParentRoute: () => Route$18
	})
};
var routeTree = Route$18._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getCompanyHiringManagers as A, getResumes as B, downloadApplicationResumeBlob as C, getCandidateExperiences as D, getApplicationDetails as E, getEmployerJobs as F, updateApplicationStatus as G, listJobs as H, getJob as I, uploadResume as J, updateCandidate as K, getJobApplicants as L, getCurrentCandidate as M, getCurrentCompany as N, getCandidateSkills as O, getCurrentHiringManager as P, getMyApplications as R, deleteResume as S, formatErrorMessage as T, listJobsPage as U, listCompanies as V, saveCandidateSkills as W, currentUserId as _, Route$8 as a, deleteHiringManager as b, useRole as c, addCompanyReview as d, applyToJob as f, createJobPosting as g, createHiringManager as h, Route$7 as i, getCompanyReviews as j, getCatalog as k, useTheme as l, createDepartment as m, Route as n, Route$15 as o, authenticate as p, updateCompany as q, Route$5 as r, ROLE_HOME as s, router_exports as t, addCandidateExperience as u, deleteCandidateExperience as v, fetchResumeBlobUrl as w, deleteJobApplication as x, deleteCandidateSkill as y, getNotifications as z };
