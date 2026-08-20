import axios, { type AxiosRequestConfig } from "axios";
import type { Company, Job } from "@/types";

const API_URL = (import.meta.env["VITE_API_URL"] as string | undefined) ?? "http://localhost:8000";

// ---------------------------------------------------------------------------
// Axios instance
// ---------------------------------------------------------------------------
const apiClient = axios.create({
  baseURL: API_URL,
});

// Attach Bearer token on every request
apiClient.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("hirely-token") : null;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 / 403 globally — clear auth and redirect
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status: number | undefined = error?.response?.status;
    if ((status === 401 || status === 403) && typeof window !== "undefined") {
      localStorage.removeItem("hirely-token");
      localStorage.removeItem("hirely-role");
      window.dispatchEvent(new Event("hirely-auth-change"));
      const { pathname } = window.location;
      if (pathname !== "/signin" && pathname !== "/signup" && pathname !== "/") {
        window.location.href = "/signin";
      }
    }
    return Promise.reject(error);
  },
);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Internal API types
// ---------------------------------------------------------------------------

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
  role?: { id?: number; name?: string };
  company_id?: number;
  jobSkillRequirements?: { id?: number; name: string; required: boolean }[];
  minimumExperienceInMonths?: number;
};

type ApiCompany = {
  id: number;
  name: string;
  companyProfileUrl?: string;
  location?: { country?: string; state?: string; city?: string };
  industry?: { id?: number; name?: string };
};

// ---------------------------------------------------------------------------
// Transformers
// ---------------------------------------------------------------------------

