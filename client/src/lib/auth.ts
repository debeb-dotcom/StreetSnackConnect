import type { User } from "@shared/schema";

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  
  const stored = localStorage.getItem("user");
  return stored ? JSON.parse(stored) : null;
}

export function requireAuth(): User {
  const user = getStoredUser();
  if (!user) {
    throw new Error("Authentication required");
  }
  return user;
}

export function hasRole(user: User | null, role: string): boolean {
  return user?.role === role;
}
