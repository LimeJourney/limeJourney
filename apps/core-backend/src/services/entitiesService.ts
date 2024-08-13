import {
  AppError,
  DatabaseError,
  NotFoundError,
  ValidationError,
} from "@lime/errors";
import { clickhouseManager } from "../lib/clickhouse";
import { ClickHouseClient } from "@clickhouse/client";
import { logger } from "@lime/telemetry/logger";
import { SegmentationService } from "./segmentationService";

export interface EntityData {
  id: string;
  org_id: string;
  external_id?: string;
  properties: Record<string, any>;
  created_at: string;
  updated_at: string;
}

interface EntityWithSegments extends EntityData {
  segments: {
    id: string;
    name: string;
    description: string;
    createdAt: Date;
  }[];
}

export interface EventData {
  name: string;
  properties: Record<string, any>;
}

export class EntityService {
  private clickhouse: ClickHouseClient;
  private segmentationService: SegmentationService;

  constructor() {
    this.clickhouse = clickhouseManager.getClient();
    this.segmentationService = new SegmentationService();
  }

  private async executeQuery(
    query: string,
    params: Record<string, any>,
    errorMessage: string
  ): Promise<any> {
    try {
      return await this.clickhouse.query({
        query,
        query_params: params,
        format: "JSONEachRow",
      });
    } catch (error: any) {
      logger.error("database", `${errorMessage}: ${error}`, error);
      throw new DatabaseError(errorMessage);
    }
  }

