// services/auth.service.ts
import { apiFetch } from "@/lib/api";
import type { SignInRequest, WebSignInResponse } from "@/types/auth";
import type { UserOutSchema } from "@/types/user";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://dounoh0.pythonanywhere.com/api";

export const authService = {
  async webSignIn(data: SignInRequest): Promise<WebSignInResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/web/sign-in`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || "Échec de l'authentification");
    }
    
    const result = await response.json();
    if (result.refresh) {
      localStorage.setItem("refresh_token", result.refresh);
    }
    return result;
  },

  async webTokenRefresh(): Promise<WebSignInResponse> {
    const refreshToken = localStorage.getItem("refresh_token");
    const response = await fetch(`${API_BASE_URL}/auth/web/token-refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    });
    
    if (!response.ok) {
      throw new Error("Échec du rafraîchissement du token");
    }
    return response.json();
  },

  async getCurrentUser(): Promise<UserOutSchema> {
    return apiFetch<UserOutSchema>("/users/me");
  },

  async webSignOut(): Promise<void> {
    try {
      await apiFetch<void>("/auth/web/sign-out", { method: "POST" });
    } finally {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("wifi_user");
    }
  },
};

export default authService;