import {
  Segment,
  CreateSegmentDTO,
  UpdateSegmentDTO,
  SegmentCriterionType,
  SegmentOperator,
  SegmentCondition,
  LogicalOperator,
  SegmentAnalytics,
} from "../models/segmentation";
import { Prisma, PrismaClient } from "@prisma/client";
import { DatabaseError, ValidationError, NotFoundError } from "@lime/errors";
import { clickhouseManager } from "../lib/clickhouse";
import { ClickHouseClient } from "@clickhouse/client";
import { logger } from "@lime/telemetry/logger";
import {
  EntityCreatedEvent,
  EntityUpdatedEvent,
  EventOccurredEvent,
  EventType,
} from "../lib/queue";
import Anthropic from "@anthropic-ai/sdk";
import { EntityService } from "./entitiesService";
import { AppConfig } from "@lime/config";
import { EventService } from "./eventsService";
const prisma = new PrismaClient();

interface SegmentSizeResult {
  count: string;
}

interface SegmentMembership {
  entity_id: string;
  segment_id: string;
}

export class SegmentationService {
  private clickhouse: ClickHouseClient;

  constructor() {
    this.clickhouse = clickhouseManager.getClient();
  }

  async createSegment(
    organizationId: string,
    data: CreateSegmentDTO
  ): Promise<Segment> {
    try {
      const segment = await prisma.segment.create({
        data: {
          ...data,
          organizationId,
          conditions: JSON.stringify(data.conditions),
        },
      });

      const typedSegment: Segment = {
        ...segment,
        conditions: JSON.parse(
          segment.conditions as string
        ) as SegmentCondition[],
      };

      logger.info("lifecycle", `Created segment ${segment.id}`, {
        organizationId,
      });

      this.refreshSegmentMembership(organizationId, segment.id, typedSegment);
      return typedSegment;
    } catch (error) {
      logger.error("lifecycle", "Failed to create segment", error as Error, {
        organizationId,
      });
      throw new DatabaseError("Failed to create segment");
    }
  }

  async getSegment(
    segmentId: string,
    organizationId: string
  ): Promise<Segment | null> {
    try {
      const segment = await prisma.segment.findFirst({
        where: {
          id: segmentId,
          organizationId,
        },
      });
      if (!segment) {
        logger.warn("lifecycle", `Segment ${segmentId} not found`, {
          organizationId,
        });

        return null;
      }
      const typedSegment: Segment = {
        ...segment,
        conditions: JSON.parse(
          segment.conditions as string
        ) as SegmentCondition[],
      };
      return typedSegment;
    } catch (error) {
      logger.error(
        "lifecycle",
        `Failed to get segment ${segmentId}`,
        error as Error,
        { organizationId }
      );
      throw new DatabaseError("Failed to get segment");
    }
  }

  async getSegmentsForMultipleEntities(
    entityIds: string[],
    organizationId: string
  ): Promise<{ [entityId: string]: Segment[] }> {
    // Fetch all segments for the organization
    const allSegments = await this.listSegments(organizationId);

    if (allSegments.length === 0) {
      return {};
    }

    // Format entityIds for ClickHouse
    const formattedEntityIds = entityIds.map((id) => `'${id}'`).join(",");
    // Fetch all segment memberships for the given entity IDs in a single query
    const query = `
      SELECT entity_id, segment_id
      FROM segment_memberships
      WHERE entity_id IN (${formattedEntityIds})
      AND org_id = {organizationId:String}
    `;

    try {
      const result = await this.clickhouse.query({
        query,
        query_params: { organizationId },
        format: "JSONEachRow",
      });

      const data = (await result.json()) as SegmentMembership[];
      // Group segments by entity ID
      const entitySegments: { [entityId: string]: Segment[] } = {};
      for (const { entity_id, segment_id } of data) {
        if (!entitySegments[entity_id]) {
          entitySegments[entity_id] = [];
        }

        const segment = allSegments.find((s) => s.id === segment_id);
        if (segment) {
          entitySegments[entity_id].push(segment);
        }
      }

      logger.info("lifecycle", `Retrieved segments for multiple entities`, {
        organizationId,
        entityCount: entityIds.length,
        segmentCount: allSegments.length,
      });

      return entitySegments;
    } catch (error) {
      logger.error(
        "lifecycle",
        `Error fetching segments for multiple entities`,
        error instanceof Error ? error : new Error(String(error))
      );
      throw new DatabaseError("Failed to fetch segments for entities");
    }
  }

