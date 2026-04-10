import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

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
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Mock users for demo - replace with real API calls
const MOCK_USERS: Record<string, User & { password: string }> = {
  "admin@wifi.com": { id: "a1", name: "Administrateur", email: "admin@wifi.com", role: "admin", password: "admin123" },
  "owner@wifi.com": { id: "o1", name: "Jean Dupont", email: "owner@wifi.com", role: "owner", password: "owner123" },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("wifi_user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback(async (email: string, password: string) => {
    // TODO: Replace with real API call
    const mockUser = MOCK_USERS[email];
    if (!mockUser || mockUser.password !== password) {
      throw new Error("Email ou mot de passe incorrect");
    }
    const { password: _, ...userData } = mockUser;
    localStorage.setItem("wifi_user", JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("wifi_user");
    localStorage.removeItem("auth_token");
    setUser(null);
  }, []);

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
