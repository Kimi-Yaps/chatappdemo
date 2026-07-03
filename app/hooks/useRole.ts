"use client";

import { useState, useEffect } from "react";

export type UserRole = "student" | "landlord" | null;

export function useRole() {
  const [role, setRoleState] = useState<UserRole>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("mersingrental_role") as UserRole | null;
    setRoleState(stored);
    setLoaded(true);
  }, []);

  const setRole = (r: UserRole) => {
    if (r) localStorage.setItem("mersingrental_role", r);
    else localStorage.removeItem("mersingrental_role");
    setRoleState(r);
  };

  return { role, setRole, loaded };
}
