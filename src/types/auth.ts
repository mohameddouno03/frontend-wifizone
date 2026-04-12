export interface SignInRequest {
  username: string;
  password: string;
}

export interface WebSignInResponse {
  access: string;
}

export interface MobileSignInResponse {
  refresh: string;
  access: string;
}

export interface MobileTokenRefreshRequest {
  refresh: string;
}

export interface MobileTokenRefreshResponse {
  access: string;
}
