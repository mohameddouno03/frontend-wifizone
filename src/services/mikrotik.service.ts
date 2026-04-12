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
} from "@/types/mikrotik";

export const mikrotikService = {
  /** Create a new Mikrotik */
  async create(data: MicrotikInSchema): Promise<MicrotikOutListSchema> {
    return apiFetch<MicrotikOutListSchema>("/microtik/create", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /** Check Mikrotik VPN connection */
  async checkConnection(data: MicrotikCheckSchema): Promise<MicrotikCheckResponseSchema> {
    return apiFetch<MicrotikCheckResponseSchema>("/microtik/check-connexion", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /** Update a Mikrotik */
  async update(slug: string, data: MicrotikUpdateSchema): Promise<MicrotikOutListSchema> {
    return apiFetch<MicrotikOutListSchema>(`/microtik/update/${slug}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  /** List all Mikrotiks */
  async list(limit = 100, offset = 0): Promise<PagedMicrotikOutListSchema> {
    return apiFetch<PagedMicrotikOutListSchema>(`/microtik/list/?limit=${limit}&offset=${offset}`);
  },

  /** Get Mikrotik details */
  async retrieve(slug: string): Promise<MicrotikOutRetrieveSchema> {
    return apiFetch<MicrotikOutRetrieveSchema>(`/microtik/retrieve/${slug}/`);
  },

  /** Create a profile for a Mikrotik */
  async createProfile(mikrotikSlug: string, data: ProfilInSchema): Promise<ProfilOutSchema> {
    return apiFetch<ProfilOutSchema>(`/microtik/${mikrotikSlug}/profile-create/`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /** Update a Mikrotik profile */
  async updateProfile(mikrotikSlug: string, profilSlug: string, data: ProfilUpdateSchema): Promise<ProfilOutSchema> {
    return apiFetch<ProfilOutSchema>(`/microtik/${mikrotikSlug}/update-profile/${profilSlug}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  /** Delete a Mikrotik profile */
  async deleteProfile(mikrotikSlug: string, profilSlug: string): Promise<void> {
    return apiFetch<void>(`/microtik/${mikrotikSlug}/delete-profil/${profilSlug}/`, {
      method: "DELETE",
    });
  },

  /** List profiles for a Mikrotik */
  async listProfiles(mikrotikSlug: string): Promise<ProfilOutSchema[]> {
    return apiFetch<ProfilOutSchema[]>(`/microtik/${mikrotikSlug}/list-profil/`);
  },
};
