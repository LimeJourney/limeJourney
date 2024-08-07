import { apiInstance, ENDPOINTS } from "./baseService";

const TOKEN_KEY = "auth_token";

export interface AuthResponse {
  status: string;
  data: {
    user: {
      role: string;
      organizationId: string;
      name: string;
      email: string;
      id: string;
    };
    token: string;
  };
  message: string;
}

export const authService = {
  async authenticate(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await apiInstance.post<AuthResponse>(
        ENDPOINTS.AUTH.LOGIN,
        {
          email,
          password,
        }
      );
      this.setToken(response.data.data.token);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async authenticateWithGoogle(): Promise<void> {
    window.location.href = `${apiInstance.defaults.baseURL}${ENDPOINTS.AUTH.GOOGLE}`;
  },

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    document.cookie = `${TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict; Secure`;
  },

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
    document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=86400; SameSite=Strict; Secure`;
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
