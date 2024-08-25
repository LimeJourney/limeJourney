import { clickhouseManager } from "../lib/clickhouse";
import { ClickHouseClient } from "@clickhouse/client";
import { AppError } from "@lime/errors";
import { logger } from "@lime/telemetry/logger";
import { EventData } from "../models/events";

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
        timestamp: new Date().toISOString().slice(0, 19).replace("T", " "),
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

  // async getEventsByEntityId(
  //   organizationId: string,
  //   entityId: string,
  //   limit: number = 0,
  //   offset: number = 0
  // ): Promise<EventData[]> {
  //   try {
  // const query = `
  //   SELECT *
  //   FROM events
  //   WHERE org_id = {org_id:String}
  //     AND entity_id = {entity_id:String}
  //   ORDER BY timestamp DESC
  //   LIMIT {limit:UInt32}
  //   OFFSET {offset:UInt32}
  // `;

  //     const params: QueryParamsType = {
  //       org_id: organizationId,
  //       entity_id: entityId,
  //       limit,
  //       offset,
  //     };

  //     const result = await this.clickhouse.query({
  //       query,
  //       query_params: params,
  //       format: "JSONEachRow",
  //     });

  // const events: EventData[] = await result.json();
  // return events.map((event) => this.parseEventProperties(event));
  //   } catch (error: any) {
  //     logger.error(
  //       "events",
  //       `Error fetching events for entity ${entityId} in organization ${organizationId}`,
  //       error
  //     );
  //     throw new AppError(
  //       "Failed to fetch events for entity",
  //       500,
  //       "ENTITY_EVENTS_FETCH_ERROR"
  //     );
  //   }
  // }
}
