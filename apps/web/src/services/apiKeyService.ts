import { apiCall } from "./baseService";

export interface ApiKey {
  id: string;
  organization_id: string;
  name: string;
  key: string;
  created_at: string;
  last_used_at: string | null;
}

export interface GenerateApiKeyRequest {
  name: string;
}

export const apiKeyService = {
  async generateApiKey(data: GenerateApiKeyRequest): Promise<ApiKey> {
    return apiCall<ApiKey>("post", "/api-keys", data);
  },

  async getApiKeys(): Promise<ApiKey[]> {
    return apiCall<ApiKey[]>("get", "/api-keys");
  },

  async deleteApiKey(id: string): Promise<void> {
    return apiCall<void>("delete", `/api-keys/${id}`);
  },
};
