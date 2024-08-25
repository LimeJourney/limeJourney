import { apiCall } from "./baseService";

export interface EventData {
  id: string;
  org_id: string;
  entity_id: string;
  name: string;
  properties: Record<string, any>;
  timestamp: string;
}

export interface RecordEventRequest {
  entityId: string;
  name: string;
  properties: Record<string, any>;
}

export const eventsService = {
  async recordEvent(data: RecordEventRequest): Promise<EventData> {
    return apiCall<EventData>("post", "/events", data);
  },

  async getEvents(
    entityId?: string,
    limit?: number,
    offset?: number
  ): Promise<EventData[]> {
    const params = { entityId, limit, offset };
    return apiCall<EventData[]>("get", "/events", params);
  },

  async searchEvents(
    searchQuery: string,
    limit?: number,
    offset?: number
  ): Promise<EventData[]> {
    const params = { searchQuery, limit, offset };
    return apiCall<EventData[]>("get", "/events/search", params);
  },
};