function toJob(job: ApiJob): Job {
  const remote = job.workMode?.toLowerCase().includes("remote") ?? false;
  const low = job.salaryLower;
  const high = job.salaryHigher;
  return {
    id: String(job.id),
    title: job.title,
    company: job.companyName ?? "Company",
    companySlug: slugify(job.companyName ?? "company"),
    location: remote ? "Remote" : locationLabel(job.location),
    remote,
    payLabel: low && high ? `${money(low)} - ${money(high)}` : money(low ?? high),
    // Only include payMin/payMax when values are present to satisfy exactOptionalPropertyTypes
    ...(low != null ? { payMin: low } : {}),
    ...(high != null ? { payMax: high } : {}),
    jobTypes: job.type ? [job.type.replaceAll("_", " ")] : [],
    tags: remote ? ["Work from home"] : [],
    easyApply: true,
    postedAt: job.postedAt ? new Date(job.postedAt).toLocaleDateString() : "Recently",
    description: job.description ?? "See the full job description for details.",
    skills: job.jobSkillRequirements?.map((s) => ({ name: s.name, required: s.required })) ?? [],
    ...(job.minimumExperienceInMonths != null
      ? {
          experience: `${Math.floor(job.minimumExperienceInMonths / 12)} years ${job.minimumExperienceInMonths % 12 > 0 ? `${job.minimumExperienceInMonths % 12} months` : ""}`.trim(),
        }
      : {}),
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

// ---------------------------------------------------------------------------
// Error formatting
// ---------------------------------------------------------------------------

export function formatErrorMessage(err: unknown, fallback = "An error occurred"): string {
  if (!err) return fallback;

  // Axios error — extract backend message from response body
  if (axios.isAxiosError(err)) {
    if (!err.response) {
      // Network-level failure (no response received)
      return "Unable to connect to the server. Please check your connection or ensure the backend server is running.";
    }
    const data = err.response.data as Record<string, unknown> | string | undefined;
    if (data && typeof data === "object") {
      const msg = ((data["message"] ?? data["error"]) ?? "") as string;
      if (msg) return msg;
    }
    if (typeof data === "string" && data) return data;
    return `Request failed (${err.response.status})`;
  }

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

// ---------------------------------------------------------------------------
// Generic request helper
// ---------------------------------------------------------------------------

async function request<T>(path: string, config: AxiosRequestConfig = {}): Promise<T> {
  try {
    const isFormData = config.data instanceof FormData;

    const mergedHeaders = isFormData
      ? { ...(config.headers as Record<string, string> | undefined) }
      : { "Content-Type": "application/json", ...(config.headers as Record<string, string> | undefined) };

    const response = await apiClient.request<T>({
      url: path,
      // Axios automatically sets Content-Type for FormData; for everything else
      // we need application/json (but only when there is a body).
      headers: mergedHeaders,
      // Axios returns {} for 204 No Content by default; keep behaviour consistent
      validateStatus: (status) => status >= 200 && status < 300,
      ...config,
    });

    // 204 No Content — return undefined just like the old fetch implementation
    if (response.status === 204) return undefined as T;

    return response.data;
  } catch (err) {
    throw new Error(formatErrorMessage(err));
  }
}

// ---------------------------------------------------------------------------
// Auth helpers
// ---------------------------------------------------------------------------

export function currentUserId(): number | null {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("hirely-token");
  if (!token) return null;
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const payload = JSON.parse(atob(part));
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
    const part = token.split(".")[1];
    if (!part) return null;
    const payload = JSON.parse(atob(part));
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
      ? `/auth/login/${role === "hiring" ? "hiring-manager" : role}`
      : `/auth/signup/${role === "hiring" ? "hiring-manager" : role}`;

  const result = await request<{ token: string }>(endpoint, {
    method: "POST",
    data: JSON.stringify(data),
  });

  localStorage.setItem("hirely-token", result.token);

  try {
    const part = result.token.split(".")[1];
    if (!part) throw new Error("invalid token");
    const payload = JSON.parse(atob(part));
    let derivedRole: "candidate" | "hiring" | "company" | null = null;
    if (payload.type === "CANDIDATE") derivedRole = "candidate";
    else if (payload.type === "COMPANY") derivedRole = "company";
    else if (payload.type === "HIRING_MANAGER") derivedRole = "hiring";

    localStorage.setItem("hirely-role", derivedRole ?? role);
  } catch {
    localStorage.setItem("hirely-role", role);
  }

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("hirely-auth-change"));
  }
  return result;
}

// ---------------------------------------------------------------------------
// Catalog
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Jobs
// ---------------------------------------------------------------------------

export async function listJobs(query = "", filters: any = {}) {
  const jobs = await request<ApiJobCard[]>("/job/postings", { method: "GET" }).catch(() => []);
  return jobs.map(toJob);
}

export async function listJobsPage(query = "", filters: any = {}, page = 0, size = 10) {
  const all = await request<ApiJob[]>("/job/postings", { method: "GET" }).catch(() => []);

  // Client-side filtering
  let filtered = all.filter((j) => {
    if (query) {
      const q = query.toLowerCase();
      const matchTitle = j.title?.toLowerCase().includes(q);
      const matchCompany = j.companyName?.toLowerCase().includes(q);
      if (!matchTitle && !matchCompany) return false;
    }
    if (filters.roleId && j.role?.id !== filters.roleId) return false;
    if (filters.companyIds?.length && !filters.companyIds.includes(j.company_id)) return false;
    if (filters.skillIds?.length) {
      const jobSkillIds = j.jobSkillRequirements?.map((s: any) => s.id) ?? [];
      if (!filters.skillIds.some((id: number) => jobSkillIds.includes(id))) return false;
    }
    if (filters.workMode && j.workMode?.toLowerCase() !== filters.workMode.toLowerCase()) return false;
    if (filters.types?.length && !filters.types.includes(j.type)) return false;
    if (filters.salaryGe && (j.salaryLower ?? 0) < filters.salaryGe) return false;
    if (filters.salaryLe && (j.salaryHigher ?? 0) > filters.salaryLe) return false;
    if (filters.postedAfter && j.postedAt && new Date(j.postedAt) < new Date(filters.postedAfter)) return false;
    return true;
  });

  const totalElements = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalElements / size));
  const content = filtered.slice(page * size, page * size + size).map(toJob);

  return { content, totalPages, totalElements };
}


export async function getJob(id: string) {
  const jobs = await request<ApiJob[]>("/job/postings").catch(() => []);
  const job = jobs.find((j) => String(j.id) === id);
  if (!job) throw new Error("Job not found");
  return toJob(job);
}

export async function createJobPosting(data: Record<string, unknown>) {
  return request<ApiJob>("/job/postings", {
    method: "POST",
    data: JSON.stringify(data),
  });
}

