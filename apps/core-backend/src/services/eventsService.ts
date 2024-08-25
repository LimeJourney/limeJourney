import { clickhouseManager } from "../lib/clickhouse";
import { ClickHouseClient } from "@clickhouse/client";
import { AppError } from "@lime/errors";
import { logger } from "@lime/telemetry/logger";

export interface EventData {
  id?: string;
  org_id: string;
  entity_id: string;
  name: string;
  properties: Record<string, any>;
  timestamp: Date;
}

type QueryParamsType = Record<string, unknown>;

export class EventService {
  private clickhouse: ClickHouseClient;

  constructor() {
    this.clickhouse = clickhouseManager.getClient();
  }

  async recordEvent(
    organizationId: string,
    eventData: Omit<EventData, "org_id" | "timestamp">
  ): Promise<EventData> {
    try {
      const event: EventData = {
        ...eventData,
        org_id: organizationId,
        timestamp: new Date(),
        properties: eventData.properties,
      };

      await this.clickhouse.insert({
        table: "events",
        values: [event],
        format: "JSONEachRow",
      });

      logger.info("events", `Event recorded for entity ${event.entity_id}`);
      return event;
    } catch (error: any) {
      logger.error("events", `Error recording event`, error);
      throw new AppError("Failed to record event", 500, "EVENT_RECORD_ERROR");
    }
  }

  async getEvents(
    organizationId: string,
    entityId?: string,
    limit: number = 100,
    offset: number = 0
  ): Promise<EventData[]> {
    try {
      let query = `
        SELECT id, org_id, entity_id, name, properties, timestamp
        FROM events
        WHERE org_id = {org_id:String}
      `;
      const params: QueryParamsType = { org_id: organizationId };

      if (entityId) {
        query += ` AND entity_id = {entity_id:String}`;
        params.entity_id = entityId;
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

      const events: EventData[] = await result.json<{ events: EventData[] }>();
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

      const events = await result.json<EventData[]>();
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
}
