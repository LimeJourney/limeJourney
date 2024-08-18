import { apiCall } from "./baseService";

export enum SegmentCriterionType {
  PROPERTY = "property",
  EVENT = "event",
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
