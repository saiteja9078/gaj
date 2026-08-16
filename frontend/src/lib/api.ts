import type { Company, Job } from "@/types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function locationLabel(location?: { country?: string; state?: string; city?: string }): string {
  if (!location) return "India";
  const parts = [location.city, location.state, location.country].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "India";
}

function money(value?: number): string {
  if (value == null || value === 0) return "Salary not listed";
  return `₹${value.toLocaleString("en-IN")}`;
}

type ApiJobCard = {
  id: number;
  title: string;
  salaryLower?: number;
  salaryHigher?: number;
  postedAt?: string;
  workMode?: string;
  companyName?: string;
};

type ApiJob = ApiJobCard & {
  description?: string;
  location?: { country?: string; state?: string; city?: string };
  type?: string;
  role?: { name?: string };
  jobSkillRequirements?: { name: string; required: boolean }[];
  minimumExperienceInMonths?: number;
};

type ApiCompany = {
  id: number;
  name: string;
  companyProfileUrl?: string;
  location?: { country?: string; state?: string; city?: string };
  industry?: { id?: number; name?: string };
};

function toJob(job: ApiJob): Job {
  const remote = job.workMode?.toLowerCase().includes("remote") ?? false;
  const low = job.salaryLower ?? undefined;
  const high = job.salaryHigher ?? undefined;
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
    skills: job.jobSkillRequirements?.map(s => ({ name: s.name, required: s.required })) ?? [],
    experience: job.minimumExperienceInMonths ? `${Math.floor(job.minimumExperienceInMonths / 12)} years ${job.minimumExperienceInMonths % 12 > 0 ? `${job.minimumExperienceInMonths % 12} months` : ''}`.trim() : undefined,
    responsibilities: [],
    benefits: [],
  };
}

function toCompany(company: ApiCompany): Company {
  return {
    backendId: company.id,
    slug: slugify(company.name),
    name: company.name,
    industry: company.industry?.name ?? "Company",
    size: "",
    location: locationLabel(company.location),
    rating: 0,
    reviewCount: 0,
    about: company.companyProfileUrl || "Learn more about this company and its open roles.",
    openRoles: 0,
  };
}

export function formatErrorMessage(err: unknown, fallback = "An error occurred"): string {
  if (!err) return fallback;
  const msg = err instanceof Error ? err.message : String(err);
  if (
    msg.toLowerCase().includes("failed to fetch") ||
    msg.toLowerCase().includes("networkerror") ||
    msg.toLowerCase().includes("load failed") ||
    msg.toLowerCase().includes("err_failed")
  ) {
    return "Unable to connect to the server. Please check your connection or ensure the backend server is running.";
  }
  return msg || fallback;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("hirely-token") : null;
  const isFormData = init?.body instanceof FormData;
  const headers: Record<string, string> = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }
  if (init?.headers) {
    Object.assign(headers, init.headers);
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers,
    });
  } catch (err) {
    throw new Error(
      "Unable to connect to the server. Please try again later.",
    );
  }

  if ((response.status === 401 || response.status === 403) && typeof window !== "undefined") {
    localStorage.removeItem("hirely-token");
    localStorage.removeItem("hirely-role");
    window.dispatchEvent(new Event("hirely-auth-change"));
    if (window.location.pathname !== "/signin" && window.location.pathname !== "/signup" && window.location.pathname !== "/") {
      window.location.href = "/signin";
    }
  }

  if (!response.ok) {
    let msg = `Request failed (${response.status})`;
    try {
      const body = await response.text();
      if (body) {
        try {
          // Backend returns JSON like {"timestamp":"...","message":"..."}
          const parsed = JSON.parse(body);
          msg = parsed.message || parsed.error || body;
        } catch {
          msg = body;
        }
      }
    } catch {}
    throw new Error(formatErrorMessage(msg));
  }

  if (response.status === 204) {
    return undefined as T;
  }
  const text = await response.text();
  return text ? (JSON.parse(text) as T) : (undefined as T);
}

export function currentUserId(): number | null {
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

export function currentUserRole(): "candidate" | "hiring" | "company" | null {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("hirely-token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.type === "CANDIDATE") return "candidate";
    if (payload.type === "COMPANY") return "company";
    if (payload.type === "HIRING_MANAGER") return "hiring";
    return null;
  } catch {
    return null;
  }
}

export async function authenticate(
  role: "candidate" | "hiring" | "company",
  mode: "signin" | "signup",
  data: Record<string, unknown>,
) {
  const endpoint =
    mode === "signin"
      ? `/auth/login/${role === "hiring" ? "hm" : role}`
      : `/auth/signup/${role === "hiring" ? "hm" : role}`;
  const result = await request<{ token: string }>(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
  });
  localStorage.setItem("hirely-token", result.token);
  
  try {
    const payload = JSON.parse(atob(result.token.split(".")[1]));
    let derivedRole: "candidate" | "hiring" | "company" | null = null;
    if (payload.type === "CANDIDATE") derivedRole = "candidate";
    else if (payload.type === "COMPANY") derivedRole = "company";
    else if (payload.type === "HIRING_MANAGER") derivedRole = "hiring";
    
    if (derivedRole) {
      localStorage.setItem("hirely-role", derivedRole);
    } else {
      localStorage.setItem("hirely-role", role);
    }
  } catch {
    localStorage.setItem("hirely-role", role);
  }

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("hirely-auth-change"));
  }
  return result;
}

