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
