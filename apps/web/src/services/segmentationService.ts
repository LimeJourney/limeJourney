import { apiCall } from "./baseService";

export enum SegmentCriterionType {
  PROPERTY = "property",
  EVENT = "event",
}

export enum TimeUnit {
  SECONDS = "seconds",
  MINUTES = "minutes",
  HOURS = "hours",
  DAYS = "days",
  WEEKS = "weeks",
  MONTHS = "months",
}

export enum SegmentOperator {
  EQUALS = "equals",
  NOT_EQUALS = "not_equals",
  GREATER_THAN = "greater_than",
  LESS_THAN = "less_than",
  CONTAINS = "contains",
  NOT_CONTAINS = "not_contains",
  IN = "in",
  NOT_IN = "not_in",
  BETWEEN = "between",
  NOT_BETWEEN = "not_between",
  HAS_DONE = "has_done",
  HAS_NOT_DONE = "has_not_done",
  HAS_DONE_TIMES = "has_done_times",
  HAS_DONE_FIRST_TIME = "has_done_first_time",
  HAS_DONE_LAST_TIME = "has_done_last_time",
  HAS_DONE_WITHIN = "has_done_within",
  HAS_NOT_DONE_WITHIN = "has_not_done_within",
}

export enum LogicalOperator {
  AND = "and",
  OR = "or",
}

export interface SegmentCriterion {
  type: SegmentCriterionType;
  field: string;
  operator: SegmentOperator;
  value: string | number | boolean;
  timeUnit?: TimeUnit;
}

export interface SegmentCondition {
  criteria: SegmentCriterion[];
  logicalOperator: LogicalOperator;
}

export interface Segment {
  id: string;
  name: string;
  description: string;
  organizationId: string;
  conditions: SegmentCondition[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSegmentDTO {
  name: string;
  description: string;
  conditions: SegmentCondition[];
}

export interface UpdateSegmentDTO {
  name?: string;
  description?: string;
  conditions?: SegmentCondition[];
}

export interface SegmentAnalytics {
  segmentId: string;
  size: number;
  growthRate: number;
  commonCharacteristics: { [key: string]: any }[];
  conversionRate?: number;
}

export const segmentationService = {
  async createSegment(data: CreateSegmentDTO): Promise<Segment> {
    return apiCall<Segment>("post", "/segments", data);
  },

  async getSegment(segmentId: string): Promise<Segment> {
    return apiCall<Segment>("get", `/segments/${segmentId}`);
  },

  async updateSegment(
    segmentId: string,
    data: UpdateSegmentDTO
  ): Promise<Segment> {
    return apiCall<Segment>("put", `/segments/${segmentId}`, data);
  },

  async deleteSegment(segmentId: string): Promise<boolean> {
    return apiCall<boolean>("delete", `/segments/${segmentId}`);
  },

  async listSegments(): Promise<Segment[]> {
    return apiCall<Segment[]>("get", "/segments");
  },

  async getEntitiesInSegment(segmentId: string): Promise<string[]> {
    return apiCall<string[]>("get", `/segments/${segmentId}/entities`);
  },

  async getSegmentAnalytics(segmentId: string): Promise<SegmentAnalytics> {
    return apiCall<SegmentAnalytics>("get", `/segments/${segmentId}/analytics`);
  },

  async getSegmentsForEntity(entityId: string): Promise<Segment[]> {
    return apiCall<Segment[]>("get", `/segments/entity/${entityId}`);
  },
};

export default segmentationService;