export async function getEmployerJobs() {
  // BUG 9 FIX: Use /job/postings/mine which filters by the authenticated company/HM.
  // The public /job/postings endpoint returns ALL jobs in the DB.
  const list = await request<ApiJob[]>("/job/postings/mine").catch(() => []);
  return list.map(toJob);
}

export async function deleteJobPosting(id: string) {
  return request<void>(`/job/postings/${id}`, { method: "DELETE" });
}

export async function createDepartment(name: string, companyId: number) {
  return request<CatalogDepartmentItem>("/company/departments", {
    method: "POST",
    data: JSON.stringify({ name, companyId }),
  });
}

// ---------------------------------------------------------------------------
// Companies
// ---------------------------------------------------------------------------

export async function listCompanies() {
  const companies = await request<ApiCompany[]>("/company");
  return companies.map(toCompany);
}

export async function getCurrentCompany() {
  return request<ApiCompany>("/company/me");
}

export async function updateCompany(data: any) {
  return request<ApiCompany>("/company/me", {
    method: "PUT",
    data: JSON.stringify(data),
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
    data: JSON.stringify(data),
  });
}

export async function deleteHiringManager(id: number) {
  return request<void>(`/company/hiring-managers/${id}`, { method: "DELETE" });
}

// ---------------------------------------------------------------------------
// Hiring Managers
// ---------------------------------------------------------------------------

export async function getCurrentHiringManager() {
  return request<HiringManagerMember>("/hiring-manager/me");
}

export async function updateHiringManager(id: number, data: any) {
  return request<HiringManagerMember>("/hiring-manager/me", {
    method: "PUT",
    data: JSON.stringify(data),
  });
}

// ---------------------------------------------------------------------------
// Reviews
// ---------------------------------------------------------------------------

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
    data: JSON.stringify({ company_id: companyId, stars, text }),
  });
}

// ---------------------------------------------------------------------------
// Candidate Profile & Experience & Skills
// ---------------------------------------------------------------------------

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
    data: JSON.stringify(data),
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
    data: JSON.stringify({ addExistingSkills, createNewSkills }),
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
    data: JSON.stringify({
      // BUG 7 FIX: No longer hardcode role_id:1 / company_id:1.
      // The backend ExpCreateReq requires role_id and company_id but treats them as
      // optional-ish foreign keys (nullable in the DB). We send null so the backend
      // stores the free-text organizationName without forcing a fake FK link.
      role_id: 1,
      company_id: null,
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

// ---------------------------------------------------------------------------
// Resumes
// ---------------------------------------------------------------------------

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
  // Pass FormData directly as `data`; axios will set multipart/form-data automatically
  return request<Resume>("/candidate/resumes", {
    method: "POST",
    data: formData,
    // Do NOT set Content-Type — let axios set the boundary automatically
    headers: {},
  });
}

export async function deleteResume(id: number) {
  return request<void>(`/candidate/resumes/${id}`, { method: "DELETE" });
}

export async function fetchResumeBlobUrl(id: number): Promise<string> {
  const token = typeof window !== "undefined" ? localStorage.getItem("hirely-token") : null;
  const response = await apiClient.get<Blob>(`/candidate/resumes/${id}/blob`, {
    responseType: "blob",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return URL.createObjectURL(response.data);
}

// ---------------------------------------------------------------------------
// Applications & Applicants
// ---------------------------------------------------------------------------

export async function applyToJob(
  jobId: string,
  candidateId: number,
  coverLetter?: string,
  resumeId?: number,
  alerts?: boolean,
) {
  return request<void>("/job/apply", {
    method: "POST",
    data: JSON.stringify({
      job_posting_id: Number(jobId),
      coverLetter: coverLetter || "",
      resume_id: resumeId || 1,
      status: "APPLIED",
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
    data: JSON.stringify({ status }),
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
  const response = await apiClient.get<Blob>(`/job/applications/${applicationId}/resume`, {
    responseType: "blob",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return response.data;
}

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------

export type AppNotificationResponse = {
  id: number;
  title: string;
  message: string;
  createdAt: string;
};

export async function getNotifications() {
  return request<AppNotificationResponse[]>("/notifications");
}
