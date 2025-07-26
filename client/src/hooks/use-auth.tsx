import { createContext, useContext, useState, useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";
import type { User, Supplier } from "@shared/schema";

interface AuthContextType {
  user: User | null;
  supplier: Supplier | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem("user");
    const savedSupplier = localStorage.getItem("supplier");
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedSupplier) {
      setSupplier(JSON.parse(savedSupplier));
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await apiRequest("POST", "/api/auth/login", { email, password });
    const data = await response.json();
    
    setUser(data.user);
    setSupplier(data.supplier);
    
    localStorage.setItem("user", JSON.stringify(data.user));
    if (data.supplier) {
      localStorage.setItem("supplier", JSON.stringify(data.supplier));
    }
  };

  const register = async (userData: any) => {
    const response = await apiRequest("POST", "/api/auth/register", userData);
    const data = await response.json();
    
    setUser(data.user);
    localStorage.setItem("user", JSON.stringify(data.user));
  };

  const logout = () => {
    setUser(null);
    setSupplier(null);
    localStorage.removeItem("user");
    localStorage.removeItem("supplier");
  };

  return (
    <AuthContext.Provider value={{ user, supplier, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