// Catalog
export type CatalogItem = { id: number; name: string };
export type CatalogDepartmentItem = { id: number; name: string; companyId: number; companyName: string };
export async function getCatalog() {
  const [skills, roles, industries, companies, departments] = await Promise.all([
    request<CatalogItem[]>("/catalog/skills").catch(() => []),
    request<CatalogItem[]>("/catalog/roles").catch(() => []),
    request<CatalogItem[]>("/catalog/industries").catch(() => []),
    listCompanies().catch(() => []),
    Promise.resolve([]),
  ]);
  return { skills, roles, industries, companies, departments };
}

// Jobs
export async function listJobs(
  query = "",
  filters: any = {},
) {
  const jobs = await request<ApiJobCard[]>("/job/postings", { method: "GET" }).catch(() => []);
  return jobs.map(toJob);
}

export async function listJobsPage(
  query = "",
  filters: any = {},
  page = 0,
  size = 20,
) {
  const jobs = await request<ApiJobCard[]>("/job/postings", { method: "GET" }).catch(() => []);
  return {
    content: jobs.map(toJob),
    totalPages: 1,
    totalElements: jobs.length
  };
}

export async function getJob(id: string) {
  const jobs = await request<ApiJob[]>("/job/postings").catch(() => []);
  const job = jobs.find(j => String(j.id) === id);
  if (!job) throw new Error("Job not found");
  return toJob(job);
}

