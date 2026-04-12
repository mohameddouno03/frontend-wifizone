export type MikroTikRateLimit =
  | "256k/512k"
  | "512k/1M"
  | "1M/2M"
  | "2M/4M"
  | "4M/8M"
  | "5M/10M"
  | "10M/20M"
  | "20M/50M"
  | "50M/100M"
  | "0/0";

export type CurrencyEnum = "gnf";

export type StatusEnum = "disable" | "active";

export type ProfilDurationEnum = "m" | "h" | "d";

export type SubscriptionCategoriEnum = "mensuel" | "trimestriel" | "annuel";

export interface MicrotikOutListSchema {
  slug: string;
  name: string;
  wallet_balance: string;
  users_count: number;
  is_online: boolean;
  admin_blocked: boolean;
}

export interface PagedMicrotikOutListSchema {
  items: MicrotikOutListSchema[];
  count: number;
}

export interface SubscriptionCategorieOutSchema {
  slug: string | null;
  name: SubscriptionCategoriEnum | null;
  price: string | null;
}

export interface SubscriptionVpnOutSchema {
  vpn_username: string;
  vpn_password: string;
  vpn_ip: string;
  expire_at: string;
  is_paid: boolean;
  validation: boolean;
  category: SubscriptionCategorieOutSchema;
}

export interface ProfilOutSchema {
  name: string;
  rate_limit: MikroTikRateLimit;
  shared_users: number;
  price: string;
  currency: CurrencyEnum;
  slug: string;
}

export interface MicrotikOutRetrieveSchema {
  slug: string;
  name: string;
  wallet_balance: string;
  amount_available_windrawal: string;
  users_count: number;
  commission_rate: number;
  is_online: boolean;
  admin_blocked: boolean;
  subscription: SubscriptionVpnOutSchema | null;
  profils: ProfilOutSchema[] | null;
}

export interface MicrotikInSchema {
  name: string;
}

export interface MicrotikUpdateSchema {
  name?: string | null;
  is_online?: boolean | null;
}

export interface MicrotikCheckSchema {
  vpn_ip: string;
  vpn_username: string;
  vpn_password: string;
}

export interface MicrotikCheckResponseSchema {
  status: string;
  message: string;
}

export interface ProfilInSchema {
  name: string;
  rate_limit: MikroTikRateLimit;
  shared_users: number;
  price: number | string;
  currency: CurrencyEnum;
  status?: StatusEnum | null;
  type_session: ProfilDurationEnum;
  duration: number;
}

export interface ProfilUpdateSchema {
  name?: string | null;
  rate_limit?: MikroTikRateLimit | null;
  shared_users?: number | null;
  price?: string | null;
  currency?: string | null;
  status?: StatusEnum | null;
  type_session?: ProfilDurationEnum | null;
  duration?: number | null;
}

export interface SubscriptionCategorieInSchema {
  name: SubscriptionCategoriEnum;
  price: number | string;
}

export interface SubscriptionCategorieUpdateSchema {
  name?: SubscriptionCategoriEnum | null;
  price?: number | string | null;
}

export interface SubscriptionVpnInSchema {
  category_slug: string;
}

export interface SubscriptionResponse {
  status: string;
  message: string;
}
