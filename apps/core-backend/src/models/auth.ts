export interface SignupRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthData {
  token: string;
  user: {
    id: string;
    email: string;
    name: string | null;
    organizationId: string;
    role: string;
  };
}
