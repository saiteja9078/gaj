import { Link } from "@tanstack/react-router";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`inline-flex items-baseline gap-0.5 ${className}`} aria-label="Hirely home">
      <span className="font-display text-2xl font-bold tracking-tight text-primary">hirely</span>
      <span className="size-1.5 rounded-full bg-primary" aria-hidden />
    </Link>
  );
}