export async function createJobPosting(data: Record<string, unknown>) {
  return request<ApiJob>("/job/postings", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getEmployerJobs() {
  const list = await request<ApiJob[]>("/job/postings").catch(() => []);
  return list.map(toJob);
}

export async function deleteJobPosting(id: string) {
  return request<void>(`/job/postings/${id}`, { method: "DELETE" });
}

export async function createDepartment(name: string, companyId: number) {
  return request<CatalogDepartmentItem>("/company/departments", {
    method: "POST",
    body: JSON.stringify({ name, companyId }),
  });
}

// Companies
export async function listCompanies() {
  return request<ApiCompany[]>("/company");
}

export async function getCurrentCompany() {
  return request<ApiCompany>("/company/me");
}

export async function updateCompany(data: any) {
  return request<ApiCompany>("/company/me", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export type HiringManagerMember = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  hiringDepartment?: { id: number; name: string };
};

export async function getCompanyHiringManagers() {
  return request<HiringManagerMember[]>("/company/hiring-managers");
}

export async function createHiringManager(data: Record<string, unknown>) {
  return request<{ token: string }>("/company/hiring-managers", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function deleteHiringManager(id: number) {
  return request<void>(`/company/hiring-managers/${id}`, { method: "DELETE" });
}

// Hiring Managers
export async function getCurrentHiringManager() {
  return request<HiringManagerMember>("/hiring-manager/me");
}

export async function updateHiringManager(id: number, data: any) {
  return request<HiringManagerMember>("/hiring-manager/me", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// Reviews
export type CompanyReview = {
  id: number;
  companyId: number;
  candidateName: string;
  stars: number;
  text: string;
  createdAt: string;
};

export async function getCompanyReviews(companyId: number) {
  return request<CompanyReview[]>(`/company/${companyId}/reviews`);
}

export async function addCompanyReview(companyId: number, stars: number, text: string) {
  return request<CompanyReview>("/company/reviews", {
    method: "POST",
    body: JSON.stringify({ company_id: companyId, stars, text }),
  });
}

// Candidate Profile & Experience & Skills
export type Candidate = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  description?: string;
  location?: { country?: string; state?: string; city?: string };
};

export async function getCurrentCandidate() {
  return request<Candidate>("/candidate/me");
}

export async function updateCandidate(data: Partial<Candidate>) {
  return request<Candidate>("/candidate/me", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export type CandidateSkill = {
  id: number;
  name: string;
  proficiency: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
};

export async function getCandidateSkills() {
  return request<CandidateSkill[]>("/candidate/skills");
}

export async function saveCandidateSkills(
  addExistingSkills: { id: number; proficiency: string }[],
  createNewSkills: { name: string; proficiency: string }[],
) {
  return request<void>("/candidate/skills", {
    method: "POST",
    body: JSON.stringify({ addExistingSkills, createNewSkills }),
  });
}

export async function deleteCandidateSkill(skillId: number) {
  return request<void>(`/candidate/skills/${skillId}`, { method: "DELETE" });
}

export type CandidateExperience = {
  experienceId: number;
  companyName?: string;
  organizationName?: string;
  roleName: string;
  description?: string;
  fromDate?: string;
  toDate?: string;
};

export async function getCandidateExperiences() {
  return request<CandidateExperience[]>("/candidate/experiences");
}

export async function addCandidateExperience(exp: {
  organizationName: string;
  roleName: string;
  description?: string;
  fromDate: string;
  toDate?: string;
}) {
  return request<void>("/candidate/experiences", {
    method: "POST",
    body: JSON.stringify({
      role_id: 1,
      company_id: 1,
      organizationName: exp.organizationName,
      description: exp.description || "",
      fromDate: exp.fromDate ? `${exp.fromDate}T00:00:00` : new Date().toISOString(),
      toDate: exp.toDate ? `${exp.toDate}T00:00:00` : null,
    }),
  });
}

export async function deleteCandidateExperience(id: number) {
  return request<void>(`/candidate/experiences/${id}`, { method: "DELETE" });
}

// Resumes
export type Resume = {
  id: number;
  fileName: string;
  uploadedAt: string;
  extractedText?: string;
};

export async function getResumes() {
  return request<Resume[]>("/candidate/resumes");
}

export async function uploadResume(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return request<Resume>("/candidate/resumes", {
    method: "POST",
    body: formData,
  });
}

export async function deleteResume(id: number) {
  return request<void>(`/candidate/resumes/${id}`, { method: "DELETE" });
}

export async function fetchResumeBlobUrl(id: number) {
  const token = typeof window !== "undefined" ? localStorage.getItem("hirely-token") : null;
  const res = await fetch(`${API_URL}/candidate/resumes/${id}/blob`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
  if (!res.ok) throw new Error("Failed to fetch resume blob");
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}

// Applications & Applicants
export async function applyToJob(jobId: string, candidateId: number, coverLetter?: string, resumeId?: number, alerts?: boolean) {
  return request<void>("/job/apply", {
    method: "POST",
    body: JSON.stringify({
      job_posting_id: Number(jobId),
      coverLetter: coverLetter || "",
      resume_id: resumeId || 1,
      status: "APPLIED"
    }),
  });
}

export type UserApplication = {
  id: number;
  jobId: number;
  jobTitle: string;
  companyName: string;
  appliedAt: string;
  status: "APPLIED" | "SCREENING" | "INTERVIEW" | "OFFER" | "REJECTED";
};

export async function getMyApplications() {
  return request<UserApplication[]>("/job/applications/me");
}

export type JobApplicant = {
  applicationId: number;
  candidateId: number;
  firstName: string;
  lastName: string;
  email: string;
  description?: string;
  location?: { country?: string; state?: string; city?: string };
  appliedAt: string;
  status: "APPLIED" | "SCREENING" | "INTERVIEW" | "OFFER" | "REJECTED";
  skills: CandidateSkill[];
  experiences: CandidateExperience[];
  coverLetter?: string;
  resumeId?: number;
  resumeName?: string;
};

export async function getJobApplicants(jobId: string) {
  return request<JobApplicant[]>(`/job/${jobId}/applicants`);
}

export async function updateApplicationStatus(
  applicationId: number,
  status: "APPLIED" | "SCREENING" | "INTERVIEW" | "OFFER" | "REJECTED",
) {
  return request<UserApplication>(`/job/applications/${applicationId}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}

export async function deleteJobApplication(applicationId: number) {
  return request<void>(`/job/applications/${applicationId}`, { method: "DELETE" });
}

export interface DetailedApplication {
  id: number;
  status: string;
  appliedAt: string;
  coverLetter: string | null;
  resumeId: number | null;

  jobId: number;
  jobTitle: string;
  jobDescription: string;
  jobLocation: Location;
  jobWorkMode: string;
  jobSalaryLower: number;
  jobSalaryHigher: number;
  companyId: number;
  companyName: string;
  totalApplicants: number;
}

export async function getApplicationDetails(applicationId: number) {
  return request<DetailedApplication>(`/job/applications/${applicationId}`);
}

export async function downloadApplicationResumeBlob(applicationId: number): Promise<Blob> {
  const token = typeof window !== "undefined" ? localStorage.getItem("hirely-token") : null;
  const res = await fetch(`${API_URL}/job/applications/${applicationId}/resume`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
  if (!res.ok) throw new Error("Failed to fetch resume blob");
  return res.blob();
}

// End of api functions

// Notifications
export type AppNotificationResponse = {
  id: number;
  title: string;
  message: string;
  createdAt: string;
};

export async function getNotifications() {
  return request<AppNotificationResponse[]>("/notifications");
}
