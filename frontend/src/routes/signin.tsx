import { createFileRoute, Navigate } from "@tanstack/react-router";
import { AuthForm } from "@/components/site/AuthForm";
import { useRole, ROLE_HOME } from "@/lib/role";

function SignInPage() {
  const { role } = useRole();
  if (role) {
    return <Navigate to={ROLE_HOME[role]} />;
  }
  return <AuthForm mode="signin" />;
}

export const Route = createFileRoute("/signin")({
  head: () => ({
    meta: [
      { title: "Sign in — Hirely" },
      { name: "description", content: "Sign in to Hirely as a candidate, hiring manager, or company." },
      { property: "og:title", content: "Sign in — Hirely" },
      { property: "og:description", content: "Sign in as a candidate, hiring manager, or company." },
    ],
  }),
  component: SignInPage,
});
