import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { UserRole } from "@/types";

const STORAGE_KEY = "hirely-role";
const TOKEN_KEY = "hirely-token";

export const ROLE_LABELS: Record<UserRole, string> = {
  candidate: "Candidate",
  hiring: "Hiring Manager",
  company: "Company",
};

export const ROLE_HOME: Record<UserRole, string> = {
  candidate: "/dashboard",
  hiring: "/hiring",
  company: "/company",
};

interface RoleContextValue {
  role: UserRole | null;
  setRole: (role: UserRole | null) => void;
  logout: () => void;
}

const RoleContext = createContext<RoleContextValue>({
  role: null,
  setRole: () => {},
  logout: () => {},
});

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<UserRole | null>(null);

  const checkAuth = useCallback(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem(TOKEN_KEY);
    let storedRole = localStorage.getItem(STORAGE_KEY) as UserRole | null;

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const isExpired = payload.exp * 1000 < Date.now();
        if (isExpired) {
          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem(TOKEN_KEY);
          setRoleState(null);
          return;
        }

        if (!storedRole) {
          if (payload.type === "CANDIDATE") storedRole = "candidate";
          else if (payload.type === "COMPANY") storedRole = "company";
          else if (payload.type === "HIRING_MANAGER") storedRole = "hiring";

          if (storedRole) {
            localStorage.setItem(STORAGE_KEY, storedRole);
          }
        }
      } catch (err) {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(TOKEN_KEY);
        setRoleState(null);
        return;
      }
    }

    if (token && storedRole && (storedRole === "candidate" || storedRole === "hiring" || storedRole === "company")) {
      setRoleState(storedRole);
    } else {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(TOKEN_KEY);
      setRoleState(null);
    }
  }, []);

  useEffect(() => {
    checkAuth();

    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener("hirely-auth-change", handleAuthChange);
    return () => window.removeEventListener("hirely-auth-change", handleAuthChange);
  }, [checkAuth]);

  const setRole = useCallback((next: UserRole | null) => {
    if (next) {
      localStorage.setItem(STORAGE_KEY, next);
    } else {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(TOKEN_KEY);
    }
    setRoleState(next);
    window.dispatchEvent(new Event("hirely-auth-change"));
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setRoleState(null);
    window.dispatchEvent(new Event("hirely-auth-change"));
  }, []);

  return <RoleContext.Provider value={{ role, setRole, logout }}>{children}</RoleContext.Provider>;
}

export function useRole() {
  return useContext(RoleContext);
}
