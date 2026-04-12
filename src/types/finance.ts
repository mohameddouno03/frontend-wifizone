export type DepositStatusEnum = "pending" | "success" | "failed";

export interface InfoDepositOut {
  slug: string;
  amount: string;
  phone_number: string;
  payment_method: string;
  status: DepositStatusEnum;
  created_at: string;
}

export interface InfoDepositRetrieve {
  slug: string;
  amount: string;
  phone_number: string;
  number_receve_code: string;
  payment_method: string;
  status: DepositStatusEnum;
  transaction_id: string | null;
  created_at: string;
}
