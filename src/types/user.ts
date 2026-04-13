// types/user.ts
export interface UserOutSchema {
  slug: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  user_type: "admin" | "owner" | "client" | "ownermicrotik";
  address: string | null;
  is_active: boolean;
}

export interface UserUpdate {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  address?: string;
  user_type?: string;
  is_active?: boolean;
}

export interface UserCreate {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password: string;
  user_type: string;
  address?: string;
}

export interface UserPasswordUpdateMe {
  password: string;
  new_password: string;
}

export interface UserPasswordReset {
  email: string;
  new_password: string;
}

export interface UserListResponse {
  items: UserOutSchema[];
  count: number;
}

export interface UserDetailResponse extends UserOutSchema {
  microtiks: Array<{
    slug: string;
    name: string;
  }>;
}

export interface UserPasswordUpdate {
  password: string;
  new_password: string;
}