import { apiCall } from "./baseService";

// Types for Messaging Integration
export interface MessagingIntegration {
  id: string;
  name: string;
  type: string;
  providerName: string;
  requiredFields: string[];
  confidentialFields: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateMessagingIntegrationRequest {
  name: string;
  type: string;
  providerName: string;
  requiredFields: string[];
  confidentialFields: string[];
}

export interface UpdateMessagingIntegrationRequest {
  name?: string;
  type?: string;
  providerName?: string;
  requiredFields?: string[];
  confidentialFields?: string[];
}

// Types for Messaging Profile
export interface MessagingProfile {
  id: string;
  name: string;
  organizationId: string;
  integrationId: string;
  credentials: Record<string, string>;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMessagingProfileRequest {
  name: string;
  integrationId: string;
  credentials: Record<string, string>;
  status: string;
}

export interface UpdateMessagingProfileRequest {
  name?: string;
  credentials?: Record<string, string>;
  status?: string;
}

// Messaging Service
export const messagingService = {
  // Messaging Integration methods
  async getIntegrations(): Promise<MessagingIntegration[]> {
    return apiCall<MessagingIntegration[]>(
      "get",
      "/messaging-profiles/integrations"
    );
  },

  async getProfiles(
    limit?: number,
    offset?: number
  ): Promise<MessagingProfile[]> {
    const params = { limit, offset };
    return apiCall<MessagingProfile[]>("get", "/messaging-profiles", params);
  },

  async createProfile(
    data: CreateMessagingProfileRequest
  ): Promise<MessagingProfile> {
    return apiCall<MessagingProfile>("post", "/messaging-profiles", data);
  },

  async getProfileById(id: string): Promise<MessagingProfile> {
    return apiCall<MessagingProfile>("get", `/messaging-profiles/${id}`);
  },

  async updateProfile(
    id: string,
    data: UpdateMessagingProfileRequest
  ): Promise<MessagingProfile> {
    return apiCall<MessagingProfile>("put", `/messaging-profiles/${id}`, data);
  },

  async deleteProfile(id: string): Promise<void> {
    return apiCall<void>("delete", `/messaging-profiles/${id}`);
  },

  // Additional method for getting available integrations (if needed)
  async getAvailableIntegrations(): Promise<MessagingIntegration[]> {
    return apiCall<MessagingIntegration[]>(
      "get",
      "/messaging-profiles/available-integrations"
    );
  },
};
