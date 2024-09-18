import { apiCall } from "./baseService";

export enum ChannelType {
  EMAIL = "EMAIL",
  SMS = "SMS",
  PUSH = "PUSH",
}

export enum TemplateStatus {
  DRAFT = "DRAFT",
  ACTIVE = "ACTIVE",
  ARCHIVED = "ARCHIVED",
}

export interface Template {
  id: string;
  name: string;
  channel: ChannelType;
  subjectLine?: string;
  previewText?: string;
  content: string;
  tags: string[];
  status: TemplateStatus;
  organizationId: string;
  messagingProfileId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTemplateInput {
  name: string;
  channel: ChannelType;
  subjectLine?: string;
  previewText?: string;
  content: string;
  tags: string[];
  status: TemplateStatus;
  messagingProfileId?: string;
}

export interface UpdateTemplateInput {
  name?: string;
  channel?: ChannelType;
  subjectLine?: string;
  previewText?: string;
  content?: string;
  tags?: string[];
  status?: TemplateStatus;
  messagingProfileId?: string;
}

export interface GetTemplatesParams {
  channel?: ChannelType;
  status?: TemplateStatus;
  messagingProfileId?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export const templateService = {
  async createTemplate(data: CreateTemplateInput): Promise<Template> {
    return apiCall<Template>("post", "/templates", data);
  },

  async getTemplate(id: string): Promise<Template> {
    return apiCall<Template>("get", `/templates/${id}`);
  },

  async updateTemplate(
    id: string,
    data: UpdateTemplateInput
  ): Promise<Template> {
    return apiCall<Template>("put", `/templates/${id}`, data);
  },

  async deleteTemplate(id: string): Promise<void> {
    return apiCall<void>("delete", `/templates/${id}`);
  },

  async getTemplates(params: GetTemplatesParams): Promise<Template[]> {
    return apiCall<Template[]>("get", "/templates", params);
  },

  async duplicateTemplate(id: string): Promise<Template> {
    return apiCall<Template>("post", `/templates/${id}/duplicate`);
  },
};
