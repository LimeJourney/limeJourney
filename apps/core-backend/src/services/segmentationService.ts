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

      await this.createMaterializedView(typedSegment);

      logger.info("lifecycle", `Created segment ${segment.id}`, {
        organizationId,
      });
      return typedSegment;
    } catch (error) {
      logger.error("lifecycle", "Failed to create segment", error as Error, {
        organizationId,
      });
      throw new DatabaseError("Failed to create segment");
    }
  }

  private async createMaterializedView(segment: Segment): Promise<void> {
    const { query, params } = this.buildSegmentCondition(segment.conditions);
    const createViewQuery = `
      CREATE MATERIALIZED VIEW IF NOT EXISTS segment_membership_${segment.id}
      ENGINE = MergeTree()
      ORDER BY (entity_id)
      POPULATE
      AS SELECT DISTINCT id AS entity_id
      FROM entities
      WHERE org_id = {organizationId:String}
      AND ${query}
    `;

    try {
      await this.clickhouse.query({
        query: createViewQuery,
        query_params: {
          organizationId: segment.organizationId,
          ...params,
        },
      });
      logger.info(
        "lifecycle",
        `Created materialized view for segment ${segment.id}`
      );
    } catch (error) {
      logger.error(
        "lifecycle",
        `Failed to create materialized view for segment ${segment.id}`,
        error as Error
      );
      throw new DatabaseError("Failed to create materialized view for segment");
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
    const segmentMap = new Map(allSegments.map((s) => [s.id, s]));

    // Fetch all segment memberships for the given entity IDs in a single query
    const query = `
      SELECT entity_id, segment_id
      FROM (
        ${allSegments
          .map(
            (s) => `
          SELECT entity_id, '${s.id}' as segment_id
          FROM segment_membership_${s.id}
          WHERE entity_id IN {entityIds:Array(String)}
        `
          )
          .join(" UNION ALL ")}
      )
    `;

    try {
      const result = await this.clickhouse.query({
        query,
        query_params: { entityIds },
        format: "JSONEachRow",
      });

      const data = (await result.json()) as SegmentMembership[];

      // Group segments by entity ID
      const entitySegments: { [entityId: string]: Segment[] } = {};
      for (const { entity_id, segment_id } of data) {
        if (!entitySegments[entity_id]) {
          entitySegments[entity_id] = [];
        }
        const segment = segmentMap.get(segment_id);
        if (segment) {
          entitySegments[entity_id].push({
            id: segment.id,
            name: segment.name,
            description: segment.description,
            createdAt: segment.createdAt,
            organizationId: segment.organizationId,
            conditions: segment.conditions,
            updatedAt: segment.updatedAt,
          });
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

      await this.updateMaterializedView(typedSegment);

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

  private async updateMaterializedView(segment: Segment): Promise<void> {
    await this.deleteMaterializedView(segment.id);
    await this.createMaterializedView(segment);
  }

  async deleteSegment(
    segmentId: string,
    organizationId: string
  ): Promise<boolean> {
    try {
      const result = await prisma.segment.deleteMany({
        where: {
          id: segmentId,
          organizationId,
        },
      });

      await this.deleteMaterializedView(segmentId);

      logger.info("lifecycle", `Deleted segment ${segmentId}`, {
        organizationId,
      });
      return result.count > 0;
    } catch (error) {
      logger.error(
        "lifecycle",
        `Failed to delete segment ${segmentId}`,
        error as Error,
        { organizationId }
      );
      throw new DatabaseError("Failed to delete segment");
    }
  }

  private async deleteMaterializedView(segmentId: string): Promise<void> {
    const query = `DROP VIEW IF EXISTS segment_membership_${segmentId}`;
    try {
      await this.clickhouse.query({ query });
      logger.info(
        "lifecycle",
        `Deleted materialized view for segment ${segmentId}`
      );
    } catch (error) {
      logger.error(
        "lifecycle",
        `Failed to delete materialized view for segment ${segmentId}`,
        error as Error
      );
      throw new DatabaseError("Failed to delete materialized view for segment");
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
      SELECT entity_id
      FROM segment_membership_${segmentId}
    `;

    try {
      const result = await this.clickhouse.query({
        query,
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
        error as Error,
        { organizationId }
      );
      throw new DatabaseError("Failed to get entities in segment");
    }
  }

  private buildSegmentCondition(conditions: SegmentCondition[]): {
    query: string;
    params: Record<string, any>;
  } {
    let paramCounter = 0;
    const params: Record<string, any> = {};

    const conditionStrings = conditions.map((condition, conditionIndex) => {
      const criteriaStrings = condition.criteria.map((c, criterionIndex) => {
        const fieldParam = `field_${conditionIndex}_${criterionIndex}`;
        const valueParam = `value_${conditionIndex}_${criterionIndex}`;
        params[fieldParam] = c.field;
        params[valueParam] = c.value;

        if (c.type === SegmentCriterionType.PROPERTY) {
          return `JSONExtractString(properties, {${fieldParam}:String}) ${this.getOperatorSQL(c.operator)} {${valueParam}:String}`;
        } else if (c.type === SegmentCriterionType.EVENT) {
          const eventNameParam = `event_${conditionIndex}_${criterionIndex}`;
          params[eventNameParam] = c.field;
          return `EXISTS (
            SELECT 1 FROM events
            WHERE entity_id = entities.id 
            AND name = {${eventNameParam}:String}
            AND JSONExtractString(properties, {${fieldParam}:String}) ${this.getOperatorSQL(c.operator)} {${valueParam}:String}
          )`;
        } else {
          throw new Error(`Unsupported criterion type: ${c.type}`);
        }
      });

      const logicalOp =
        condition.logicalOperator === LogicalOperator.AND ? "AND" : "OR";
      return `(${criteriaStrings.join(` ${logicalOp} `)})`;
    });

    const query = conditionStrings.join(" AND ");
    return { query, params };
  }

  private getOperatorSQL(operator: SegmentOperator): string {
    switch (operator) {
      case SegmentOperator.EQUALS:
        return "=";
      case SegmentOperator.NOT_EQUALS:
        return "!=";
      case SegmentOperator.GREATER_THAN:
        return ">";
      case SegmentOperator.LESS_THAN:
        return "<";
      case SegmentOperator.CONTAINS:
        return "LIKE";
      case SegmentOperator.NOT_CONTAINS:
        return "NOT LIKE";
      case SegmentOperator.IN:
        return "IN";
      case SegmentOperator.NOT_IN:
        return "NOT IN";
      case SegmentOperator.BETWEEN:
        return "BETWEEN";
      case SegmentOperator.NOT_BETWEEN:
        return "NOT BETWEEN";
      default:
        throw new Error(`Unsupported operator: ${operator}`);
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
      FROM segment_membership_${segment.id}
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

  // private async getConversionRate(segment: Segment): Promise<number> {
  //   const query = `
  //     SELECT
  //       SUM(CASE WHEN JSONExtractString(e.properties, 'has_purchased') = 'true' THEN 1 ELSE 0 END) / COUNT(*) as conversion_rate
  //     FROM entities e
  //     JOIN segment_membership_${segment.id} sm ON e.id = sm.entity_id
  //     WHERE e.org_id = {organizationId:String}
  //   `;

  //   try {
  //     const result = await this.clickhouse.query({
  //       query,
  //       query_params: { organizationId: segment.organizationId },
  //       format: "JSONEachRow",
  //     });

  //     const data = await result.json();
  //     return parseFloat(data[0].conversion_rate);
  //   } catch (error) {
  //     logger.error(
  //       "lifecycle",
  //       `Failed to get conversion rate for segment ${segment.id}`,
  //       error as Error
  //     );
  //     throw new DatabaseError("Failed to get conversion rate");
  //   }
  // }

  async getSegmentsForEntity(
    entityId: string,
    organizationId: string
  ): Promise<Segment[]> {
    const allSegments = await this.listSegments(organizationId);
    const entitySegments: Segment[] = [];

    for (const segment of allSegments) {
      const query = `
        SELECT 1
        FROM segment_membership_${segment.id}
        WHERE entity_id = {entityId:String}
        LIMIT 1
      `;

      try {
        const result = await this.clickhouse.query({
          query,
          query_params: { entityId },
          format: "JSONEachRow",
        });

        const data = await result.json();
        if (data.length > 0) {
          entitySegments.push(segment);
        }
      } catch (error) {
        logger.error(
          "lifecycle",
          `Error checking if entity ${entityId} is in segment ${segment.id}`,
          error as Error
        );
      }
    }

    logger.info("lifecycle", `Retrieved segments for entity ${entityId}`, {
      organizationId,
    });
    return entitySegments;
  }
}
