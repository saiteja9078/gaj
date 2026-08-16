import { createFileRoute, Link, Navigate, redirect } from "@tanstack/react-router";
import { ChevronDown, ChevronRight, Eye, Download, X, Mail, MapPin, Plus, Trash2, Upload, Briefcase, Award, FileText } from "lucide-react";
import { useRole } from "@/lib/role";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import {
  addCandidateExperience,
  deleteCandidateExperience,
  deleteCandidateSkill,
  deleteResume,
  formatErrorMessage,
  getCandidateExperiences,
  getCandidateSkills,
  getCatalog,
  getCurrentCandidate,
  getResumes,
  saveCandidateSkills,
  updateCandidate,
  uploadResume,
  fetchResumeBlobUrl,
  type Candidate,
  type CandidateExperience,
  type CandidateSkill,
  type CatalogItem,
  type Resume,
} from "@/lib/api";

export const Route = createFileRoute("/profile")({
  beforeLoad: () => { if (typeof window === "undefined") return;
    const token = localStorage.getItem("hirely-token");
    const role = localStorage.getItem("hirely-role");
    if (!token || role !== "candidate") {
      throw redirect({ to: "/signin" });
    }
  },
  head: () => ({
    meta: [
      { title: "Your profile — Hirely" },
      {
        name: "description",
        content: "Manage your contact details, skills, experiences, and resume.",
      },
      { property: "og:title", content: "Your profile — Hirely" },
      {
        property: "og:description",
        content: "Manage your contact details, skills, experiences, and resume.",
      },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { role } = useRole();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [skills, setSkills] = useState<CandidateSkill[]>([]);
  const [experiences, setExperiences] = useState<CandidateExperience[]>([]);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [catalogSkills, setCatalogSkills] = useState<CatalogItem[]>([]);
  const [catalogRoles, setCatalogRoles] = useState<CatalogItem[]>([]);
  const [catalogCompanies, setCatalogCompanies] = useState<import("@/types").Company[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit forms state
  const [editingProfile, setEditingProfile] = useState(false);
  const [bannerOpen, setBannerOpen] = useState(false);

  // Skill state
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [customSkillName, setCustomSkillName] = useState("");
  const [proficiency, setProficiency] = useState<"BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT">("INTERMEDIATE");

  // Experience state
  const [showAddExp, setShowAddExp] = useState(false);
  const [expCompany, setExpCompany] = useState("");
  const [expRole, setExpRole] = useState("");
  const [expDescription, setExpDescription] = useState("");
  const [expFromDate, setExpFromDate] = useState("");
  const [expToDate, setExpToDate] = useState("");

  // Resume upload state
  const [uploadingResume, setUploadingResume] = useState(false);
  const [previewResumeId, setPreviewResumeId] = useState<number | null>(null);
  const [resumeBlobUrls, setResumeBlobUrls] = useState<Record<number, string>>({});

  useEffect(() => {
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
        getCatalog().catch(() => ({ skills: [], roles: [], industries: [], companies: [] })),
      ]);
      setCandidate(cand);
      setSkills(sks);
      setExperiences(exps);
      setResumes(res);
      setCatalogSkills(cat.skills || []);
      setCatalogRoles(cat.roles || []);
      setCatalogCompanies(cat.companies || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="mx-auto max-w-[760px] px-4 py-12 text-muted-foreground">Loading profile…</div>;
  }

  if (role !== "candidate") {
    return <Navigate to="/signin" />;
  }

  if (!candidate) {
    return (
      <div className="mx-auto max-w-[760px] px-4 py-12 text-center text-muted-foreground">
        <p className="text-lg">Sign in as a candidate to view your profile.</p>
        <Link to="/signin" className="mt-4 inline-block font-semibold text-primary hover:underline">
          Sign in now →
        </Link>
      </div>
    );
  }

  const name = `${candidate.firstName || ""} ${candidate.lastName || ""}`.trim() || "Candidate";
  const initials = `${(candidate.firstName?.[0] || "").toUpperCase()}${(candidate.lastName?.[0] || "").toUpperCase()}` || "C";
  const location = [candidate.location?.city, candidate.location?.state, candidate.location?.country]
    .filter(Boolean)
    .join(", ");

  async function handleUpdateProfile(e: FormEvent) {
    e.preventDefault();
    const form = new FormData(e.currentTarget as HTMLFormElement);
    try {
      const updated = await updateCandidate({
        firstName: String(form.get("firstName") || ""),
        lastName: String(form.get("lastName") || ""),
        email: String(form.get("email") || ""),
        description: String(form.get("description") || ""),
      });
      setCandidate(updated);
      setEditingProfile(false);
      toast.success("Profile details updated.");
    } catch (err) {
      toast.error(formatErrorMessage(err, "Failed to update profile"));
    }
  }

  async function handleAddSkill(e: FormEvent) {
    e.preventDefault();
    if (!customSkillName.trim()) {
      toast.error("Please enter a skill name.");
      return;
    }
    
    try {
      const match = catalogSkills.find((s) => s.name.toLowerCase() === customSkillName.trim().toLowerCase());
      if (match) {
        await saveCandidateSkills([{ id: match.id, proficiency }], []);
      } else {
        await saveCandidateSkills([], [{ name: customSkillName.trim(), proficiency }]);
      }
      
      toast.success("Skill added.");
      setShowAddSkill(false);
      setCustomSkillName("");
      const updatedSks = await getCandidateSkills();
      setSkills(updatedSks);
    } catch (err) {
      toast.error(formatErrorMessage(err, "Failed to add skill"));
    }
  }

  async function handleDeleteSkill(skillId: number) {
    try {
      await deleteCandidateSkill(skillId);
      setSkills(skills.filter((s) => s.id !== skillId));
      toast.success("Skill removed.");
    } catch (err) {
      toast.error(formatErrorMessage(err, "Failed to remove skill"));
    }
  }

  async function handleAddExperience(e: FormEvent) {
    e.preventDefault();
    if (!expCompany.trim() || !expRole.trim() || !expFromDate) {
      toast.error("Please provide company, role, and from date.");
      return;
    }
    try {
      const companyMatch = catalogCompanies.find(c => c.name.toLowerCase() === expCompany.trim().toLowerCase());
      
      await addCandidateExperience({ 
        organizationName: expCompany.trim(),
        companyId: companyMatch?.backendId,
        roleName: expRole.trim(),
        description: expDescription.trim(),
        fromDate: expFromDate,
        toDate: expToDate || undefined,
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

  async function handleDeleteExperience(id: number) {
    try {
      await deleteCandidateExperience(id);
      setExperiences(experiences.filter((e) => e.experienceId !== id));
      toast.success("Experience removed.");
    } catch (err) {
      toast.error(formatErrorMessage(err, "Failed to remove experience"));
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
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

  async function handleDeleteResume(id: number) {
    try {
      await deleteResume(id);
      setResumes(resumes.filter((r) => r.id !== id));
      if (previewResumeId === id) setPreviewResumeId(null);
      toast.success("Resume deleted.");
    } catch (err) {
      toast.error(formatErrorMessage(err, "Failed to delete resume"));
    }
  }

  async function handlePreviewResume(id: number) {
    if (previewResumeId === id) {
      setPreviewResumeId(null);
      return;
    }
    if (!resumeBlobUrls[id]) {
      try {
        toast.loading("Loading resume preview...", { id: "preview-loading" });
        const url = await fetchResumeBlobUrl(id);
        setResumeBlobUrls((prev) => ({ ...prev, [id]: url }));
        toast.dismiss("preview-loading");
      } catch (err) {
        toast.dismiss("preview-loading");
        toast.error("Failed to load resume for preview");
        return;
      }
    }
    setPreviewResumeId(id);
  }

  async function handleDownloadResume(id: number, fileName: string) {
    let url = resumeBlobUrls[id];
    if (!url) {
      try {
        toast.loading("Downloading resume...", { id: "download-loading" });
        url = await fetchResumeBlobUrl(id);
        setResumeBlobUrls((prev) => ({ ...prev, [id]: url }));
        toast.dismiss("download-loading");
      } catch (err) {
        toast.dismiss("download-loading");
        toast.error("Failed to download resume");
        return;
      }
    }
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  return (
    <div className="mx-auto max-w-[760px] px-4 py-12 sm:px-6">
      {/* Header Info */}
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="font-display text-4xl font-bold text-foreground sm:text-5xl">{name}</h1>
          {candidate.description && (
            <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{candidate.description}</p>
          )}
        </div>
        <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-secondary font-display text-2xl font-semibold text-secondary-foreground">
          {initials}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <ContactRow icon={<Mail className="size-5" />} value={candidate.email} />
        <ContactRow icon={<MapPin className="size-5" />} value={location || "India"} />
        <button
          type="button"
          onClick={() => setEditingProfile(!editingProfile)}
          className="ml-auto text-sm font-semibold text-primary hover:underline"
        >
          {editingProfile ? "Cancel" : "Edit details"}
        </button>
      </div>

      {/* Edit Profile Form */}
      {editingProfile && (
        <form onSubmit={handleUpdateProfile} className="mt-6 space-y-4 rounded-xl border border-border bg-card p-6">
          <h3 className="font-display text-lg font-bold text-foreground">Edit Contact & Bio</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="First name" name="firstName" defaultValue={candidate.firstName} />
            <Field label="Last name" name="lastName" defaultValue={candidate.lastName} />
          </div>
          <Field label="Email" name="email" defaultValue={candidate.email} />
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">Short bio / description</span>
            <textarea
              name="description"
              rows={3}
              defaultValue={candidate.description || ""}
              className="w-full rounded-lg border border-input bg-card px-4 py-2.5 text-[15px] text-foreground focus:border-primary focus:outline-none"
            />
          </label>
          <button
            type="submit"
            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            Save profile
          </button>
        </form>
      )}

      {/* Visibility Banner */}
      <button
        type="button"
        onClick={() => setBannerOpen((v) => !v)}
        className="mt-8 flex w-full items-center justify-between gap-3 rounded-lg bg-success-muted px-5 py-4 text-left"
      >
        <span className="flex items-center gap-3">
          <Eye className="size-5 text-success" />
          <span className="font-semibold text-foreground">Employers can find you</span>
        </span>
        <ChevronDown
          className={`size-5 text-foreground/70 transition-transform ${bannerOpen ? "rotate-180" : ""}`}
        />
      </button>
      {bannerOpen && (
        <p className="rounded-b-lg bg-success-muted/60 px-5 pb-4 text-sm text-foreground">
          Your profile and uploaded resume are visible to verified employer searches.
        </p>
      )}

      {/* Resume Section */}
      <div className="mt-12 flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <FileText className="size-6 text-primary" /> Resume
        </h2>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-hover transition-colors">
          <Upload className="size-4" />
          {uploadingResume ? "Uploading…" : "Upload resume"}
          <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleFileUpload} className="hidden" />
        </label>
      </div>

      <div className="mt-4 space-y-3">
        {resumes.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
            No resume uploaded yet. Upload a document (PDF, TXT) to save raw text against your profile.
          </div>
        ) : (
          resumes.map((r) => (
            <div key={r.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-foreground">{r.fileName}</p>
                  <p className="text-xs text-muted-foreground">
                    Uploaded {new Date(r.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handlePreviewResume(r.id)}
                    className="text-muted-foreground hover:text-primary transition-colors p-2"
                    title="Preview resume"
                  >
                    <Eye className="size-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownloadResume(r.id, r.fileName)}
                    className="text-muted-foreground hover:text-primary transition-colors p-2"
                    title="Download resume"
                  >
                    <Download className="size-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteResume(r.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors p-2"
                    title="Delete resume"
                  >
                    <Trash2 className="size-5" />
                  </button>
                </div>
              </div>
              {previewResumeId === r.id && resumeBlobUrls[r.id] && (
                <div className="mt-4 relative h-[600px] w-full overflow-hidden rounded-lg border border-border bg-black/5 flex flex-col items-center justify-center">
                  <button 
                    onClick={() => setPreviewResumeId(null)} 
                    className="absolute right-3 top-3 z-10 flex size-8 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm hover:bg-background hover:text-destructive"
                    title="Close preview"
                  >
                    <X className="size-4" />
                  </button>
                  {r.fileName.toLowerCase().endsWith(".pdf") ? (
                    <iframe src={resumeBlobUrls[r.id]} className="h-full w-full" title={`Preview of ${r.fileName}`} />
                  ) : (
                    <div className="text-center p-6">
                      <FileText className="size-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">Preview Not Supported</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        We cannot preview <strong>{r.fileName}</strong> natively in the browser. Please download the file to view it.
                      </p>
                      <button
                        onClick={() => handleDownloadResume(r.id, r.fileName)}
                        className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
                      >
                        Download Resume
                      </button>
                    </div>
                  )}
                </div>
              )}
              {r.extractedText && (
                <div className="mt-3 rounded-lg bg-secondary/50 p-3 text-xs leading-relaxed text-muted-foreground max-h-32 overflow-y-auto">
                  <span className="font-medium text-foreground block mb-1">Extracted Text:</span>
                  {r.extractedText}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Skills Section */}
      <div className="mt-12 flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <Award className="size-6 text-primary" /> Skills
        </h2>
        <button
          type="button"
          onClick={() => setShowAddSkill(!showAddSkill)}
          className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
        >
          <Plus className="size-4" /> Add skill
        </button>
      </div>

      {showAddSkill && (
        <form onSubmit={handleAddSkill} className="mt-4 space-y-4 rounded-xl border border-border bg-card p-5">
          <h4 className="font-semibold text-foreground text-sm">Add a Skill</h4>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Skill name</label>
            <input
              type="text"
              list="catalog-skills-list"
              placeholder="e.g. PyTorch, Next.js, Kubernetes"
              value={customSkillName}
              onChange={(e) => setCustomSkillName(e.target.value)}
              className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground"
            />
            <datalist id="catalog-skills-list">
              {catalogSkills.map((s) => (
                <option key={s.id} value={s.name} />
              ))}
            </datalist>
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Proficiency</label>
            <select
              value={proficiency}
              onChange={(e) => setProficiency(e.target.value as any)}
              className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground"
            >
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
              <option value="EXPERT">Expert</option>
            </select>
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-hover"
            >
              Save skill
            </button>
            <button
              type="button"
              onClick={() => setShowAddSkill(false)}
              className="rounded-lg border border-input px-4 py-2 text-xs font-semibold text-foreground hover:bg-accent"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {skills.length === 0 ? (
          <p className="text-sm text-muted-foreground">No skills added yet.</p>
        ) : (
          skills.map((s) => (
            <span
              key={s.id}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm text-foreground"
            >
              <span className="font-medium">{s.name}</span>
              <span className="text-xs text-muted-foreground lowercase">({s.proficiency})</span>
              <button
                type="button"
                onClick={() => handleDeleteSkill(s.id)}
                className="text-muted-foreground hover:text-destructive"
              >
                ×
              </button>
            </span>
          ))
        )}
      </div>

      {/* Experience Section */}
      <div className="mt-12 flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <Briefcase className="size-6 text-primary" /> Experience
        </h2>
        <button
          type="button"
          onClick={() => setShowAddExp(!showAddExp)}
          className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
        >
          <Plus className="size-4" /> Add experience
        </button>
      </div>

      {showAddExp && (
        <form onSubmit={handleAddExperience} className="mt-4 space-y-4 rounded-xl border border-border bg-card p-5">
          <h4 className="font-semibold text-foreground text-sm">Add Work Experience</h4>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Company name</label>
            <input
              type="text"
              list="catalog-companies-list"
              placeholder="e.g. Acme Corp"
              value={expCompany}
              onChange={(e) => setExpCompany(e.target.value)}
              className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground"
            />
            <datalist id="catalog-companies-list">
              {catalogCompanies.map(c => (
                <option key={c.backendId} value={c.name} />
              ))}
            </datalist>
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Role / Job Title</label>
            <input
              type="text"
              list="catalog-roles-list"
              placeholder="e.g. Software Engineer"
              value={expRole}
              onChange={(e) => setExpRole(e.target.value)}
              className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground"
            />
            <datalist id="catalog-roles-list">
              {catalogRoles.map(r => (
                <option key={r.id} value={r.name} />
              ))}
            </datalist>
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Description (Optional)</label>
            <textarea
              placeholder="Describe your responsibilities and achievements"
              value={expDescription}
              onChange={(e) => setExpDescription(e.target.value)}
              className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground min-h-[80px]"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs text-muted-foreground mb-1">From Date</label>
              <input
                type="date"
                value={expFromDate}
                onChange={(e) => setExpFromDate(e.target.value)}
                className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-muted-foreground mb-1">To Date (Leave empty if current)</label>
              <input
                type="date"
                value={expToDate}
                onChange={(e) => setExpToDate(e.target.value)}
                className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground"
              />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-hover"
            >
              Save experience
            </button>
            <button
              type="button"
              onClick={() => setShowAddExp(false)}
              className="rounded-lg border border-input px-4 py-2 text-xs font-semibold text-foreground hover:bg-accent"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="mt-4 space-y-3">
        {experiences.length === 0 ? (
          <p className="text-sm text-muted-foreground">No work experience added yet.</p>
        ) : (
          experiences.map((exp) => (
            <div key={exp.experienceId} className="flex items-center justify-between rounded-xl border border-border bg-card p-5">
              <div>
                <h4 className="font-display font-semibold text-foreground text-base">{exp.roleName}</h4>
                <p className="text-sm text-muted-foreground">{exp.organizationName || exp.companyName}</p>
                {(exp.fromDate || exp.toDate) && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {exp.fromDate ? new Date(exp.fromDate).toLocaleDateString() : "N/A"} - {exp.toDate ? new Date(exp.toDate).toLocaleDateString() : "Present"}
                  </p>
                )}
                {exp.description && <p className="text-sm mt-2 text-muted-foreground/80">{exp.description}</p>}
              </div>
              <button
                type="button"
                onClick={() => handleDeleteExperience(exp.experienceId)}
                className="text-muted-foreground hover:text-destructive p-2"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="mt-12 border-t border-border pt-6">
        <Link to="/settings" className="text-sm font-medium text-primary hover:underline">
          Go to account settings
        </Link>
      </div>
    </div>
  );
}

function ContactRow({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-foreground/70">{icon}</span>
      <span className="text-[15px] text-foreground">{value}</span>
    </div>
  );
}

function Field({ label, name, defaultValue }: { label: string; name: string; defaultValue?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      <input
        name={name}
        defaultValue={defaultValue || ""}
        className="w-full rounded-lg border border-input bg-card px-4 py-2 text-[15px] text-foreground focus:border-primary focus:outline-none"
      />
    </label>
  );
}
