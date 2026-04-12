import { apiFetch } from "@/lib/api";
import type { SignInRequest, WebSignInResponse } from "@/types/auth";
import type { UserOutSchema, UserUpdate, UserPasswordUpdateMe } from "@/types/user";

export const authService = {
  /** Web sign in - returns access token (refresh in httpOnly cookie) */
  async webSignIn(data: SignInRequest): Promise<WebSignInResponse> {
    return apiFetch<WebSignInResponse>("/auth/web/sign-in", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /** Refresh web token */
  async webTokenRefresh(): Promise<WebSignInResponse> {
    return apiFetch<WebSignInResponse>("/auth/web/token-refresh", {
      method: "POST",
    });
  },

  /** Web sign out */
  async webSignOut(): Promise<void> {
    return apiFetch<void>("/auth/web/sign-out", {
      method: "POST",
    });
  },

  /** Get current authenticated user */
  async getCurrentUser(): Promise<UserOutSchema> {
    return apiFetch<UserOutSchema>("/users/me");
  },

  /** Update current user profile */
  async updateCurrentUser(data: UserUpdate): Promise<UserOutSchema> {
    return apiFetch<UserOutSchema>("/users/me", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  /** Reset current user password */
  async resetMyPassword(data: UserPasswordUpdateMe): Promise<void> {
    return apiFetch<void>("/users/me/reset_password/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /** Delete current user account */
  async deleteMyAccount(): Promise<void> {
    return apiFetch<void>("/users/me/delete/", {
      method: "DELETE",
    });
  },
};
