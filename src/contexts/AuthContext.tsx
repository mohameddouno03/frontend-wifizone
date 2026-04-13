import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import  { authService } from "@/services/auth.service";
import type { UserOutSchema } from "@/types/user";

type UserRole = "admin" | "owner" | "client";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const mapUserToAppUser = (userData: UserOutSchema): User => {
  return {
    id: userData.slug,
    name: `${userData.first_name} ${userData.last_name}`.trim(),
    email: userData.email,
    role: userData.user_type === "admin" ? "admin" : "owner",
  };
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("wifi_user");
    const token = localStorage.getItem("auth_token");
    
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("wifi_user");
        localStorage.removeItem("auth_token");
      }
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<User> => {
    const response = await authService.webSignIn({ username, password });
    localStorage.setItem("auth_token", response.access);
    
    const userData = await authService.getCurrentUser();
    const mappedUser = mapUserToAppUser(userData);
    
    localStorage.setItem("wifi_user", JSON.stringify(mappedUser));
    setUser(mappedUser);
    
    return mappedUser;
  };

  const logout = async (): Promise<void> => {
    localStorage.removeItem("wifi_user");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}