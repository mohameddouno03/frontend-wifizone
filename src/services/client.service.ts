import { apiFetch } from "@/lib/api";
import type {
  InfoDepositIn,
  DepositResponseSchema,
  ClientOut,
  ClientRetrieve,
  ClientBlockedOutSchema,
  ClientActifSchema,
  ClientNoExpireSchema,
} from "@/types/client";

export const clientService = {
  /** Initiate a deposit/payment for a Mikrotik */
  async deposit(mikrotikSlug: string, data: InfoDepositIn): Promise<DepositResponseSchema> {
    return apiFetch<DepositResponseSchema>(`/client/deposit/${mikrotikSlug}`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /** List clients for a Mikrotik */
  async listClients(mikrotikSlug: string): Promise<ClientOut[]> {
    return apiFetch<ClientOut[]>(`/client/${mikrotikSlug}/list-client`);
  },

  /** Get client details */
  async getClient(mikrotikSlug: string, clientSlug: string): Promise<ClientRetrieve> {
    return apiFetch<ClientRetrieve>(`/client/${mikrotikSlug}/retrieve-client/${clientSlug}`);
  },

  /** Block a client */
  async blockClient(mikrotikSlug: string, userSlug: string): Promise<ClientBlockedOutSchema> {
    return apiFetch<ClientBlockedOutSchema>(`/client/${mikrotikSlug}/bloked-client/${userSlug}`, {
      method: "PATCH",
    });
  },

  /** Unblock a client */
  async unblockClient(mikrotikSlug: string, userSlug: string): Promise<ClientBlockedOutSchema> {
    return apiFetch<ClientBlockedOutSchema>(`/client/${mikrotikSlug}/unblok-client/${userSlug}`, {
      method: "PATCH",
    });
  },

  /** Get active clients for a Mikrotik */
  async getActiveClients(mikrotikSlug: string): Promise<ClientActifSchema[]> {
    return apiFetch<ClientActifSchema[]>(`/client/${mikrotikSlug}/actif-client`);
  },

  /** Get non-expired clients for a Mikrotik */
  async getNonExpiredClients(mikrotikSlug: string): Promise<ClientNoExpireSchema[]> {
    return apiFetch<ClientNoExpireSchema[]>(`/client/${mikrotikSlug}/no-expired-client`);
  },
};
