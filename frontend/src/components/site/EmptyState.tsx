import type { ReactNode } from "react";

interface EmptyStateProps {
  illustration?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ illustration, title, description, action }: EmptyStateProps) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-20 text-center">
      {illustration}
      <h1 className="mt-8 font-display text-3xl font-bold text-foreground sm:text-4xl">{title}</h1>
      <p className="mt-4 text-[17px] leading-relaxed text-muted-foreground">{description}</p>
      {action && <div className="mt-8">{action}</div>}
    </div>
  );
}
