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
import { EventData } from "../models/events";

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

export class EntityService {
  private clickhouse: ClickHouseClient;
  private segmentationService: SegmentationService;

  constructor() {
    this.clickhouse = clickhouseManager.getClient();
    this.segmentationService = new SegmentationService();
  }

  private async executeInsert(
    table: string,
    data: Record<string, any>,
    errorMessage: string
  ): Promise<void> {
    try {
      await this.clickhouse.insert({
        table,
        values: [data],
        format: "JSONEachRow",
      });
    } catch (error: any) {
      logger.error("database", `${errorMessage}: ${error}`, error);
      throw new DatabaseError(errorMessage);
    }
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
    data: Omit<EntityData, "org_id" | "created_at" | "updated_at" | "id">
  ): Promise<EntityData> {
    if (!organizationId) {
      throw new ValidationError("Organization ID is required");
    }
    const { external_id, properties } = data;

    // Format the timestamp correctly for ClickHouse
    const timestamp = new Date()
      .toISOString()
      .replace(/T/, " ")
      .replace(/\..+/, "")
      .slice(0, 19);

    try {
      // First, check if the entity exists
      const checkQuery = `
        SELECT *
        FROM entities
        WHERE org_id = {org_id:String} AND external_id = {external_id:String}
        LIMIT 1
      `;

      const checkResult = await this.executeQuery(
        checkQuery,
        {
          org_id: organizationId,
          external_id: external_id || "",
        },
        "Failed to check entity existence"
      );
      const entityResult = await checkResult.json();
      const entityExists = entityResult.length > 0;

      if (entityExists) {
        const existingProperties = JSON.parse(entityResult[0].properties);

        // Merge existing and new properties
        const mergedProperties = {
          ...existingProperties,
          ...properties,
        };
        // Update existing entity
        const updateQuery = `
          ALTER TABLE entities
          UPDATE properties = {properties:String}
          WHERE org_id = {org_id:String} AND external_id = {external_id:String}
        `;

        await this.executeQuery(
          updateQuery,
          {
            org_id: organizationId,
            external_id: external_id || "",
            properties: JSON.stringify(mergedProperties),
            updated_at: timestamp,
          },
          "Failed to update entity"
        );
      } else {
        // Insert new entity
        const insertData = {
          org_id: organizationId,
          external_id: external_id || "",
          properties: properties,
        };

        await this.executeInsert(
          "entities",
          insertData,
          "Failed to create entity"
        );
      }

      return {
        id: "",
        org_id: organizationId,
        external_id: data.external_id,
        properties: data.properties,
        created_at: timestamp,
        updated_at: timestamp,
      };
    } catch (error: any) {
      logger.error(
        "database",
        `Failed to create/update entity: ${error}`,
        error
      );
      throw new DatabaseError("Failed to create/update entity");
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
      WHERE org_id = {organizationId:String}
      ORDER BY updated_at DESC
    `;

    const params = { organizationId };

    try {
      const result = await this.executeQuery(
        query,
        params,
        "Failed to list entities"
      );
      const entities = await result.json();

      const parsedEntities: EntityData[] = entities.map(
        (entity: { properties: string }) => ({
          ...entity,
          properties: JSON.parse(entity.properties as string),
        })
      );

      // Fetch segments for all entities
      const entityIds = parsedEntities.map(
        (entity) => entity.external_id || ""
      );
      const entitySegments =
        await this.segmentationService.getSegmentsForMultipleEntities(
          entityIds,
          organizationId
        );

      // Combine entity data with segment information
      const entitiesWithSegments: EntityWithSegments[] = parsedEntities.map(
        (entity) => ({
          ...entity,
          segments: entitySegments[entity.external_id!] || [],
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
    eventData: Omit<EventData, "id" | "org_id" | "entity_id" | "timestamp">
  ): Promise<EventData> {
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

      // Fetch the inserted event to get the generated ID
      const fetchQuery = `
        SELECT id, org_id, entity_id, name, properties, timestamp
        FROM events
        WHERE org_id = {organizationId} AND entity_id = {entityId} AND timestamp = {timestamp}
        ORDER BY timestamp DESC
        LIMIT 1
      `;

      const result = await this.executeQuery(
        fetchQuery,
        params,
        "Failed to fetch recorded event"
      );
      const insertedEvent = result.data[0];

      return {
        id: insertedEvent.id,
        org_id: insertedEvent.org_id,
        entity_id: insertedEvent.entity_id,
        name: insertedEvent.name,
        properties: JSON.parse(insertedEvent.properties),
        timestamp: insertedEvent.timestamp,
      };
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof DatabaseError) {
        throw error;
      }
      throw new Error("Unexpected error occurred while recording event");
    }
  }

  private parseEventProperties(event: EventData): EventData {
    return {
      ...event,
      properties:
        typeof event.properties === "string"
          ? JSON.parse(event.properties)
          : event.properties,
      timestamp: new Date(event.timestamp),
    };
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
    WHERE org_id = {org_id:String}
    AND entity_id = {entity_id:String}
    ORDER BY timestamp DESC
  `;

    const params = { org_id: organizationId, entity_id: entityId };
    try {
      const result = await this.executeQuery(
        query,
        params,
        "Failed to retrieve entity events"
      );
      const events: EventData[] = await result.json();
      return events.map((event) => this.parseEventProperties(event));
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

  public async listUniqueProperties(organizationId: string): Promise<string[]> {
    if (!organizationId) {
      throw new ValidationError("Organization ID is required");
    }

    const query = `
      SELECT DISTINCT arrayJoin(JSONExtractKeys(properties)) AS property_name
      FROM entities
      WHERE org_id = {organizationId:String}
      ORDER BY property_name
    `;

    const params = { organizationId };

    try {
      const result = await this.executeQuery(
        query,
        params,
        "Failed to list unique properties"
      );

      const rows = await result.json();
      const out = rows.map((row: { property_name: string }) => {
        return row.property_name;
      });

      return out;
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error;
      }
      throw new Error(
        "Unexpected error occurred while listing unique properties"
      );
    }
  }
}
