export interface MicrotikInfo {
  slug: string;
  name: string;
}

export interface UserOutSchema {
  slug: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  user_type: string;
  address: string | null;
  is_active: boolean;
}

export interface UserRetrieveSchema {
  slug: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  user_type: string;
  address: string;
  is_active: boolean;
  microtiks: MicrotikInfo[];
}

export interface PagedUserOutSchema {
  items: UserOutSchema[];
  count: number;
}

export interface UserInSchema {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password: string;
  user_type?: string;
  address?: string | null;
}

export interface UserUpdate {
  first_name?: string | null;
  last_name?: string | null;
  address?: string | null;
  user_type?: string | null;
}

export interface UserPasswordUpdateMe {
  password: string;
  new_password: string;
}

export interface UserPasswordUpdate {
  email: string;
  new_password: string;
}
