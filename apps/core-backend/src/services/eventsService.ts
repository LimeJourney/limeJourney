import { clickhouseManager } from "../lib/clickhouse";
import { ClickHouseClient } from "@clickhouse/client";
import { AppError } from "@lime/errors";
import { logger } from "@lime/telemetry/logger";
import { EventData } from "../models/events";
import { EventQueueService, EventType } from "../lib/queue";
import { v4 as uuidv4 } from "uuid";
type QueryParamsType = Record<string, unknown>;

export class EventService {
  private clickhouse: ClickHouseClient;
  private eventQueueService: EventQueueService;

  constructor() {
    this.clickhouse = clickhouseManager.getClient();
    this.eventQueueService = EventQueueService.getInstance();
  }

  async recordEvent(
    organizationId: string,
    eventData: Omit<EventData, "org_id" | "timestamp" | "id" | "entity_id">
  ): Promise<EventData> {
    try {
      // First, get the entity's actual ID from the entities table
      const entityQuery = `
        SELECT id
        FROM entities
        WHERE org_id = {org_id:String} AND external_id = {external_id:String}
        LIMIT 1
      `;
      const entityResult = await this.clickhouse.query({
        query: entityQuery,
        query_params: {
          org_id: organizationId,
          external_id: eventData.entity_external_id,
        },
        format: "JSONEachRow",
      });
      const entityData = (await entityResult.json()) as { id: string }[];

      if (entityData.length > 0) {
        const event: EventData = {
          id: uuidv4(),
          ...eventData,
          org_id: organizationId,
          entity_id: entityData[0].id,
          entity_external_id: eventData.entity_external_id,
          timestamp: new Date().toISOString().slice(0, 19).replace("T", " "),
          properties: eventData.properties,
        };

        await this.clickhouse.insert({
          table: "events",
          values: [event],
          format: "JSONEachRow",
        });

        logger.info("events", `Event recorded for entity ${event.entity_id}`);

        this.eventQueueService.publish({
          type: EventType.EVENT_OCCURRED,
          organizationId: organizationId,
          entityId: event.entity_id,
          eventName: event.name,
          eventProperties: event.properties,
          timestamp: new Date().toISOString(),
        });

        return event;
      } else {
        // If the entity is not found, throw an error
        throw new AppError(
          `Entity with external ID ${eventData.entity_external_id} not found`,
          404,
          "ENTITY_NOT_FOUND"
        );
      }
    } catch (error: any) {
      logger.error("events", `Error recording event`, error);
      throw new AppError("Failed to record event", 500, "EVENT_RECORD_ERROR");
    }
  }

  async getEvents(
    organizationId: string,
    entityExternalId?: string,
    limit: number = 100,
    offset: number = 0
  ): Promise<EventData[]> {
    try {
      let query = `
        SELECT id, org_id, entity_id, entity_external_id, name, properties, timestamp
        FROM events
        WHERE org_id = {org_id:String}
      `;
      const params: QueryParamsType = { org_id: organizationId };

      if (entityExternalId) {
        query += ` AND entity_external_id = {entity_external_id:String}`;
        params.entity_external_id = entityExternalId;
      }

      query += `
        ORDER BY timestamp DESC
        LIMIT {limit:UInt32} OFFSET {offset:UInt32}
      `;
      params.limit = limit;
      params.offset = offset;

      const result = await this.clickhouse.query({
        query,
        query_params: params,
        format: "JSONEachRow",
      });

      const events: EventData[] = await result.json();
      return events.map((event: EventData) => this.parseEventProperties(event));
    } catch (error: any) {
      logger.error("events", `Error fetching events`, error);
      throw new AppError("Failed to fetch events", 500, "EVENT_FETCH_ERROR");
    }
  }

  async searchEvents(
    organizationId: string,
    searchQuery: string,
    limit: number = 100,
    offset: number = 0
  ): Promise<EventData[]> {
    try {
      const query = `
        SELECT id, org_id, entity_id, name, properties, timestamp
        FROM events
        WHERE org_id = {org_id:String}
          AND (name ILIKE {search:String} OR properties ILIKE {search:String})
        ORDER BY timestamp DESC
        LIMIT {limit:UInt32} OFFSET {offset:UInt32}
      `;

      const params: QueryParamsType = {
        org_id: organizationId,
        search: `%${searchQuery}%`,
        limit,
        offset,
      };

      const result = await this.clickhouse.query({
        query,
        query_params: params,
        format: "JSONEachRow",
      });

      const events: EventData[] = await result.json();
      return events.map((event) => this.parseEventProperties(event));
    } catch (error: any) {
      logger.error("events", `Error searching events`, error);
      throw new AppError("Failed to search events", 500, "EVENT_SEARCH_ERROR");
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

  async getUniqueEventNames(organizationId: string): Promise<string[]> {
    try {
      const query = `
        SELECT DISTINCT name
        FROM events
        WHERE org_id = {org_id:String}
        ORDER BY name ASC
      `;

      const params: QueryParamsType = {
        org_id: organizationId,
      };

      const result = await this.clickhouse.query({
        query,
        query_params: params,
        format: "JSONEachRow",
      });

      const eventNames: { name: string }[] = await result.json();
      console.log("EVENTNAMES", eventNames);
      return eventNames.map((event) => event.name);
    } catch (error: any) {
      logger.error("events", `Error fetching unique event names`, error);
      throw new AppError(
        "Failed to fetch unique event names",
        500,
        "EVENT_NAMES_FETCH_ERROR"
      );
    }
  }
}
