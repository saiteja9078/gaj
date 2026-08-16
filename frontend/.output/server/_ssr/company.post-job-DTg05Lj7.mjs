import { r as __toESM } from "../_runtime.mjs";
import { f as require_jsx_runtime, p as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { T as formatErrorMessage, g as createJobPosting, k as getCatalog, l as useTheme } from "./router-BtZMXQ2R.mjs";
import { t as esm_default } from "../_libs/@uiw/react-md-editor+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/company.post-job-DTg05Lj7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var jobTypes = [
	"Full-time",
	"Part-time",
	"Internship",
	"Contract",
	"Fresher"
];
function PostJobPage() {
	const { resolvedTheme } = useTheme();
	const navigate = useNavigate();
	const [selectedTypes, setSelectedTypes] = (0, import_react.useState)(["Full-time"]);
	const [roleId, setRoleId] = (0, import_react.useState)("");
	const [customRole, setCustomRole] = (0, import_react.useState)("");
	const [roles, setRoles] = (0, import_react.useState)([]);
	const [catalogSkills, setCatalogSkills] = (0, import_react.useState)([]);
	const [selectedSkillIds, setSelectedSkillIds] = (0, import_react.useState)([]);
	const [customSkills, setCustomSkills] = (0, import_react.useState)([]);
	const [customSkillInput, setCustomSkillInput] = (0, import_react.useState)("");
	const [showCustomSkillInput, setShowCustomSkillInput] = (0, import_react.useState)(false);
	const [description, setDescription] = (0, import_react.useState)("");
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		getCatalog().then(({ roles, skills }) => {
			setRoles(roles);
			setCatalogSkills(skills);
			if (roles.length > 0) setRoleId(String(roles[0].id));
		});
	}, []);
	async function handleSubmit(e) {
		e.preventDefault();
		const form = new FormData(e.currentTarget);
		if (!roleId && !customRole.trim()) {
			toast.error("Please select or enter a role category.");
			return;
		}
		const title = String(form.get("title") || "").trim();
		if (!title) {
			toast.error("Job title is required.");
			return;
		}
		const locationStr = String(form.get("location") || "").trim();
		setSubmitting(true);
		try {
			await createJobPosting({
				roleId: roleId === "custom" ? null : Number(roleId),
				createRoleName: roleId === "custom" ? customRole.trim() : null,
				title,
				description: description || title,
				salaryLower: Number(form.get("minimum") || 0),
				salaryHigher: Number(form.get("maximum") || 0),
				minimumExperienceInMonths: Number(form.get("expMonths") || 0),
				status: "OPEN",
				postedAt: (/* @__PURE__ */ new Date()).toISOString(),
				expiresAt: null,
				existingSkills: selectedSkillIds.map((id) => ({
					id,
					proficiency: "INTERMEDIATE",
					required: true
				})),
				createSkills: customSkills.map((name) => ({
					name,
					proficiency: "INTERMEDIATE",
					required: true
				})),
				location: {
					country: "India",
					state: locationStr,
					city: locationStr
				},
				workMode: locationStr.toLowerCase().includes("remote") ? "REMOTE" : "ONSITE",
				workingHoursPerDay: 8,
				type: selectedTypes[0] === "Internship" ? "INTERN" : selectedTypes[0] === "Part-time" ? "PART_TIME" : "FULL_TIME"
			});
			toast.success("Job posting created!");
			navigate({ to: "/company" });
		} catch (error) {
			toast.error(formatErrorMessage(error, "Unable to publish job"));
		} finally {
			setSubmitting(false);
		}
	}
	function toggleSkill(id) {
		setSelectedSkillIds((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-[720px] px-4 py-12 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-bold text-foreground sm:text-4xl",
				children: "Post a job"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-[15px] text-muted-foreground",
				children: "Candidates see this exactly as you write it."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "mt-8 space-y-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
						title: "Basics",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								name: "title",
								label: "Job title",
								placeholder: "e.g. Python Developer Intern"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								name: "location",
								label: "Location",
								placeholder: "City, State or Remote"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mb-1.5 block text-sm font-medium text-foreground",
									children: "Role category"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: roleId,
									onChange: (e) => setRoleId(e.target.value),
									className: "w-full rounded-lg border border-input bg-card px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "",
											disabled: true,
											children: "Select a role"
										}),
										roles.map((role) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: role.id,
											children: role.name
										}, role.id)),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "custom",
											children: "Other"
										})
									]
								})]
							}),
							roleId === "custom" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mb-1.5 block text-sm font-medium text-foreground",
									children: "Custom Role Name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									placeholder: "e.g. Prompt Engineer",
									value: customRole,
									onChange: (e) => setCustomRole(e.target.value),
									className: "w-full rounded-lg border border-input bg-card px-4 py-2.5 text-[15px] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
						title: "Pay & Experience",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								name: "minimum",
								label: "Minimum pay (₹ / yr)",
								placeholder: "e.g. 300000"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								name: "maximum",
								label: "Maximum pay (₹ / yr)",
								placeholder: "e.g. 600000"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							name: "expMonths",
							label: "Minimum Experience (months)",
							placeholder: "e.g. 12"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
						title: "Job type",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2",
							children: jobTypes.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setSelectedTypes((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]),
								className: `rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${selectedTypes.includes(t) ? "border-primary bg-primary text-primary-foreground" : "border-input text-foreground hover:bg-accent"}`,
								children: t
							}, t))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
						title: "Skill Requirements",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground mb-3",
								children: "Select skills required for this job:"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-2 mb-4",
								children: [
									catalogSkills.map((s) => {
										const active = selectedSkillIds.includes(s.id);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => toggleSkill(s.id),
											className: `rounded-full border px-3 py-1 text-xs font-medium transition-colors ${active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:bg-accent"}`,
											children: s.name
										}, s.id);
									}),
									customSkills.map((s, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setCustomSkills((prev) => prev.filter((x) => x !== s)),
										className: "rounded-full border border-primary bg-primary text-primary-foreground px-3 py-1 text-xs font-medium",
										children: [s, " ×"]
									}, `custom-${idx}`)),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setShowCustomSkillInput(true),
										className: "rounded-full border border-dashed border-input bg-card text-muted-foreground px-3 py-1 text-xs font-medium hover:text-foreground hover:border-border transition-colors",
										children: "+ Other"
									})
								]
							}),
							showCustomSkillInput && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									placeholder: "Custom skill name...",
									value: customSkillInput,
									onChange: (e) => setCustomSkillInput(e.target.value),
									onKeyDown: (e) => {
										if (e.key === "Enter") {
											e.preventDefault();
											if (customSkillInput.trim() && !customSkills.includes(customSkillInput.trim())) {
												setCustomSkills([...customSkills, customSkillInput.trim()]);
												setCustomSkillInput("");
												setShowCustomSkillInput(false);
											}
										}
									},
									className: "flex-1 rounded-lg border border-input bg-card px-4 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => {
										if (customSkillInput.trim() && !customSkills.includes(customSkillInput.trim())) {
											setCustomSkills([...customSkills, customSkillInput.trim()]);
											setCustomSkillInput("");
											setShowCustomSkillInput(false);
										} else if (!customSkillInput.trim()) setShowCustomSkillInput(false);
									},
									className: "rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-hover",
									children: "Add"
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
						title: "Description",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mb-1.5 block text-sm font-medium text-foreground",
								children: "Full job description"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								"data-color-mode": resolvedTheme,
								className: "rounded-lg border border-input overflow-hidden",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(esm_default, {
									value: description,
									onChange: (val) => setDescription(val || ""),
									preview: "edit",
									height: 300,
									className: "w-full text-[15px]"
								})
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: submitting,
						className: "w-full rounded-lg bg-primary py-3.5 text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-50",
						children: submitting ? "Publishing…" : "Publish job posting"
					})
				]
			})
		]
	});
}
function Section({ title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "space-y-4 rounded-xl border border-border bg-card p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-lg font-bold text-foreground",
			children: title
		}), children]
	});
}
function Field({ name, label, placeholder }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "mb-1.5 block text-sm font-medium text-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			name,
			placeholder,
			className: "w-full rounded-lg border border-input bg-card px-4 py-2.5 text-[15px] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
		})]
	});
}
//#endregion
export { PostJobPage as component };
