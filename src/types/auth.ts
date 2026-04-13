export interface SignInRequest {
  username: string;
  password: string;
}

export interface WebSignInResponse {
  access: string;
  refresh?: string;
}