  async updateSegment(
    segmentId: string,
    organizationId: string,
    data: UpdateSegmentDTO
  ): Promise<Segment | null> {
    try {
      const segment = await prisma.segment.update({
        where: {
          id: segmentId,
          organizationId,
        },
        data: {
          ...data,
          conditions: JSON.stringify(data.conditions),
        },
      });

      const typedSegment: Segment = {
        ...segment,
        conditions: JSON.parse(
          segment.conditions as string
        ) as SegmentCondition[],
      };

      await this.refreshSegmentMembership(
        organizationId,
        segmentId,
        typedSegment
      );

      logger.info("lifecycle", `Updated segment ${segmentId}`, {
        organizationId,
      });
      return typedSegment;
    } catch (error) {
      logger.error(
        "lifecycle",
        `Failed to update segment ${segmentId}`,
        error as Error,
        { organizationId }
      );
      throw new DatabaseError("Failed to update segment");
    }
  }

  async deleteSegment(
    segmentId: string,
    organizationId: string
  ): Promise<boolean> {
    try {
      // Delete from PostgreSQL
      const result = await prisma.segment.delete({
        where: {
          id: segmentId,
        },
      });

      // Delete from ClickHouse segment_memberships table
      const deleteQuery = `
        ALTER TABLE segment_memberships
        DELETE WHERE segment_id = {segmentId:String}
      `;

      await this.clickhouse.query({
        query: deleteQuery,
        query_params: { segmentId },
      });

      logger.info("lifecycle", `Deleted segment ${segmentId}`, {
        organizationId,
      });
      return true;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        logger.warn(
          "lifecycle",
          `Segment ${segmentId} not found for deletion`,
          {
            organizationId,
          }
        );
        return false;
      }
      logger.error(
        "lifecycle",
        `Failed to delete segment ${segmentId}`,
        error as Error,
        { organizationId }
      );
      throw new DatabaseError("Failed to delete segment");
    }
  }

  async listSegments(organizationId: string): Promise<Segment[]> {
    try {
      const segments = await prisma.segment.findMany({
        where: {
          organizationId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      logger.info(
        "lifecycle",
        `Listed segments for organization ${organizationId}`
      );

      const typedSegments: Segment[] = segments.map((segment) => ({
        ...segment,
        conditions: JSON.parse(
          segment.conditions as string
        ) as SegmentCondition[],
      }));

      return typedSegments;
    } catch (error) {
      logger.error("lifecycle", "Failed to list segments", error as Error, {
        organizationId,
      });
      throw new DatabaseError("Failed to list segments");
    }
  }

  async getEntitiesInSegment(
    segmentId: string,
    organizationId: string
  ): Promise<string[]> {
    const segment = await this.getSegment(segmentId, organizationId);
    if (!segment) throw new NotFoundError("Segment not found");

    const query = `
      SELECT DISTINCT entity_id
      FROM segment_memberships
      WHERE segment_id = {segmentId:String} AND org_id = {organizationId:String}
    `;

    try {
      const result = await this.clickhouse.query({
        query,
        query_params: { segmentId, organizationId },
        format: "JSONEachRow",
      });

      const data = await result.json();
      logger.info("lifecycle", `Retrieved entities for segment ${segmentId}`, {
        organizationId,
      });
      return data.map((row: any) => row.entity_id);
    } catch (error) {
      logger.error(
        "lifecycle",
        `Failed to get entities in segment ${segmentId}`,
        error instanceof Error ? error : new Error(String(error)),
        { organizationId }
      );
      throw new DatabaseError("Failed to get entities in segment");
    }
  }

  private getSecondsMultiplier(timeUnit: string): number {
    switch (timeUnit) {
      case "minutes":
        return 60;
      case "hours":
        return 3600;
      case "days":
      default:
        return 86400;
    }
  }

  async getSegmentAnalytics(
    segmentId: string,
    organizationId: string
  ): Promise<SegmentAnalytics> {
    const segment = await this.getSegment(segmentId, organizationId);
    if (!segment) throw new NotFoundError("Segment not found");

    try {
      const currentSize = await this.getSegmentSize(segment);
      const previousSize = await this.getSegmentSize(segment, 30); // 30 days ago
      const growthRate =
        previousSize > 0 ? (currentSize - previousSize) / previousSize : 0;

      const commonCharacteristics =
        await this.getCommonCharacteristics(segment);
      // const conversionRate = await this.getConversionRate(segment);

      logger.info("lifecycle", `Retrieved analytics for segment ${segmentId}`, {
        organizationId,
      });
      return {
        segmentId: segment.id,
        size: currentSize,
        growthRate,
        commonCharacteristics,
        // conversionRate,
      };
    } catch (error) {
      logger.error(
        "lifecycle",
        `Failed to get analytics for segment ${segmentId}`,
        error as Error,
        { organizationId }
      );
      throw new DatabaseError("Failed to get segment analytics");
    }
  }

  private async getSegmentSize(
    segment: Segment,
    daysAgo: number = 0
  ): Promise<number> {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    const query = `
      SELECT COUNT(*) as count
      FROM segment_membership
      WHERE created_at <= {date:DateTime}
    `;

    try {
      const result = await this.clickhouse.query({
        query,
        query_params: { date: date.toISOString() },
        format: "JSONEachRow",
      });

      const data = await result.json<SegmentSizeResult>();

      if (data.length === 0 || typeof data[0].count !== "string") {
        throw new Error("Unexpected query result format");
      }

      const count = parseInt(data[0].count, 10);
      if (isNaN(count)) {
        throw new Error(`Invalid count value: ${data[0].count}`);
      }

      return count;
    } catch (error) {
      logger.error(
        "lifecycle",
        `Failed to get size for segment ${segment.id}`,
        error instanceof Error ? error : new Error(String(error))
      );
      throw new DatabaseError("Failed to get segment size");
    }
  }

  private async getCommonCharacteristics(
    segment: Segment
  ): Promise<{ [key: string]: any }[]> {
    const query = `
      SELECT 
        JSONExtractString(e.properties, 'key') as key,
        JSONExtractString(e.properties, 'value') as value,
        COUNT(*) as count
      FROM entities e
      JOIN segment_membership_${segment.id} sm ON e.id = sm.entity_id
      WHERE e.org_id = {organizationId:String}
      GROUP BY key, value
      ORDER BY count DESC
      LIMIT 5
    `;

    try {
      const result = await this.clickhouse.query({
        query,
        query_params: { organizationId: segment.organizationId },
        format: "JSONEachRow",
      });

      return result.json();
    } catch (error) {
      logger.error(
        "lifecycle",
        `Failed to get common characteristics for segment ${segment.id}`,
        error as Error
      );
      throw new DatabaseError("Failed to get common characteristics");
    }
  }

  async getSegmentsForEntity(
    entityId: string,
    organizationId: string
  ): Promise<Segment[]> {
    try {
      const query = `
        SELECT segment_id
        FROM segment_memberships
        WHERE entity_id = {entityId:String} AND org_id = {organizationId:String}
      `;

      const result = await this.clickhouse.query({
        query,
        query_params: { entityId, organizationId },
        format: "JSONEachRow",
      });

      const data = await result.json();
      const segmentIds = data.map((row: any) => row.segment_id);

      const segments = await prisma.segment.findMany({
        where: {
          id: { in: segmentIds },
          organizationId,
        },
      });

      const typedSegments: Segment[] = segments.map((segment) => ({
        ...segment,
        conditions: JSON.parse(
          segment.conditions as string
        ) as SegmentCondition[],
      }));

      logger.info("lifecycle", `Retrieved segments for entity ${entityId}`, {
        organizationId,
      });
      return typedSegments;
    } catch (error) {
      logger.error(
        "lifecycle",
        `Failed to get segments for entity ${entityId}`,
        error as Error,
        { organizationId }
      );
      throw new DatabaseError("Failed to get segments for entity");
    }
  }

  private async updateSegmentMembership(
    segmentId: string,
    entityId: string,
    isMember: boolean,
    organizationId: string
  ): Promise<void> {
    const timestamp = new Date()
      .toISOString()
      .replace(/T/, " ")
      .replace(/\..+/, "")
      .slice(0, 19);

    if (isMember) {
      const insertData = {
        segment_id: segmentId,
        entity_id: entityId,
        org_id: organizationId,
        created_at: timestamp,
      };

      await this.clickhouse.insert({
        table: "segment_memberships",
        values: [insertData],
        format: "JSONEachRow",
      });
    } else {
      const deleteQuery = `
        ALTER TABLE segment_memberships
        DELETE WHERE segment_id = {segmentId:String} AND entity_id = {entityId:String} AND org_id = {organizationId:String}
      `;

      await this.clickhouse.query({
        query: deleteQuery,
        query_params: { segmentId, entityId, organizationId },
      });
    }
  }

  private compareValues(
    value: any,
    operator: SegmentOperator,
    compareValue: any
  ): boolean {
    switch (operator) {
      case SegmentOperator.EQUALS:
        return value === compareValue;
      case SegmentOperator.NOT_EQUALS:
        return value !== compareValue;
      case SegmentOperator.GREATER_THAN:
        return value > compareValue;
      case SegmentOperator.LESS_THAN:
        return value < compareValue;
      case SegmentOperator.CONTAINS:
        return value.includes(compareValue);
      case SegmentOperator.NOT_CONTAINS:
        return !value.includes(compareValue);
      case SegmentOperator.IN:
        return compareValue.includes(value);
      case SegmentOperator.NOT_IN:
        return !compareValue.includes(value);
      case SegmentOperator.BETWEEN:
        return value >= compareValue[0] && value <= compareValue[1];
      case SegmentOperator.NOT_BETWEEN:
        return value < compareValue[0] || value > compareValue[1];
      default:
        return false;
    }
  }

  private async evaluateEventCriterion(
    criterion: SegmentCondition["criteria"][0],
    entityId: string,
    eventName?: string,
    eventProperties?: Record<string, any>
  ): Promise<boolean> {
    if (
      criterion.operator === SegmentOperator.HAS_DONE &&
      eventName === criterion.field
    ) {
      return true;
    }

    let query = `
      SELECT COUNT(*) as count
      FROM events
      WHERE entity_id = {entityId:String}
        AND name = {eventName:String}
    `;

    if (criterion.operator === SegmentOperator.HAS_DONE_WITHIN) {
      query += `
        AND timestamp > subtractSeconds(now(), toUInt32({value:Int64} * ${this.getSecondsMultiplier(criterion.timeUnit || "days")}))
      `;
    }

    const result = await this.clickhouse.query({
      query,
      query_params: {
        entityId,
        eventName: criterion.field,
        value: criterion.value,
      },
      format: "JSONEachRow",
    });

    const data = (await result.json()) as { count: string }[];
    if (data.length === 0 || typeof data[0].count !== "string") {
      throw new Error("Unexpected query result format");
    }

    const count = parseInt(data[0].count, 10);

    switch (criterion.operator) {
      case SegmentOperator.HAS_DONE:
      case SegmentOperator.HAS_DONE_WITHIN:
        return count > 0;
      case SegmentOperator.HAS_NOT_DONE:
        return count === 0;
      case SegmentOperator.HAS_DONE_TIMES:
        return count === criterion.value;
      default:
        return false;
    }
  }

  private async evaluatePropertyCriterion(
    criterion: SegmentCondition["criteria"][0],
    entityId: string
  ): Promise<boolean> {
    const query = `
      SELECT JSONExtractString(properties, {field:String}) as value
      FROM entities
      WHERE id = {entityId:UUID}
      LIMIT 1
    `;

    const result = await this.clickhouse.query({
      query,
      query_params: { field: criterion.field, entityId },
      format: "JSONEachRow",
    });

    const data = (await result.json()) as Array<{ value: string }>;
    if (data.length === 0) return false;

    const value = data[0].value;
    return this.compareValues(value, criterion.operator, criterion.value);
  }

  private async evaluateCriterion(
    criterion: SegmentCondition["criteria"][0],
    entityId: string,
    eventName?: string,
    eventProperties?: Record<string, any>
  ): Promise<boolean> {
    if (criterion.type === SegmentCriterionType.PROPERTY) {
      return this.evaluatePropertyCriterion(criterion, entityId);
    } else if (criterion.type === SegmentCriterionType.EVENT) {
      return this.evaluateEventCriterion(
        criterion,
        entityId,
        eventName,
        eventProperties
      );
    }
    return false;
  }

  private async evaluateSegmentConditions(
    segment: Segment,
    entityId: string,
    eventName?: string,
    eventProperties?: Record<string, any>
  ): Promise<boolean> {
    for (const condition of segment.conditions) {
      const criteriaResults = await Promise.all(
        condition.criteria.map((criterion) =>
          this.evaluateCriterion(
            criterion,
            entityId,
            eventName,
            eventProperties
          )
        )
      );

      const conditionResult =
        condition.logicalOperator === LogicalOperator.AND
          ? criteriaResults.every((result) => result)
          : criteriaResults.some((result) => result);

      if (!conditionResult) {
        return false;
      }
    }

    return true;
  }

  async evaluateSegmentMembership(
    organizationId: string,
    entityId: string,
    eventName?: string,
    eventProperties?: Record<string, any>
  ): Promise<string[]> {
    const segments = await this.listSegments(organizationId);
    const matchedSegments: string[] = [];

    for (const segment of segments) {
      if (
        await this.evaluateSegmentConditions(
          segment,
          entityId,
          eventName,
          eventProperties
        )
      ) {
        matchedSegments.push(segment.id);
        await this.updateSegmentMembership(
          segment.id,
          entityId,
          true,
          organizationId
        );
      } else {
        await this.updateSegmentMembership(
          segment.id,
          entityId,
          false,
          organizationId
        );
      }
    }

    return matchedSegments;
  }

  async refreshSegmentMembership(
    organizationId: string,
    segmentId: string,
    segment: Segment
  ): Promise<boolean> {
    try {
      const entities = await this.getAllEntities(organizationId);
      let updatedCount = 0;

      for (const entityId of entities) {
        const isInSegment = await this.evaluateSegmentConditions(
          segment,
          entityId
        );

        await this.updateSegmentMembership(
          segmentId,
          entityId,
          isInSegment,
          organizationId
        );

        if (isInSegment) {
          updatedCount++;
        }
      }

      logger.info(
        "lifecycle",
        `Refreshed segment membership for ${segmentId}`,
        {
          organizationId,
          entitiesUpdated: updatedCount,
          totalEntities: entities.length,
        }
      );

      return true;
    } catch (error) {
      logger.error(
        "lifecycle",
        `Failed to refresh segment membership for ${segmentId}`,
        error instanceof Error ? error : new Error(String(error)),
        { organizationId }
      );
      throw new DatabaseError("Failed to refresh segment membership");
    }
  }

  async refreshEntitySegmentMembership(
    organizationId: string,
    entityId: string
  ): Promise<boolean> {
    try {
      const segments = await this.listSegments(organizationId);
      let updatedCount = 0;

      for (const segment of segments) {
        const isInSegment = await this.evaluateSegmentConditions(
          segment,
          entityId
        );

        await this.updateSegmentMembership(
          segment.id,
          entityId,
          isInSegment,
          organizationId
        );

        if (isInSegment) {
          updatedCount++;
        }
      }

      logger.info(
        "lifecycle",
        `Refreshed segment membership for entity ${entityId}`,
        {
          organizationId,
          entityId,
          segmentsUpdated: updatedCount,
          totalSegments: segments.length,
        }
      );

      return true;
    } catch (error) {
      logger.error(
        "lifecycle",
        `Failed to refresh segment membership for entity ${entityId}`,
        error instanceof Error ? error : new Error(String(error)),
        { organizationId, entityId }
      );
      throw new DatabaseError("Failed to refresh entity segment membership");
    }
  }

  private async getAllEntities(organizationId: string): Promise<string[]> {
    try {
      const query = `
        SELECT id
        FROM entities
        WHERE org_id = {organizationId:String}
      `;

      const result = await this.clickhouse.query({
        query,
        query_params: { organizationId },
        format: "JSONEachRow",
      });

      const data = (await result.json()) as Array<{ id: string }>;
      const entityIds = data.map((row) => row.id);

      logger.info("lifecycle", `Retrieved all entities for organization`, {
        organizationId,
        entityCount: entityIds.length,
      });

      return entityIds;
    } catch (error) {
      logger.error(
        "lifecycle",
        `Error fetching all entities for organization`,
        error instanceof Error ? error : new Error(String(error)),
        { organizationId }
      );
      throw new DatabaseError("Failed to fetch all entities");
    }
  }

  public async segmentEvent(
    event: EntityCreatedEvent | EntityUpdatedEvent | EventOccurredEvent
  ): Promise<void> {
    const baseEventData = {
      type: event.type,
      organizationId: event.organizationId,
      entityId: event.entityId,
    };

    let eventName: string | undefined;
    let eventProperties: Record<string, any> | undefined;

    switch (event.type) {
      case EventType.ENTITY_CREATED:
        eventProperties = event.entityData;
        break;
      case EventType.ENTITY_UPDATED:
        eventProperties = event.changes;
        break;
      case EventType.EVENT_OCCURRED:
        eventName = event.eventName;
        eventProperties = event.eventProperties;
        break;
    }

    const matchedSegments = await this.evaluateSegmentMembership(
      baseEventData.organizationId,
      baseEventData.entityId,
      eventName,
      eventProperties
    );
  }
}
