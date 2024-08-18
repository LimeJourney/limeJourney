import { apiCall } from "./baseService";

export interface EntityStats {
  totalEntities: number;
  oldestEntity: string;
  newestEntity: string;
  uniqueExternalIds: number;
}

export interface EntityData {
  id: string;
  org_id: string;
  external_id?: string;
  properties: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface EntityWithSegments extends EntityData {
  segments: {
    id: string;
    name: string;
    description: string;
    createdAt: string;
  }[];
}

export interface EventData {
  id: string;
  org_id: string;
  entity_id: string;
  name: string;
  properties: Record<string, any>;
  timestamp: string;
}

export interface CreateOrUpdateEntityRequest {
  external_id?: string;
  properties: Record<string, any>;
}

export interface RecordEventRequest {
  entityId: string;
  name: string;
  properties: Record<string, any>;
}

export const entityService = {
  async createOrUpdateEntity(
    data: CreateOrUpdateEntityRequest
  ): Promise<EntityData> {
    return apiCall<EntityData>("post", "/entities", data);
  },

  async getEntity(entityId: string): Promise<EntityWithSegments> {
    return apiCall<EntityWithSegments>("get", `/entities/${entityId}`);
  },

  async listEntities(): Promise<EntityWithSegments[]> {
    return apiCall<EntityWithSegments[]>("get", "/entities");
  },

  async getEntityProperties(): Promise<string[]> {
    return apiCall<string[]>("get", "/entities/list/entity_properties");
  },

  async recordEvent(
    data: RecordEventRequest
  ): Promise<EventData & { entity_id: string; timestamp: string }> {
    return apiCall<EventData & { entity_id: string; timestamp: string }>(
      "post",
      "/entities/event",
      data
    );
  },

  async getEntityEvents(entityId: string): Promise<EventData[]> {
    return apiCall<EventData[]>("get", `/entities/${entityId}/events`);
  },

  async searchEntities(searchQuery: string): Promise<EntityData[]> {
    return apiCall<EntityData[]>("get", "/entities/search", { searchQuery });
  },

  async getEntityStats(): Promise<EntityStats> {
    return apiCall<EntityStats>("get", "/entities/stats");
  },
};
