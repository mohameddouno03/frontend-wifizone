import { apiFetch } from "@/lib/api";
import type { InfoDepositOut, InfoDepositRetrieve } from "@/types/finance";

export const financeService = {
  /** List deposits for a Mikrotik */
  async listDeposits(mikrotikSlug: string): Promise<InfoDepositOut[]> {
    return apiFetch<InfoDepositOut[]>(`/finance/${mikrotikSlug}/list-deposit`);
  },

  /** Get deposit details */
  async getDeposit(mikrotikSlug: string, depositSlug: string): Promise<InfoDepositRetrieve> {
    return apiFetch<InfoDepositRetrieve>(`/finance/${mikrotikSlug}/retrieve/${depositSlug}`);
  },
};
