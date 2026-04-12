import { apiFetch } from "@/lib/api";
import type {
  UserOutSchema,
  UserRetrieveSchema,
  PagedUserOutSchema,
  UserInSchema,
  UserUpdate,
  UserPasswordUpdate,
} from "@/types/user";

export const userService = {
  /** List all users (admin) */
  async listUsers(limit = 100, offset = 0): Promise<PagedUserOutSchema> {
    return apiFetch<PagedUserOutSchema>(`/users/profile/users?limit=${limit}&offset=${offset}`);
  },

  /** Get user by slug */
  async getUser(slug: string): Promise<UserRetrieveSchema> {
    return apiFetch<UserRetrieveSchema>(`/users/profile/users/${slug}`);
  },

  /** Create a new user (owner) */
  async createUser(data: UserInSchema): Promise<UserOutSchema> {
    return apiFetch<UserOutSchema>("/users/profile/users/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /** Update user by slug */
  async updateUser(slug: string, data: UserUpdate): Promise<UserOutSchema> {
    return apiFetch<UserOutSchema>(`/users/profile/users/${slug}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  /** Reset user password (admin) */
  async resetUserPassword(data: UserPasswordUpdate): Promise<void> {
    return apiFetch<void>("/users/profile/users/reset_password/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /** Delete user by slug */
  async deleteUser(slug: string): Promise<void> {
    return apiFetch<void>(`/users/profile/users/${slug}/`, {
      method: "DELETE",
    });
  },
};
