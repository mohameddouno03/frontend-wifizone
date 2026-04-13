import { apiFetch } from "@/lib/api";
import type {
  UserOutSchema,
  UserUpdate,
  UserCreate,
  UserPasswordUpdateMe,
  UserPasswordReset,
  UserListResponse,
  UserDetailResponse,
} from "@/types/user";

export const userService = {
  // ==================== CURRENT USER ====================
  
  async getCurrentUser(): Promise<UserOutSchema> {
    return apiFetch<UserOutSchema>("/users/me");
  },

  async updateCurrentUser(data: UserUpdate): Promise<UserOutSchema> {
    return apiFetch<UserOutSchema>("/users/me", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async resetMyPassword(data: UserPasswordUpdateMe): Promise<void> {
    return apiFetch<void>("/users/me/reset_password/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async deleteMyAccount(): Promise<void> {
    return apiFetch<void>("/users/me/delete/", {
      method: "DELETE",
    });
  },

  // ==================== ADMIN USER MANAGEMENT ====================
  
  async listUsers(limit: number = 100, offset: number = 0): Promise<UserListResponse> {
    return apiFetch<UserListResponse>(`/users/profile/users?limit=${limit}&offset=${offset}`);
  },

  async getUser(slug: string): Promise<UserDetailResponse> {
    return apiFetch<UserDetailResponse>(`/users/profile/users/${slug}`);
  },

  async createUser(data: UserCreate): Promise<UserOutSchema> {
    return apiFetch<UserOutSchema>("/users/profile/users/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateUser(slug: string, data: UserUpdate): Promise<UserOutSchema> {
    return apiFetch<UserOutSchema>(`/users/profile/users/${slug}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async resetUserPassword(data: UserPasswordReset): Promise<void> {
    return apiFetch<void>("/users/profile/users/reset_password/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async deleteUser(slug: string): Promise<void> {
    return apiFetch<void>(`/users/profile/users/${slug}/`, {
      method: "DELETE",
    });
  },
};

export default userService;