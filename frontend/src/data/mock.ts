import type {
  AppNotification,
  Applicant,
  Application,
  CandidateProfile,
  Company,
  Job,
  Review,
  SalaryEntry,
} from "@/types";

export const candidate: CandidateProfile = {
  name: "Bejavada Sai Teja",
  initials: "BS",
  email: "bsaitejaai@gmail.com",
  phone: "063011 05642",
  location: "Guntur, Andhra Pradesh, 522308, IN",
  visibleToEmployers: true,
  desiredPayLabel: "₹8K / mo",
  resume: { fileName: "saiteja_resume_ai.pdf", addedLabel: "Added today" },
};

export const jobs: Job[] = [
  {
    id: "python-developer-intern",
    title: "Python Developer Intern",
    company: "Aizilus Technologies",
    companySlug: "aizilus-technologies",
    location: "Remote",
    remote: true,
    payLabel: "From ₹10,000 a month",
    payMin: 10000,
    jobTypes: ["Internship", "Fresher", "Full-time"],
    tags: ["Flexible schedule"],
    easyApply: true,
    postedAt: "2 days ago",
    description:
      "Work alongside our platform team building Python services that power data pipelines and internal tooling. You'll ship real features from your first week with mentorship from senior engineers.",
    responsibilities: [
      "Build and maintain Python services and scripts",
      "Write tests and take part in code reviews",
      "Support data ingestion and reporting workflows",
    ],
    benefits: ["Flexible schedule", "Work from home", "Certificate on completion"],
  },
  {
    id: "programming-analyst-ai-trainer",
    title: "Progamming Analyst- AI Trainer",
    company: "DataAnnotation",
    companySlug: "dataannotation",
    location: "Mumbai, Maharashtra",
    remote: true,
    payLabel: "₹50 - ₹100 an hour",
    payMin: 50,
    payMax: 100,
    jobTypes: ["Full-time", "Contract"],
    tags: ["Work from home", "Flexible schedule"],
    easyApply: true,
    postedAt: "5 days ago",
    description:
      "Help train large language models by reviewing code, writing prompts, and rating model responses across a range of programming languages.",
    responsibilities: [
      "Assess model-generated code for correctness",
      "Write reference solutions and explanations",
      "Flag edge cases and failure modes",
    ],
    benefits: ["Work from home", "Choose your own hours"],
  },
  {
    id: "java-developer-ai-trainer",
    title: "Java Developer - AI Trainer",
    company: "DataAnnotation",
    companySlug: "dataannotation",
    location: "Bengaluru, Karnataka",
    remote: true,
    payLabel: "₹60 - ₹120 an hour",
    payMin: 60,
    payMax: 120,
    jobTypes: ["Part-time", "Contract"],
    tags: ["Work from home"],
    easyApply: true,
    postedAt: "1 week ago",
    description:
      "Review Java code produced by AI systems, correct mistakes, and write high quality reference implementations used for model training.",
    responsibilities: [
      "Review and rewrite Java snippets",
      "Document reasoning for each correction",
      "Collaborate with the research team on rubric updates",
    ],
    benefits: ["Work from home", "Flexible schedule"],
  },
  {
    id: "frontend-engineer",
    title: "Frontend Engineer",
    company: "Northwind Labs",
    companySlug: "northwind-labs",
    location: "Hyderabad, Telangana",
    remote: false,
    payLabel: "₹9,00,000 - ₹14,00,000 a year",
    payMin: 900000,
    payMax: 1400000,
    jobTypes: ["Full-time"],
    tags: ["Hybrid", "Health insurance"],
    easyApply: false,
    postedAt: "3 days ago",
    description:
      "Own the customer-facing surface of our analytics product. You will build accessible React interfaces and shape the design system alongside product designers.",
    responsibilities: [
      "Build React + TypeScript interfaces",
      "Extend and maintain the design system",
      "Partner with design on interaction details",
    ],
    benefits: ["Health insurance", "Provident fund", "Learning budget"],
  },
  {
    id: "data-analyst",
    title: "Data Analyst",
    company: "Meridian Retail",
    companySlug: "meridian-retail",
    location: "Pune, Maharashtra",
    remote: false,
    payLabel: "₹6,00,000 - ₹9,00,000 a year",
    payMin: 600000,
    payMax: 900000,
    jobTypes: ["Full-time", "Fresher"],
    tags: ["On-site"],
    easyApply: true,
    postedAt: "Today",
    description:
      "Turn store and e-commerce data into decisions. You'll build dashboards, run analyses, and present findings to category managers.",
    responsibilities: [
      "Build SQL models and dashboards",
      "Run ad-hoc analyses for merchandising",
      "Present insights to non-technical stakeholders",
    ],
    benefits: ["Health insurance", "Annual bonus"],
  },
  {
    id: "product-designer",
    title: "Product Designer",
    company: "Northwind Labs",
    companySlug: "northwind-labs",
    location: "Remote",
    remote: true,
    payLabel: "₹10,00,000 - ₹16,00,000 a year",
    payMin: 1000000,
    payMax: 1600000,
    jobTypes: ["Full-time"],
    tags: ["Remote", "Flexible schedule"],
    easyApply: false,
    postedAt: "6 days ago",
    description:
      "Design end-to-end flows for a data product used by thousands of operators every day, from first sketch to shipped detail.",
    responsibilities: [
      "Lead discovery and concept work",
      "Deliver high-fidelity flows and specs",
      "Maintain the shared component library",
    ],
    benefits: ["Remote-first", "Home office stipend"],
  },
];

