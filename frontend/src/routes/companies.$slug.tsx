import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import {
  addCompanyReview,
  formatErrorMessage,
  getCompanyReviews,
  listCompanies,
  listJobsPage,
  type CompanyReview,
} from "@/lib/api";
import type { Company, Job } from "@/types";

export const Route = createFileRoute("/companies/$slug")({
  loader: async ({ params }) => {
    const companies = await listCompanies();
    const company = companies.find((item) => item.slug === params.slug);
    if (!company) throw notFound();
    let jobs: Job[] = [];
    if (company.backendId) {
      const page = await listJobsPage("", { companyIds: [company.backendId] }, 0, 100);
      jobs = page.content;
    }
    return { company, jobs };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Company not found — Hirely" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = `${loaderData.company.name} reviews — Hirely`;
    const description = `Learn more about open roles and reviews for ${loaderData.company.name}.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: CompanyDetail,
});

function CompanyDetail() {
  const { company, jobs: companyJobs } = Route.useLoaderData();
  const [reviews, setReviews] = useState<CompanyReview[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  // Add review form
  const [showAddReview, setShowAddReview] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (company.backendId) {
      getCompanyReviews(company.backendId)
        .then(setReviews)
        .catch(() => setReviews([]))
        .finally(() => setLoadingReviews(false));
    } else {
      setLoadingReviews(false);
    }
  }, [company.backendId]);

  async function handleAddReview(e: FormEvent) {
    e.preventDefault();
    if (!company.backendId) return;
    if (!comment.trim()) {
      toast.error("Please provide a review comment.");
      return;
    }
    setSubmitting(true);
    try {
      const newRev = await addCompanyReview(company.backendId, rating, comment.trim());
      setReviews([newRev, ...reviews]);
      toast.success("Review posted!");
      setComment("");
      setShowAddReview(false);
    } catch (err) {
      toast.error(formatErrorMessage(err, "Must be signed in as a candidate to review"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-[900px] px-4 py-12 sm:px-6">
      <Link to="/companies" className="text-sm text-primary hover:underline">
        ← All companies
      </Link>

      <h1 className="mt-4 font-display text-4xl font-bold text-foreground">{company.name}</h1>
      <p className="mt-2 text-[15px] text-muted-foreground">
        {company.industry} {company.location ? `· ${company.location}` : ""}
      </p>
      {company.about && <p className="mt-4 text-[15px] leading-relaxed text-foreground">{company.about}</p>}

      {/* Open Roles */}
      <h2 className="mt-12 font-display text-2xl font-bold text-foreground">Open roles ({companyJobs.length})</h2>
      <div className="mt-4 space-y-3">
        {companyJobs.length === 0 ? (
          <p className="text-sm text-muted-foreground">No live roles right now.</p>
        ) : (
          companyJobs.map((j) => (
            <Link
              key={j.id}
              to="/apply/$jobId"
              params={{ jobId: j.id }}
              className="block rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md"
            >
              <p className="font-display text-lg font-semibold text-foreground">{j.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {j.location} · {j.payLabel}
              </p>
            </Link>
          ))
        )}
      </div>

      {/* Reviews Section */}
      <div className="mt-12 flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold text-foreground">Reviews ({reviews.length})</h2>
        <button
          type="button"
          onClick={() => setShowAddReview(!showAddReview)}
          className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-hover"
        >
          Write a review
        </button>
      </div>

      {showAddReview && (
        <form onSubmit={handleAddReview} className="mt-4 space-y-4 rounded-xl border border-border bg-card p-5">
          <h4 className="font-semibold text-foreground text-sm">Write a Company Review</h4>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Rating (1 to 5)</label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground"
            >
              <option value={5}>5 Stars - Excellent</option>
              <option value={4}>4 Stars - Good</option>
              <option value={3}>3 Stars - Average</option>
              <option value={2}>2 Stars - Poor</option>
              <option value={1}>1 Star - Terrible</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Comment</label>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience working at or interviewing with this company…"
              className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-hover"
            >
              {submitting ? "Submitting…" : "Submit Review"}
            </button>
            <button
              type="button"
              onClick={() => setShowAddReview(false)}
              className="rounded-lg border border-input px-4 py-2 text-xs font-semibold text-foreground hover:bg-accent"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="mt-4 space-y-4">
        {loadingReviews ? (
          <p className="text-sm text-muted-foreground">Loading reviews…</p>
        ) : reviews.length === 0 ? (
          <p className="text-sm text-muted-foreground">No reviews posted yet.</p>
        ) : (
          reviews.map((r) => (
            <article key={r.id} className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`size-4 ${i < r.stars ? "fill-current text-chart-4" : "text-border"}`}
                  />
                ))}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                By {r.candidateName || "Candidate"} · {new Date(r.createdAt).toLocaleDateString()}
              </p>
              <p className="mt-3 text-[15px] leading-relaxed text-foreground">{r.text}</p>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
