import { apiCall } from "./baseService";

export interface EventData {
  id: string;
  org_id: string;
  entity_id: string;
  entity_external_id: string;
  name: string;
  properties: Record<string, any>;
  timestamp: string;
}

export interface RecordEventRequest {
  entity_external_id: string;
  name: string;
  properties: Record<string, any>;
}

export const eventsService = {
  async recordEvent(data: RecordEventRequest): Promise<EventData> {
    return apiCall<EventData>("post", "/events", data);
  },

  async getEvents(
    entityExternalId?: string,
    limit?: number,
    offset?: number
  ): Promise<EventData[]> {
    const params = { entityExternalId, limit, offset };
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

  async getUniqueEventNames(): Promise<string[]> {
    return apiCall<string[]>("get", "/events/names");
  },
};
