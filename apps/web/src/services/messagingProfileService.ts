import { apiCall } from "./baseService";

// Define types based on your Prisma schema
export interface MessagingIntegration {
  id: string;
  name: string;
  type: string;
  providerName: string;
  requiredFields: Record<string, any>;
  confidentialFields: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface MessagingProfile {
  id: string;
  name: string;
  organizationId: string;
  integrationId: string;
  integration: MessagingIntegration;
  requiredFields: Record<string, any>;
  credentials: Record<string, any>;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface MessageLog {
  id: string;
  messagingProfileId: string;
  event: string;
  status: string;
  metadata: Record<string, any> | null;
  createdAt: string;
}

export interface CreateMessagingProfileInput {
  name: string;
  integrationId: string;
  requiredFields: Record<string, string>;
  credentials: Record<string, string>;
  status: string;
}

export interface UpdateMessagingProfileInput {
  name?: string;
  integrationId?: string;
  requiredFields?: Record<string, string>;
  credentials?: Record<string, string>;
  status?: string;
}

export const messagingProfileService = {
  async getIntegrations(): Promise<MessagingIntegration[]> {
    return apiCall<MessagingIntegration[]>(
      "get",
      "/messaging-profiles/integrations"
    );
  },

  async getProfiles(): Promise<MessagingProfile[]> {
    return apiCall<MessagingProfile[]>("get", "/messaging-profiles");
  },

  async getProfileById(id: string): Promise<MessagingProfile> {
    return apiCall<MessagingProfile>("get", `/messaging-profiles/${id}`);
  },

  async createProfile(
    data: CreateMessagingProfileInput
  ): Promise<MessagingProfile> {
    return apiCall<MessagingProfile>("post", "/messaging-profiles", data);
  },

  async updateProfile(
    id: string,
    data: UpdateMessagingProfileInput
  ): Promise<MessagingProfile> {
    return apiCall<MessagingProfile>("put", `/messaging-profiles/${id}`, data);
  },

  async deleteProfile(id: string): Promise<void> {
    return apiCall<void>("delete", `/messaging-profiles/${id}`);
  },

  async getProfileLogs(
    id: string,
    limit: number = 100,
    offset: number = 0
  ): Promise<MessageLog[]> {
    const params = { limit, offset };
    return apiCall<MessageLog[]>(
      "get",
      `/messaging-profiles/${id}/logs`,
      params
    );
  },

  async getProfileAnalytics(
    id: string,
    startDate: string,
    endDate: string
  ): Promise<any> {
    const params = { startDate, endDate };
    return apiCall<any>("get", `/messaging-profiles/${id}/analytics`, params);
  },
};
