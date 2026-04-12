export type PaymentMethod = "OM" | "MOMO" | "PAYCARD" | "SOUTRA_MONEY";

export type DepositStatus = "pending" | "success" | "failed";

export interface InfoDepositIn {
  payment_method: PaymentMethod;
  profil_slug: string;
  phone_number: string;
  number_receve_code: string;
}

export interface DepositResponseSchema {
  status: string;
  message: string;
}

export interface ClientIn {
  username: string;
  password: string;
  profile: string;
}

export interface ClientCreateResponse {
  status: string;
  message: string;
}

export interface ClientOut {
  slug: string;
  username: string;
  is_blocked: boolean;
  is_active: boolean;
  created_at: string;
  microtik: {
    slug: string;
    name: string;
  };
}

export interface ClientRetrieve {
  slug: string;
  username: string;
  is_blocked: boolean;
  is_active: boolean;
  created_at: string;
  expire_at: string;
  profile: string;
}

export interface ClientBlockedOutSchema {
  slug: string;
  username: string;
  is_blocked: boolean;
}

export interface ClientActifSchema {
  slug: string;
  username: string;
  is_active: boolean;
}

export interface ClientNoExpireSchema {
  slug: string;
  username: string;
  expire_at: string;
}
