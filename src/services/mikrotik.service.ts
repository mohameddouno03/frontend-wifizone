// services/mikrotik.service.ts
import { apiFetch } from "@/lib/api";
import type {
  MicrotikOutListSchema,
  PagedMicrotikOutListSchema,
  MicrotikOutRetrieveSchema,
  MicrotikInSchema,
  MicrotikUpdateSchema,
  MicrotikCheckSchema,
  MicrotikCheckResponseSchema,
  ProfilOutSchema,
  ProfilInSchema,
  ProfilUpdateSchema,
  ProfilResponseSchema,
} from "@/types/mikrotik";

const CURRENCY = "GNF";

export const mikrotikService = {
  // ==================== MIKROTIK CRUD ====================
  
  async create(data: MicrotikInSchema): Promise<MicrotikOutListSchema> {
    return apiFetch<MicrotikOutListSchema>("/microtik/create", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async checkConnection(data: MicrotikCheckSchema): Promise<MicrotikCheckResponseSchema> {
    return apiFetch<MicrotikCheckResponseSchema>("/microtik/check-connexion", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async update(slug: string, data: MicrotikUpdateSchema): Promise<MicrotikOutListSchema> {
    return apiFetch<MicrotikOutListSchema>(`/microtik/update/${slug}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async list(limit = 100, offset = 0): Promise<PagedMicrotikOutListSchema> {
    return apiFetch<PagedMicrotikOutListSchema>(`/microtik/list/?limit=${limit}&offset=${offset}`);
  },

  async retrieve(slug: string): Promise<MicrotikOutRetrieveSchema> {
    return apiFetch<MicrotikOutRetrieveSchema>(`/microtik/retrieve/${slug}/`);
  },

  async delete(slug: string): Promise<void> {
    return apiFetch<void>(`/microtik/delete/${slug}/`, {
      method: "DELETE",
    });
  },

  // ==================== PROFILS ====================
  
  async createProfile(mikrotikSlug: string, data: ProfilInSchema): Promise<ProfilResponseSchema> {
    return apiFetch<ProfilResponseSchema>(`/microtik/${mikrotikSlug}/profile-create/`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateProfile(mikrotikSlug: string, profilSlug: string, data: ProfilUpdateSchema): Promise<ProfilResponseSchema> {
    return apiFetch<ProfilResponseSchema>(`/microtik/${mikrotikSlug}/update-profile/${profilSlug}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async deleteProfile(mikrotikSlug: string, profilSlug: string): Promise<ProfilResponseSchema> {
    return apiFetch<ProfilResponseSchema>(`/microtik/${mikrotikSlug}/delete-profil/${profilSlug}/`, {
      method: "DELETE",
    });
  },

  async listProfiles(mikrotikSlug: string): Promise<ProfilOutSchema[]> {
    return apiFetch<ProfilOutSchema[]>(`/microtik/${mikrotikSlug}/list-profil/`);
  },
  
  // ==================== SUBSCRIPTION ====================
  
  async subscribe(mikrotikSlug: string, categorySlug: string): Promise<{ status: string; message: string }> {
    return apiFetch<{ status: string; message: string }>(`/microtik/${mikrotikSlug}/subscribe/`, {
      method: "POST",
      body: JSON.stringify({ category_slug: categorySlug }),
    });
  },

  // ==================== UTILITAIRES ====================
  
  formatCurrency(amount: number | string): string {
    const value = typeof amount === "string" ? parseFloat(amount) : amount;
    return `${value.toLocaleString("fr-FR")} ${CURRENCY}`;
  },
};

export default mikrotikService;