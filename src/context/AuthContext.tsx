"use client";

import { createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { demoTeacher } from "@/data/seed";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { Teacher } from "@/lib/types";

type AuthContextValue = {
  teacher: Teacher | null;
  ready: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [teacher, setTeacher, ready] = useLocalStorage<Teacher | null>("srh.teacher", null);

  function login(email: string, password: string) {
    if (!email.trim() || !password.trim()) return false;
    setTeacher({ ...demoTeacher, email });
    router.push("/");
    return true;
  }

  function logout() {
    setTeacher(null);
    router.push("/login");
  }

  return <AuthContext.Provider value={{ teacher, ready, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