export const companies: Company[] = [
  {
    slug: "aizilus-technologies",
    name: "Aizilus Technologies",
    industry: "Software Development",
    size: "51 to 200 employees",
    location: "Remote-first, India",
    rating: 4.1,
    reviewCount: 218,
    about:
      "Aizilus builds automation tooling for mid-market logistics companies. Small teams, short feedback loops, and a strong mentoring culture for early-career engineers.",
    openRoles: 6,
  },
  {
    slug: "dataannotation",
    name: "DataAnnotation",
    industry: "AI & Machine Learning",
    size: "1,001 to 5,000 employees",
    location: "Distributed",
    rating: 3.9,
    reviewCount: 1240,
    about:
      "DataAnnotation works with research labs to produce high-quality training data. Most roles are fully flexible and contributor-paced.",
    openRoles: 24,
  },
  {
    slug: "northwind-labs",
    name: "Northwind Labs",
    industry: "Analytics",
    size: "201 to 500 employees",
    location: "Hyderabad, Telangana",
    rating: 4.4,
    reviewCount: 512,
    about:
      "Northwind Labs makes analytics software for operations teams. Product-led, design-heavy, and deliberate about engineering quality.",
    openRoles: 11,
  },
  {
    slug: "meridian-retail",
    name: "Meridian Retail",
    industry: "Retail",
    size: "5,001 to 10,000 employees",
    location: "Pune, Maharashtra",
    rating: 3.6,
    reviewCount: 3105,
    about:
      "Meridian Retail runs 400+ stores across India alongside a growing e-commerce business.",
    openRoles: 38,
  },
];

