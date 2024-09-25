import { apiCall } from "./baseService";

export interface InsightQuery {
  query: string;
}

export interface InsightResponse {
  insight: string;
  confidence: number;
}

export interface RecentQuery {
  query: string;
  response: string;
  createdAt: string;
}

export interface OrganizationInsights {
  recentQueries: RecentQuery[];
  uniqueEvents: { [eventName: string]: number };
  totalEntities: number;
  totalEvents: number;
  averageEventsPerEntity: number;
  activeEntitiesLast30Days: number;
}

export const aiInsightsService = {
  async getInsights(data: InsightQuery): Promise<InsightResponse> {
    return apiCall<InsightResponse>("post", "/insights/query", data);
  },

  async getRecentQueries(): Promise<RecentQuery[]> {
    return apiCall<RecentQuery[]>("get", "/insights/queries");
  },

  async getOrganizationInsights(): Promise<OrganizationInsights> {
    return apiCall<OrganizationInsights>("get", "/insights");
  },
};
