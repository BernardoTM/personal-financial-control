export interface AuthLoginData {
  email: string;
  password: string;
}

export interface AuthLoginResponse {
  status: number;
  data: {
    access_token: string;
    refresh_token: string;
    token_type: string;
  };
}