export const reviews: Record<string, Review[]> = {
  "aizilus-technologies": [
    {
      id: "r1",
      title: "Great place to start a career",
      role: "Python Developer Intern",
      rating: 5,
      body: "Mentorship is real here. I shipped production code in my second week and reviews were always constructive.",
      date: "12 June 2026",
    },
    {
      id: "r2",
      title: "Fast paced, occasionally chaotic",
      role: "Backend Engineer",
      rating: 4,
      body: "Lots of ownership, but priorities can shift week to week. Good if you like variety.",
      date: "3 May 2026",
    },
  ],
  dataannotation: [
    {
      id: "r3",
      title: "Flexible work that actually is flexible",
      role: "AI Trainer",
      rating: 4,
      body: "You choose your hours and the work is genuinely interesting if you enjoy reading code.",
      date: "28 May 2026",
    },
  ],
  "northwind-labs": [
    {
      id: "r4",
      title: "High bar, supportive team",
      role: "Frontend Engineer",
      rating: 5,
      body: "Design and engineering work closely together. Code review culture is the best I've had.",
      date: "9 July 2026",
    },
  ],
  "meridian-retail": [
    {
      id: "r5",
      title: "Stable, traditional",
      role: "Data Analyst",
      rating: 3,
      body: "Good benefits and job security. Tooling is dated but improving.",
      date: "21 April 2026",
    },
  ],
};

export const notifications: AppNotification[] = [];

export const applications: Application[] = [
  {
    id: "a1",
    jobId: "python-developer-intern",
    jobTitle: "Python Developer Intern",
    company: "Aizilus Technologies",
    appliedAt: "Today",
    stage: "applied",
  },
];

export const applicants: Applicant[] = [
  {
    id: "c1",
    name: "Ananya Rao",
    initials: "AR",
    headline: "Python Developer · 2 yrs",
    location: "Hyderabad, IN",
    appliedAt: "2 hours ago",
    stage: "applied",
    matchScore: 92,
    skills: ["Python", "FastAPI", "PostgreSQL"],
  },
  {
    id: "c2",
    name: "Rohit Menon",
    initials: "RM",
    headline: "Backend Engineer · 4 yrs",
    location: "Bengaluru, IN",
    appliedAt: "Yesterday",
    stage: "screening",
    matchScore: 88,
    skills: ["Python", "Django", "AWS"],
  },
  {
    id: "c3",
    name: "Sara Fernandes",
    initials: "SF",
    headline: "Fresher · CS Graduate",
    location: "Goa, IN",
    appliedAt: "2 days ago",
    stage: "interview",
    matchScore: 81,
    skills: ["Python", "Pandas", "SQL"],
  },
  {
    id: "c4",
    name: "Imran Qureshi",
    initials: "IQ",
    headline: "Data Engineer · 3 yrs",
    location: "Pune, IN",
    appliedAt: "4 days ago",
    stage: "offer",
    matchScore: 95,
    skills: ["Airflow", "Python", "dbt"],
  },
];

export const salaries: SalaryEntry[] = [
  { role: "Software Engineer", category: "Engineering", averageLabel: "₹9,80,000 / yr", rangeLabel: "₹5.2L – ₹21L", jobCount: 12480 },
  { role: "Data Analyst", category: "Data", averageLabel: "₹6,40,000 / yr", rangeLabel: "₹3.4L – ₹12L", jobCount: 5820 },
  { role: "Product Designer", category: "Design", averageLabel: "₹11,20,000 / yr", rangeLabel: "₹6L – ₹24L", jobCount: 1930 },
  { role: "AI Trainer", category: "Data", averageLabel: "₹85 / hr", rangeLabel: "₹50 – ₹140", jobCount: 4410 },
  { role: "Product Manager", category: "Product", averageLabel: "₹18,60,000 / yr", rangeLabel: "₹10L – ₹38L", jobCount: 2210 },
  { role: "Customer Support Executive", category: "Operations", averageLabel: "₹3,20,000 / yr", rangeLabel: "₹1.8L – ₹5.5L", jobCount: 8760 },
];

export const jobCategories = [
  "Remote",
  "Internship",
  "Fresher",
  "Software Engineering",
  "Data & Analytics",
  "Design",
  "Sales",
  "Customer Support",
];

export function getJob(id: string): Job | undefined {
  return jobs.find((j) => j.id === id);
}

export function getCompany(slug: string): Company | undefined {
  return companies.find((c) => c.slug === slug);
}
