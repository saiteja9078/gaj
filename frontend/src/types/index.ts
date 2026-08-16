export type UserRole = "candidate" | "hiring" | "company";

export interface Job {
  id: string;
  title: string;
  company: string;
  companySlug: string;
  location: string;
  remote: boolean;
  payLabel: string;
  payMin?: number;
  payMax?: number;
  jobTypes: string[];
  tags: string[];
  easyApply: boolean;
  postedAt: string;
  description: string;
  skills: { name: string; required: boolean }[];
  experience?: string;
  responsibilities: string[];
  benefits: string[];
}

export interface Company {
  backendId?: number;
  slug: string;
  name: string;
  industry: string;
  size: string;
  location: string;
  rating: number;
  reviewCount: number;
  about: string;
  openRoles: number;
}

export interface Review {
  id: string;
  title: string;
  role: string;
  rating: number;
  body: string;
  date: string;
}

export interface CandidateProfile {
  name: string;
  initials: string;
  email: string;
  phone: string;
  location: string;
  visibleToEmployers: boolean;
  desiredPayLabel: string;
  resume: { fileName: string; addedLabel: string } | null;
}

export type ApplicationStage = "applied" | "screening" | "interview" | "offer" | "rejected";

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  appliedAt: string;
  stage: ApplicationStage;
}

export interface Applicant {
  id: string;
  name: string;
  initials: string;
  headline: string;
  location: string;
  appliedAt: string;
  stage: ApplicationStage;
  matchScore: number;
  skills: string[];
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  date: string;
  read: boolean;
}

export interface SalaryEntry {
  role: string;
  category: string;
  averageLabel: string;
  rangeLabel: string;
  jobCount: number;
}