  async createOrUpdateEntity(
    organizationId: string,
    data: Omit<EntityData, "id" | "org_id" | "created_at" | "updated_at">
  ): Promise<EntityData> {
    if (!organizationId) {
      throw new ValidationError("Organization ID is required");
    }

    const { external_id, properties } = data;
    const timestamp = new Date().toISOString();

    const query = `
        INSERT INTO entities (org_id, external_id, properties, created_at, updated_at)
        VALUES ({organizationId}, {external_id}, {properties}, {timestamp}, {timestamp})
        ON DUPLICATE KEY UPDATE
          properties = {properties},
          updated_at = {timestamp}
      `;

    const params = {
      organizationId,
      external_id: external_id || "",
      properties: JSON.stringify(properties),
      timestamp,
    };

    try {
      await this.executeQuery(
        query,
        params,
        "Failed to create or update entity"
      );
      return {
        id: "",
        org_id: organizationId,
        external_id,
        properties,
        created_at: timestamp,
        updated_at: timestamp,
      };
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error;
      }
      throw new Error(
        "Unexpected error occurred while creating or updating entity"
      );
    }
  }

  async getEntity(
    organizationId: string,
    entityId: string
  ): Promise<EntityData> {
    if (!organizationId || !entityId) {
      throw new ValidationError("Organization ID and Entity ID are required");
    }

    const query = `
        SELECT * FROM entities
        WHERE org_id = {organizationId}
        AND (id = {entityId} OR external_id = {entityId})
        LIMIT 1
      `;

    const params = { organizationId, entityId };

    try {
      const result = await this.executeQuery(
        query,
        params,
        "Failed to retrieve entity"
      );

      if (result.rows === 0) {
        throw new NotFoundError(`Entity not found for ID: ${entityId}`);
      }

      return result.data[0];
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof DatabaseError) {
        throw error;
      }
      throw new Error("Unexpected error occurred while retrieving entity");
    }
  }

  async getEntityWithSegments(
    entityId: string,
    organizationId: string
  ): Promise<EntityWithSegments> {
    const entity = await this.getEntity(entityId, organizationId);
    if (!entity) {
      throw new Error("Entity not found");
    }

    const segments = await this.segmentationService.getSegmentsForEntity(
      entityId,
      organizationId
    );

    return {
      ...entity,
      segments: segments.map((segment) => ({
        id: segment.id,
        name: segment.name,
        description: segment.description,
        createdAt: segment.createdAt,
      })),
    };
  }

  async listEntities(organizationId: string): Promise<EntityWithSegments[]> {
    if (!organizationId) {
      throw new ValidationError("Organization ID is required");
    }

    const query = `
      SELECT *
      FROM entities
      WHERE org_id = {organizationId}
      ORDER BY updated_at DESC
    `;

    const params = { organizationId };

    try {
      const result = await this.executeQuery(
        query,
        params,
        "Failed to list entities"
      );
      const entities: EntityData[] = result.data;

      // Fetch segments for all entities
      const entityIds = entities.map((entity) => entity.id);
      const entitySegments =
        await this.segmentationService.getSegmentsForMultipleEntities(
          entityIds,
          organizationId
        );

      // Combine entity data with segment information
      const entitiesWithSegments: EntityWithSegments[] = entities.map(
        (entity) => ({
          ...entity,
          segments: entitySegments[entity.id] || [],
        })
      );

      return entitiesWithSegments;
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error;
      }
      throw new Error("Unexpected error occurred while listing entities");
    }
  }

  async recordEvent(
    organizationId: string,
    entityId: string,
    eventData: EventData
  ): Promise<EventData & { entity_id: string; timestamp: string }> {
    if (!organizationId || !entityId) {
      throw new ValidationError("Organization ID and Entity ID are required");
    }

    try {
      const entity = await this.getEntity(organizationId, entityId);
      const timestamp = new Date().toISOString();

      const query = `
          INSERT INTO events (org_id, entity_id, name, properties, timestamp)
          VALUES ({organizationId}, {entityId}, {name}, {properties}, {timestamp})
        `;

      const params = {
        organizationId,
        entityId: entity.id,
        name: eventData.name,
        properties: JSON.stringify(eventData.properties),
        timestamp,
      };

      await this.executeQuery(query, params, "Failed to record event");

      return { ...eventData, entity_id: entity.id, timestamp };
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof DatabaseError) {
        throw error;
      }
      throw new Error("Unexpected error occurred while recording event");
    }
  }

  async getEntityEvents(
    organizationId: string,
    entityId: string
  ): Promise<EventData[]> {
    if (!organizationId || !entityId) {
      throw new ValidationError("Organization ID and Entity ID are required");
    }

    const query = `
          SELECT *
          FROM events
          WHERE org_id = {organizationId} AND entity_id = {entityId}
          ORDER BY timestamp DESC
        `;

    const params = { organizationId, entityId };

    try {
      const result = await this.executeQuery(
        query,
        params,
        "Failed to retrieve entity events"
      );
      return result.data;
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error;
      }
      throw new Error(
        "Unexpected error occurred while retrieving entity events"
      );
    }
  }

  async searchEntities(
    organizationId: string,
    searchQuery: string
  ): Promise<EntityData[]> {
    if (!organizationId) {
      throw new ValidationError("Organization ID is required");
    }

    const query = `
          SELECT *
          FROM entities
          WHERE org_id = {organizationId}
          AND properties ILIKE {searchPattern}
          ORDER BY updated_at DESC
        `;

    const params = {
      organizationId,
      searchPattern: `%${searchQuery}%`,
    };

    try {
      const result = await this.executeQuery(
        query,
        params,
        "Failed to search entities"
      );
      return result.data;
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error;
      }
      throw new Error("Unexpected error occurred while searching entities");
    }
  }

  async getEntityStats(organizationId: string): Promise<{
    totalEntities: number;
    oldestEntity: string;
    newestEntity: string;
    uniqueExternalIds: number;
  }> {
    if (!organizationId) {
      throw new ValidationError("Organization ID is required");
    }

    const query = `
          SELECT
            count(*) as totalEntities,
            min(created_at) as oldestEntity,
            max(created_at) as newestEntity,
            count(distinct external_id) as uniqueExternalIds
          FROM entities
          WHERE org_id = {organizationId}
        `;

    try {
      const result = await this.executeQuery(
        query,
        { organizationId },
        "Failed to retrieve entity statistics"
      );
      return result.data[0];
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error;
      }
      throw new Error(
        "Unexpected error occurred while retrieving entity statistics"
      );
    }
  }
}
