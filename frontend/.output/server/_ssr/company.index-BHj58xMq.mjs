import { r as __toESM } from "../_runtime.mjs";
import { f as require_jsx_runtime, p as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { g as Navigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as Plus, s as Trash2 } from "../_libs/lucide-react.mjs";
import { A as getCompanyHiringManagers, F as getEmployerJobs, N as getCurrentCompany, b as deleteHiringManager, c as useRole, h as createHiringManager, k as getCatalog, m as createDepartment } from "./router-BtZMXQ2R.mjs";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, l as AlertDialogTrigger, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./alert-dialog-CXo_-D8n.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/company.index-BHj58xMq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CompanyDashboard() {
	const { role } = useRole();
	const [company, setCompany] = (0, import_react.useState)(null);
	const [postedJobs, setPostedJobs] = (0, import_react.useState)([]);
	const [team, setTeam] = (0, import_react.useState)([]);
	const [departments, setDepartments] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [showAddManager, setShowAddManager] = (0, import_react.useState)(false);
	const [newManager, setNewManager] = (0, import_react.useState)({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		gender: "MALE",
		departmentId: ""
	});
	const [addBusy, setAddBusy] = (0, import_react.useState)(false);
	const [isCreatingDept, setIsCreatingDept] = (0, import_react.useState)(false);
	const [newDeptName, setNewDeptName] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		Promise.all([
			getCurrentCompany().catch(() => null),
			getEmployerJobs().catch(() => []),
			getCompanyHiringManagers().catch(() => []),
			getCatalog().then((c) => c.departments).catch(() => [])
		]).then(([comp, jobs, managers, deps]) => {
			setCompany(comp);
			setPostedJobs(jobs);
			setTeam(managers);
			if (comp) setDepartments(deps.filter((d) => d.companyId === comp.id));
			setLoading(false);
		});
	}, []);
	async function handleAddManager(e) {
		e.preventDefault();
		setAddBusy(true);
		try {
			let deptId = newManager.departmentId ? Number(newManager.departmentId) : null;
			if (isCreatingDept && newDeptName.trim() && company) {
				const createdDept = await createDepartment(newDeptName.trim(), company.id);
				deptId = createdDept.id;
				setDepartments((prev) => [...prev, createdDept]);
			}
			if (!deptId) {
				toast.error("Please select or create a department");
				setAddBusy(false);
				return;
			}
			await createHiringManager({
				...newManager,
				departmentId: deptId
			});
			const newTeam = await getCompanyHiringManagers().catch(() => team);
			setTeam(newTeam);
			setShowAddManager(false);
			setNewManager({
				firstName: "",
				lastName: "",
				email: "",
				password: "",
				gender: "MALE",
				departmentId: ""
			});
			setIsCreatingDept(false);
			setNewDeptName("");
		} catch (err) {
			toast.error("Failed to add manager: " + String(err));
		} finally {
			setAddBusy(false);
		}
	}
	async function handleDeleteManager(id) {
		try {
			await deleteHiringManager(id);
			setTeam(team.filter((m) => m.id !== id));
		} catch (err) {
			toast.error("Failed to delete manager: " + String(err));
		}
	}
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-[1100px] px-4 py-12 text-muted-foreground",
		children: "Loading dashboard…"
	});
	if (role !== "company") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/signin" });
	if (!company) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-[1100px] px-4 py-12 text-center text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-lg",
			children: "Sign in as an employer or company to view your company dashboard."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/signin",
			className: "mt-4 inline-block font-semibold text-primary hover:underline",
			children: "Sign in →"
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-[1100px] px-4 py-12 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl font-bold text-foreground sm:text-4xl",
					children: company.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-[15px] text-muted-foreground",
					children: [
						company.industry?.name || "Company",
						" ",
						company.location?.state ? `· ${company.location.state}` : ""
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/company/profile",
						className: "rounded-lg border border-input px-4 py-2 text-sm font-semibold text-foreground hover:bg-accent",
						children: "Edit profile"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/company/post-job",
						className: "rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover",
						children: "Post a job"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "mt-12 font-display text-2xl font-bold text-foreground",
				children: [
					"Posted jobs (",
					postedJobs.length,
					")"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 space-y-3",
				children: postedJobs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-xl border border-border bg-card p-6 text-center text-muted-foreground text-sm",
					children: "No active job postings. Click \"Post a job\" above to create one."
				}) : postedJobs.map((j) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-lg font-semibold text-foreground",
						children: j.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: [
							j.location,
							" · ",
							j.payLabel
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/hiring/jobs/$jobId/applicants",
						params: { jobId: j.id },
						className: "text-sm font-medium text-primary hover:underline",
						children: "View applicants →"
					})]
				}, j.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-12 flex items-center justify-between flex-wrap gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl font-bold text-foreground",
					children: "Hiring Managers & Team"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setShowAddManager(!showAddManager),
					className: "flex items-center gap-2 rounded-lg border border-input px-4 py-2 text-sm font-semibold text-foreground hover:bg-accent",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Add Manager"]
				})]
			}),
			showAddManager && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleAddManager,
				className: "mt-6 rounded-xl border border-border bg-card p-6 shadow-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mb-4 font-semibold text-foreground text-lg",
						children: "Create a Hiring Manager Account"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mb-1 block text-sm font-medium text-foreground",
									children: "First name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									required: true,
									value: newManager.firstName,
									onChange: (e) => setNewManager((prev) => ({
										...prev,
										firstName: e.target.value
									})),
									className: "w-full rounded-md border border-input px-3 py-2 text-sm focus:border-primary focus:outline-none bg-transparent"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mb-1 block text-sm font-medium text-foreground",
									children: "Last name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									required: true,
									value: newManager.lastName,
									onChange: (e) => setNewManager((prev) => ({
										...prev,
										lastName: e.target.value
									})),
									className: "w-full rounded-md border border-input px-3 py-2 text-sm focus:border-primary focus:outline-none bg-transparent"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mb-1 block text-sm font-medium text-foreground",
									children: "Email"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "email",
									required: true,
									value: newManager.email,
									onChange: (e) => setNewManager((prev) => ({
										...prev,
										email: e.target.value
									})),
									className: "w-full rounded-md border border-input px-3 py-2 text-sm focus:border-primary focus:outline-none bg-transparent"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mb-1 block text-sm font-medium text-foreground",
									children: "Password"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "password",
									required: true,
									value: newManager.password,
									onChange: (e) => setNewManager((prev) => ({
										...prev,
										password: e.target.value
									})),
									className: "w-full rounded-md border border-input px-3 py-2 text-sm focus:border-primary focus:outline-none bg-transparent"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block sm:col-span-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mb-1 block text-sm font-medium text-foreground",
										children: "Department"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-2 items-center",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												required: !isCreatingDept,
												value: newManager.departmentId,
												onChange: (e) => setNewManager((prev) => ({
													...prev,
													departmentId: e.target.value
												})),
												disabled: isCreatingDept,
												className: "w-full rounded-md border border-input px-3 py-2 text-sm focus:border-primary focus:outline-none bg-card text-foreground disabled:opacity-50",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "",
													disabled: true,
													children: "Select a department"
												}), departments.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: d.id,
													children: d.name
												}, d.id))]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-sm font-medium text-muted-foreground",
												children: "or"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setIsCreatingDept(!isCreatingDept),
												className: "whitespace-nowrap text-sm font-medium text-primary hover:underline",
												children: isCreatingDept ? "Select existing" : "Create new"
											})
										]
									}),
									isCreatingDept && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										required: true,
										placeholder: "New department name",
										value: newDeptName,
										onChange: (e) => setNewDeptName(e.target.value),
										className: "mt-2 w-full rounded-md border border-input px-3 py-2 text-sm focus:border-primary focus:outline-none bg-transparent"
									}),
									departments.length === 0 && !isCreatingDept && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-xs text-destructive",
										children: "No departments found. Please click \"Create new\" to add one."
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 flex justify-end gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setShowAddManager(false),
							className: "rounded-md px-4 py-2 text-sm font-medium hover:bg-accent",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: addBusy || departments.length === 0 && !isCreatingDept,
							className: "rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50",
							children: addBusy ? "Saving..." : "Create Account"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 grid gap-3 sm:grid-cols-3",
				children: team.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground col-span-3",
					children: "No hiring managers linked yet."
				}) : team.map((m) => {
					const initials = `${m.firstName?.[0] || ""}${m.lastName?.[0] || ""}`.toUpperCase() || "HM";
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex size-10 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground",
								children: initials
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "block font-medium text-foreground",
								children: [
									m.firstName,
									" ",
									m.lastName
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-xs text-muted-foreground",
								children: m.hiringDepartment?.name || "Hiring Manager"
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialog, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTrigger, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "p-2 text-muted-foreground hover:text-destructive transition-colors",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-5" })
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Are you absolutely sure?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, { children: "This will immediately remove the hiring manager from your company account." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Cancel" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
							onClick: () => handleDeleteManager(m.id),
							children: "Remove"
						})] })] })] })]
					}, m.id);
				})
			})
		]
	});
}
//#endregion
export { CompanyDashboard as component };
