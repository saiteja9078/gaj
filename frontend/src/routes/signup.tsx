import { createFileRoute, Navigate } from "@tanstack/react-router";
import { AuthForm } from "@/components/site/AuthForm";
import { useRole, ROLE_HOME } from "@/lib/role";

function SignUpPage() {
  const { role } = useRole();
  if (role) {
    return <Navigate to={ROLE_HOME[role]} />;
  }
  return <AuthForm mode="signup" />;
}

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create an account — Hirely" },
      { name: "description", content: "Create a Hirely account as a candidate, hiring manager, or company." },
      { property: "og:title", content: "Create an account — Hirely" },
      { property: "og:description", content: "Create an account as a candidate, hiring manager, or company." },
    ],
  }),
  component: SignUpPage,
});
