import { r as __toESM } from "../_runtime.mjs";
import { f as require_jsx_runtime, p as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { g as Navigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { E as Download, I as Award, N as Briefcase, T as Eye, b as Mail, j as ChevronDown, m as Plus, o as Upload, s as Trash2, t as X, w as FileText, y as MapPin } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { B as getResumes, D as getCandidateExperiences, J as uploadResume, K as updateCandidate, M as getCurrentCandidate, O as getCandidateSkills, S as deleteResume, T as formatErrorMessage, W as saveCandidateSkills, c as useRole, k as getCatalog, u as addCandidateExperience, v as deleteCandidateExperience, w as fetchResumeBlobUrl, y as deleteCandidateSkill } from "./router-BtZMXQ2R.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-2QCEuggu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProfilePage() {
	const { role } = useRole();
	const [candidate, setCandidate] = (0, import_react.useState)(null);
	const [skills, setSkills] = (0, import_react.useState)([]);
	const [experiences, setExperiences] = (0, import_react.useState)([]);
	const [resumes, setResumes] = (0, import_react.useState)([]);
	const [catalogSkills, setCatalogSkills] = (0, import_react.useState)([]);
	const [catalogRoles, setCatalogRoles] = (0, import_react.useState)([]);
	const [catalogCompanies, setCatalogCompanies] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [editingProfile, setEditingProfile] = (0, import_react.useState)(false);
	const [bannerOpen, setBannerOpen] = (0, import_react.useState)(false);
	const [showAddSkill, setShowAddSkill] = (0, import_react.useState)(false);
	const [customSkillName, setCustomSkillName] = (0, import_react.useState)("");
	const [proficiency, setProficiency] = (0, import_react.useState)("INTERMEDIATE");
	const [showAddExp, setShowAddExp] = (0, import_react.useState)(false);
	const [expCompany, setExpCompany] = (0, import_react.useState)("");
	const [expRole, setExpRole] = (0, import_react.useState)("");
	const [expDescription, setExpDescription] = (0, import_react.useState)("");
	const [expFromDate, setExpFromDate] = (0, import_react.useState)("");
	const [expToDate, setExpToDate] = (0, import_react.useState)("");
	const [uploadingResume, setUploadingResume] = (0, import_react.useState)(false);
	const [previewResumeId, setPreviewResumeId] = (0, import_react.useState)(null);
	const [resumeBlobUrls, setResumeBlobUrls] = (0, import_react.useState)({});
	(0, import_react.useEffect)(() => {
		loadData();
	}, []);
	async function loadData() {
		setLoading(true);
		try {
			const [cand, sks, exps, res, cat] = await Promise.all([
				getCurrentCandidate().catch(() => null),
				getCandidateSkills().catch(() => []),
				getCandidateExperiences().catch(() => []),
				getResumes().catch(() => []),
				getCatalog().catch(() => ({
					skills: [],
					roles: [],
					industries: [],
					companies: []
				}))
			]);
			setCandidate(cand);
			setSkills(sks);
			setExperiences(exps);
			setResumes(res);
			setCatalogSkills(cat.skills || []);
			setCatalogRoles(cat.roles || []);
			setCatalogCompanies(cat.companies || []);
		} catch {} finally {
			setLoading(false);
		}
	}
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-[760px] px-4 py-12 text-muted-foreground",
		children: "Loading profile…"
	});
	if (role !== "candidate") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/signin" });
	if (!candidate) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-[760px] px-4 py-12 text-center text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-lg",
			children: "Sign in as a candidate to view your profile."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/signin",
			className: "mt-4 inline-block font-semibold text-primary hover:underline",
			children: "Sign in now →"
		})]
	});
	const name = `${candidate.firstName || ""} ${candidate.lastName || ""}`.trim() || "Candidate";
	const initials = `${(candidate.firstName?.[0] || "").toUpperCase()}${(candidate.lastName?.[0] || "").toUpperCase()}` || "C";
	const location = [
		candidate.location?.city,
		candidate.location?.state,
		candidate.location?.country
	].filter(Boolean).join(", ");
	async function handleUpdateProfile(e) {
		e.preventDefault();
		const form = new FormData(e.currentTarget);
		try {
			const updated = await updateCandidate({
				firstName: String(form.get("firstName") || ""),
				lastName: String(form.get("lastName") || ""),
				email: String(form.get("email") || ""),
				description: String(form.get("description") || "")
			});
			setCandidate(updated);
			setEditingProfile(false);
			toast.success("Profile details updated.");
		} catch (err) {
			toast.error(formatErrorMessage(err, "Failed to update profile"));
		}
	}
	async function handleAddSkill(e) {
		e.preventDefault();
		if (!customSkillName.trim()) {
			toast.error("Please enter a skill name.");
			return;
		}
		try {
			const match = catalogSkills.find((s) => s.name.toLowerCase() === customSkillName.trim().toLowerCase());
			if (match) await saveCandidateSkills([{
				id: match.id,
				proficiency
			}], []);
			else await saveCandidateSkills([], [{
				name: customSkillName.trim(),
				proficiency
			}]);
			toast.success("Skill added.");
			setShowAddSkill(false);
			setCustomSkillName("");
			const updatedSks = await getCandidateSkills();
			setSkills(updatedSks);
		} catch (err) {
			toast.error(formatErrorMessage(err, "Failed to add skill"));
		}
	}
	async function handleDeleteSkill(skillId) {
		try {
			await deleteCandidateSkill(skillId);
			setSkills(skills.filter((s) => s.id !== skillId));
			toast.success("Skill removed.");
		} catch (err) {
			toast.error(formatErrorMessage(err, "Failed to remove skill"));
		}
	}
	async function handleAddExperience(e) {
		e.preventDefault();
		if (!expCompany.trim() || !expRole.trim() || !expFromDate) {
			toast.error("Please provide company, role, and from date.");
			return;
		}
		try {
			const companyMatch = catalogCompanies.find((c) => c.name.toLowerCase() === expCompany.trim().toLowerCase());
			await addCandidateExperience({
				organizationName: expCompany.trim(),
				companyId: companyMatch?.backendId,
				roleName: expRole.trim(),
				description: expDescription.trim(),
				fromDate: expFromDate,
				toDate: expToDate || void 0
			});
			toast.success("Experience added.");
			setShowAddExp(false);
			setExpCompany("");
			setExpRole("");
			setExpDescription("");
			setExpFromDate("");
			setExpToDate("");
			const updatedExps = await getCandidateExperiences();
			setExperiences(updatedExps);
		} catch (err) {
			toast.error(formatErrorMessage(err, "Failed to add experience"));
		}
	}
	async function handleDeleteExperience(id) {
		try {
			await deleteCandidateExperience(id);
			setExperiences(experiences.filter((e) => e.experienceId !== id));
			toast.success("Experience removed.");
		} catch (err) {
			toast.error(formatErrorMessage(err, "Failed to remove experience"));
		}
	}
	async function handleFileUpload(e) {
		const file = e.target.files?.[0];
		if (!file) return;
		setUploadingResume(true);
		try {
			const uploaded = await uploadResume(file);
			setResumes([uploaded, ...resumes]);
			toast.success("Resume uploaded successfully.");
		} catch (err) {
			toast.error(formatErrorMessage(err, "Failed to upload resume"));
		} finally {
			setUploadingResume(false);
		}
	}
	async function handleDeleteResume(id) {
		try {
			await deleteResume(id);
			setResumes(resumes.filter((r) => r.id !== id));
			if (previewResumeId === id) setPreviewResumeId(null);
			toast.success("Resume deleted.");
		} catch (err) {
			toast.error(formatErrorMessage(err, "Failed to delete resume"));
		}
	}
	async function handlePreviewResume(id) {
		if (previewResumeId === id) {
			setPreviewResumeId(null);
			return;
		}
		if (!resumeBlobUrls[id]) try {
			toast.loading("Loading resume preview...", { id: "preview-loading" });
			const url = await fetchResumeBlobUrl(id);
			setResumeBlobUrls((prev) => ({
				...prev,
				[id]: url
			}));
			toast.dismiss("preview-loading");
		} catch (err) {
			toast.dismiss("preview-loading");
			toast.error("Failed to load resume for preview");
			return;
		}
		setPreviewResumeId(id);
	}
	async function handleDownloadResume(id, fileName) {
		let url = resumeBlobUrls[id];
		if (!url) try {
			toast.loading("Downloading resume...", { id: "download-loading" });
			url = await fetchResumeBlobUrl(id);
			setResumeBlobUrls((prev) => ({
				...prev,
				[id]: url
			}));
			toast.dismiss("download-loading");
		} catch (err) {
			toast.dismiss("download-loading");
			toast.error("Failed to download resume");
			return;
		}
		const a = document.createElement("a");
		a.href = url;
		a.download = fileName;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-[760px] px-4 py-12 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-4xl font-bold text-foreground sm:text-5xl",
					children: name
				}), candidate.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-[15px] leading-relaxed text-muted-foreground",
					children: candidate.description
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex size-20 shrink-0 items-center justify-center rounded-full bg-secondary font-display text-2xl font-semibold text-secondary-foreground",
					children: initials
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex flex-wrap items-center gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContactRow, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "size-5" }),
						value: candidate.email
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContactRow, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-5" }),
						value: location || "India"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setEditingProfile(!editingProfile),
						className: "ml-auto text-sm font-semibold text-primary hover:underline",
						children: editingProfile ? "Cancel" : "Edit details"
					})
				]
			}),
			editingProfile && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleUpdateProfile,
				className: "mt-6 space-y-4 rounded-xl border border-border bg-card p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-lg font-bold text-foreground",
						children: "Edit Contact & Bio"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "First name",
							name: "firstName",
							defaultValue: candidate.firstName
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Last name",
							name: "lastName",
							defaultValue: candidate.lastName
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Email",
						name: "email",
						defaultValue: candidate.email
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mb-1.5 block text-sm font-medium text-foreground",
							children: "Short bio / description"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							name: "description",
							rows: 3,
							defaultValue: candidate.description || "",
							className: "w-full rounded-lg border border-input bg-card px-4 py-2.5 text-[15px] text-foreground focus:border-primary focus:outline-none"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						className: "rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover",
						children: "Save profile"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => setBannerOpen((v) => !v),
				className: "mt-8 flex w-full items-center justify-between gap-3 rounded-lg bg-success-muted px-5 py-4 text-left",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-5 text-success" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold text-foreground",
						children: "Employers can find you"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `size-5 text-foreground/70 transition-transform ${bannerOpen ? "rotate-180" : ""}` })]
			}),
			bannerOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-b-lg bg-success-muted/60 px-5 pb-4 text-sm text-foreground",
				children: "Your profile and uploaded resume are visible to verified employer searches."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-12 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "font-display text-2xl font-bold text-foreground flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-6 text-primary" }), " Resume"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-hover transition-colors",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-4" }),
						uploadingResume ? "Uploading…" : "Upload resume",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "file",
							accept: ".pdf,.doc,.docx,.txt",
							onChange: handleFileUpload,
							className: "hidden"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 space-y-3",
				children: resumes.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground",
					children: "No resume uploaded yet. Upload a document (PDF, TXT) to save raw text against your profile."
				}) : resumes.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold text-foreground",
								children: r.fileName
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: ["Uploaded ", new Date(r.uploadedAt).toLocaleDateString()]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => handlePreviewResume(r.id),
										className: "text-muted-foreground hover:text-primary transition-colors p-2",
										title: "Preview resume",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-5" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => handleDownloadResume(r.id, r.fileName),
										className: "text-muted-foreground hover:text-primary transition-colors p-2",
										title: "Download resume",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-5" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => handleDeleteResume(r.id),
										className: "text-muted-foreground hover:text-destructive transition-colors p-2",
										title: "Delete resume",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-5" })
									})
								]
							})]
						}),
						previewResumeId === r.id && resumeBlobUrls[r.id] && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 relative h-[600px] w-full overflow-hidden rounded-lg border border-border bg-black/5 flex flex-col items-center justify-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setPreviewResumeId(null),
								className: "absolute right-3 top-3 z-10 flex size-8 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm hover:bg-background hover:text-destructive",
								title: "Close preview",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
							}), r.fileName.toLowerCase().endsWith(".pdf") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
								src: resumeBlobUrls[r.id],
								className: "h-full w-full",
								title: `Preview of ${r.fileName}`
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-center p-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-16 text-muted-foreground mx-auto mb-4" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-lg font-semibold text-foreground mb-2",
										children: "Preview Not Supported"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-sm text-muted-foreground mb-4",
										children: [
											"We cannot preview ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: r.fileName }),
											" natively in the browser. Please download the file to view it."
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => handleDownloadResume(r.id, r.fileName),
										className: "rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover",
										children: "Download Resume"
									})
								]
							})]
						}),
						r.extractedText && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 rounded-lg bg-secondary/50 p-3 text-xs leading-relaxed text-muted-foreground max-h-32 overflow-y-auto",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium text-foreground block mb-1",
								children: "Extracted Text:"
							}), r.extractedText]
						})
					]
				}, r.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-12 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "font-display text-2xl font-bold text-foreground flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "size-6 text-primary" }), " Skills"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setShowAddSkill(!showAddSkill),
					className: "inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Add skill"]
				})]
			}),
			showAddSkill && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleAddSkill,
				className: "mt-4 space-y-4 rounded-xl border border-border bg-card p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "font-semibold text-foreground text-sm",
						children: "Add a Skill"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs text-muted-foreground mb-1",
							children: "Skill name"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							list: "catalog-skills-list",
							placeholder: "e.g. PyTorch, Next.js, Kubernetes",
							value: customSkillName,
							onChange: (e) => setCustomSkillName(e.target.value),
							className: "w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("datalist", {
							id: "catalog-skills-list",
							children: catalogSkills.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: s.name }, s.id))
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs text-muted-foreground mb-1",
						children: "Proficiency"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: proficiency,
						onChange: (e) => setProficiency(e.target.value),
						className: "w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "BEGINNER",
								children: "Beginner"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "INTERMEDIATE",
								children: "Intermediate"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "ADVANCED",
								children: "Advanced"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "EXPERT",
								children: "Expert"
							})
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2 pt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							className: "rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-hover",
							children: "Save skill"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setShowAddSkill(false),
							className: "rounded-lg border border-input px-4 py-2 text-xs font-semibold text-foreground hover:bg-accent",
							children: "Cancel"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 flex flex-wrap gap-2",
				children: skills.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "No skills added yet."
				}) : skills.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm text-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium",
							children: s.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs text-muted-foreground lowercase",
							children: [
								"(",
								s.proficiency,
								")"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => handleDeleteSkill(s.id),
							className: "text-muted-foreground hover:text-destructive",
							children: "×"
						})
					]
				}, s.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-12 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "font-display text-2xl font-bold text-foreground flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "size-6 text-primary" }), " Experience"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setShowAddExp(!showAddExp),
					className: "inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Add experience"]
				})]
			}),
			showAddExp && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleAddExperience,
				className: "mt-4 space-y-4 rounded-xl border border-border bg-card p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "font-semibold text-foreground text-sm",
						children: "Add Work Experience"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs text-muted-foreground mb-1",
							children: "Company name"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							list: "catalog-companies-list",
							placeholder: "e.g. Acme Corp",
							value: expCompany,
							onChange: (e) => setExpCompany(e.target.value),
							className: "w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("datalist", {
							id: "catalog-companies-list",
							children: catalogCompanies.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: c.name }, c.backendId))
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs text-muted-foreground mb-1",
							children: "Role / Job Title"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							list: "catalog-roles-list",
							placeholder: "e.g. Software Engineer",
							value: expRole,
							onChange: (e) => setExpRole(e.target.value),
							className: "w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("datalist", {
							id: "catalog-roles-list",
							children: catalogRoles.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: r.name }, r.id))
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs text-muted-foreground mb-1",
						children: "Description (Optional)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						placeholder: "Describe your responsibilities and achievements",
						value: expDescription,
						onChange: (e) => setExpDescription(e.target.value),
						className: "w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground min-h-[80px]"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs text-muted-foreground mb-1",
								children: "From Date"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "date",
								value: expFromDate,
								onChange: (e) => setExpFromDate(e.target.value),
								className: "w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs text-muted-foreground mb-1",
								children: "To Date (Leave empty if current)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "date",
								value: expToDate,
								onChange: (e) => setExpToDate(e.target.value),
								className: "w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2 pt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							className: "rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-hover",
							children: "Save experience"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setShowAddExp(false),
							className: "rounded-lg border border-input px-4 py-2 text-xs font-semibold text-foreground hover:bg-accent",
							children: "Cancel"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 space-y-3",
				children: experiences.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "No work experience added yet."
				}) : experiences.map((exp) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between rounded-xl border border-border bg-card p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "font-display font-semibold text-foreground text-base",
							children: exp.roleName
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: exp.organizationName || exp.companyName
						}),
						(exp.fromDate || exp.toDate) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground mt-1",
							children: [
								exp.fromDate ? new Date(exp.fromDate).toLocaleDateString() : "N/A",
								" - ",
								exp.toDate ? new Date(exp.toDate).toLocaleDateString() : "Present"
							]
						}),
						exp.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm mt-2 text-muted-foreground/80",
							children: exp.description
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => handleDeleteExperience(exp.experienceId),
						className: "text-muted-foreground hover:text-destructive p-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
					})]
				}, exp.experienceId))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-12 border-t border-border pt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/settings",
					className: "text-sm font-medium text-primary hover:underline",
					children: "Go to account settings"
				})
			})
		]
	});
}
function ContactRow({ icon, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-foreground/70",
			children: icon
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-[15px] text-foreground",
			children: value
		})]
	});
}
function Field({ label, name, defaultValue }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "mb-1.5 block text-sm font-medium text-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			name,
			defaultValue: defaultValue || "",
			className: "w-full rounded-lg border border-input bg-card px-4 py-2 text-[15px] text-foreground focus:border-primary focus:outline-none"
		})]
	});
}
//#endregion
export { ProfilePage as component };
