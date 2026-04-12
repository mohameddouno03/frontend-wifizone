import { apiFetch } from "@/lib/api";
import type {
  SubscriptionCategorieOutSchema,
  SubscriptionCategorieInSchema,
  SubscriptionCategorieUpdateSchema,
  SubscriptionVpnInSchema,
  SubscriptionResponse,
} from "@/types/mikrotik";

export const subscriptionService = {
  /** Create a subscription category */
  async createCategory(data: SubscriptionCategorieInSchema): Promise<SubscriptionCategorieOutSchema> {
    return apiFetch<SubscriptionCategorieOutSchema>("/subscription/vpn/categories", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /** Get subscription categories */
  async getCategories(): Promise<SubscriptionCategorieOutSchema[]> {
    return apiFetch<SubscriptionCategorieOutSchema[]>("/subscription/vpn/categories");
  },

  /** Update a subscription category */
  async updateCategory(slug: string, data: SubscriptionCategorieUpdateSchema): Promise<SubscriptionCategorieOutSchema> {
    return apiFetch<SubscriptionCategorieOutSchema>(`/subscription/vpn/categories/${slug}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  /** Subscribe to VPN */
  async subscribe(data: SubscriptionVpnInSchema): Promise<SubscriptionResponse> {
    return apiFetch<SubscriptionResponse>("/subscription/vpn/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
