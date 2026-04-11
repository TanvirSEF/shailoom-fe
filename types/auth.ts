export interface User {
  id: string;
  username: string;
  email: string;
  phone_number?: string;
  address?: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface UserUpdate {
  username?: string;
  phone_number?: string;
  address?: string;
}

export interface AuthResponse {
  message: string;
  access_token: string;
  refresh_token: string;
  token_type: string;
  role: string;
  user?: User;
}
