// import { apiCall } from "./baseService";

// export interface CreateJourneyDTO {
//   name: string;
//   definition: JourneyDefinition;
//   runMultipleTimes: boolean;
// }

// export interface UpdateJourneyDTO {
//   name?: string;
//   status?: "DRAFT" | "ACTIVE" | "PAUSED" | "ARCHIVED";
// }

// export interface JourneyDefinition {
//   nodes: JourneyNode[];
//   edges: JourneyEdge[];
// }

// export interface JourneyNode {
//   id: string;
//   type: string;
//   data: any;
// }

// export interface JourneyEdge {
//   id: string;
//   source: string;
//   target: string;
// }

// export interface JourneyMetrics {
//   totalUsers: number;
//   completedUsers: number;
//   completionRate: number;
//   averageCompletionTime: number;
//   stepMetrics: {
//     [nodeId: string]: StepMetric;
//   };
// }

// export interface StepMetric {
//   total: number;
//   completed: number;
// }

// export interface JourneyActivity {
//   id: string;
//   userId: string;
//   nodeId: string;
//   nodeName: string;
//   type: string;
//   status: string;
//   timestamp: Date;
//   data?: any;
// }

// export const journeyManagementService = {
//   async createJourney(data: CreateJourneyDTO): Promise<any> {
//     return apiCall<any>("post", "/journeys", data);
//   },

//   async updateJourney(journeyId: string, data: UpdateJourneyDTO): Promise<any> {
//     return apiCall<any>("put", `/journeys/${journeyId}`, data);
//   },

//   async listJourneys(status?: string): Promise<any[]> {
//     return apiCall<any[]>("get", "/journeys", status ? { status } : undefined);
//   },

//   async getJourneyMetrics(journeyId: string): Promise<JourneyMetrics> {
//     return apiCall<JourneyMetrics>("get", `/journeys/${journeyId}/metrics`);
//   },

//   async getRecentJourneyActivity(
//     journeyId: string,
//     limit?: number
//   ): Promise<JourneyActivity[]> {
//     return apiCall<JourneyActivity[]>(
//       "get",
//       `/journeys/${journeyId}/activity/recent`,
//       { limit }
//     );
//   },

//   async getJourneyActivityFeed(
//     journeyId: string,
//     page?: number,
//     pageSize?: number
//   ): Promise<{ activities: JourneyActivity[]; totalCount: number }> {
//     return apiCall<{ activities: JourneyActivity[]; totalCount: number }>(
//       "get",
//       `/journeys/${journeyId}/activity/feed`,
//       { page, pageSize }
//     );
//   },

//   async getJourneyActivitySummary(
//     journeyId: string,
//     timeframe?: "day" | "week" | "month"
//   ): Promise<{ [key: string]: number }> {
//     return apiCall<{ [key: string]: number }>(
//       "get",
//       `/journeys/${journeyId}/activity/summary`,
//       { timeframe }
//     );
//   },
// };

import { apiCall } from "./baseService";

// DTOs
export interface CreateJourneyDTO {
  name: string;
  definition: JourneyDefinition;
  runMultipleTimes: boolean;
}

export interface UpdateJourneyDTO {
  name?: string;
  status?: JourneyStatus;
}

// Enums
export enum JourneyStatus {
  DRAFT = "DRAFT",
  ACTIVE = "ACTIVE",
  PAUSED = "PAUSED",
  ARCHIVED = "ARCHIVED",
}

// Journey related interfaces
export interface JourneyDefinition {
  nodes: JourneyNode[];
  edges: JourneyEdge[];
}

export interface JourneyNode {
  id: string;
  type: string;
  data: Record<string, unknown>;
}

export interface JourneyEdge {
  id: string;
  source: string;
  target: string;
}

export interface Journey {
  id: string;
  name: string;
  organizationId: string;
  definition: JourneyDefinition;
  status: JourneyStatus;
  runMultipleTimes: boolean;
  createdAt: string;
  updatedAt: string;
}

// Metrics and activity interfaces
export interface JourneyMetrics {
  totalUsers: number;
  completedUsers: number;
  completionRate: number;
  averageCompletionTime: number;
  stepMetrics: Record<string, StepMetric>;
}

export interface StepMetric {
  total: number;
  completed: number;
}

export interface JourneyActivity {
  id: string;
  userId: string;
  nodeId: string;
  nodeName: string;
  type: string;
  status: string;
  timestamp: Date;
  data?: Record<string, unknown>;
}

export interface JourneyWithMetrics extends Journey {
  metrics: {
    totalUsers: number;
    completionRate: number;
  };
}

export interface TriggerInfo {
  type: "event" | "segment" | null;
  name: string | null;
}

// Service interface
// export interface JourneyManagementService {
//   createJourney(data: CreateJourneyDTO): Promise<Journey>;
//   updateJourney(journeyId: string, data: UpdateJourneyDTO): Promise<Journey>;
//   listJourneys(status?: JourneyStatus): Promise<Journey[]>;
//   getJourneyMetrics(journeyId: string): Promise<JourneyMetrics>;
//   getRecentJourneyActivity(journeyId: string, limit?: number): Promise<JourneyActivity[]>;
//   getJourneyActivityFeed(
//     journeyId: string,
//     page?: number,
//     pageSize?: number
//   ): Promise<{ activities: JourneyActivity[]; totalCount: number }>;
//   getJourneyActivitySummary(
//     journeyId: string,
//     timeframe?: "day" | "week" | "month"
//   ): Promise<Record<string, number>>;
// }

// Implementation
export const journeyManagementService = {
  async createJourney(data: CreateJourneyDTO): Promise<Journey> {
    return apiCall<Journey>("post", "/journeys", data);
  },

  async updateJourney(
    journeyId: string,
    data: UpdateJourneyDTO
  ): Promise<Journey> {
    return apiCall<Journey>("put", `/journeys/${journeyId}`, data);
  },

  async listJourneys(status?: JourneyStatus): Promise<JourneyWithMetrics[]> {
    return apiCall<JourneyWithMetrics[]>(
      "get",
      "/journeys",
      status ? { status } : undefined
    );
  },

  async getJourneyMetrics(journeyId: string): Promise<JourneyMetrics> {
    return apiCall<JourneyMetrics>("get", `/journeys/${journeyId}/metrics`);
  },

  async getRecentJourneyActivity(
    journeyId: string,
    limit?: number
  ): Promise<JourneyActivity[]> {
    return apiCall<JourneyActivity[]>(
      "get",
      `/journeys/${journeyId}/activity/recent`,
      { limit }
    );
  },

  async getJourneyActivityFeed(
    journeyId: string,
    page?: number,
    pageSize?: number
  ): Promise<{ activities: JourneyActivity[]; totalCount: number }> {
    return apiCall<{ activities: JourneyActivity[]; totalCount: number }>(
      "get",
      `/journeys/${journeyId}/activity/feed`,
      { page, pageSize }
    );
  },

  async getJourneyActivitySummary(
    journeyId: string,
    timeframe?: "day" | "week" | "month"
  ): Promise<Record<string, number>> {
    return apiCall<Record<string, number>>(
      "get",
      `/journeys/${journeyId}/activity/summary`,
      { timeframe }
    );
  },
};
