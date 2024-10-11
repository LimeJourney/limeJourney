import { createClient, ClickHouseClient } from "@clickhouse/client";
import { AppConfig } from "@lime/config";
import { logger } from "@lime/telemetry/logger";

class ClickHouseManager {
  private static instance: ClickHouseManager;
  private client: ClickHouseClient;

  private constructor() {
    this.client = createClient({
      url: AppConfig.clickhouse.host,

      username: AppConfig.clickhouse.user,
      password: AppConfig.clickhouse.password,
      database: AppConfig.clickhouse.name,
    });
  }

  public static getInstance(): ClickHouseManager {
    if (!ClickHouseManager.instance) {
      ClickHouseManager.instance = new ClickHouseManager();
    }
    return ClickHouseManager.instance;
  }

  public getClient(): ClickHouseClient {
    return this.client;
  }

  private async executeQuery(query: string, logMessage: string): Promise<void> {
    logger.info("database", logMessage);
    try {
      await this.client.query({
        query,
        format: "JSONEachRow",
      });
    } catch (error: any) {
      logger.error("database", `Error executing query: ${logMessage}`, error);
      throw error;
    }
  }

  private schemas = {
    entities: `
    CREATE TABLE IF NOT EXISTS entities (
      id UUID DEFAULT generateUUIDv4(),
      org_id String,
      external_id String,
      properties String,
      created_at DateTime,
      updated_at DateTime
    ) ENGINE = ReplacingMergeTree(updated_at)
    ORDER BY (org_id, external_id)
    PRIMARY KEY (org_id, external_id)
    `,
    events: `
      CREATE TABLE IF NOT EXISTS events (
        id UUID DEFAULT generateUUIDv4(),
        org_id String,
        entity_id String,
        entity_external_id String,
        name String,
        properties String,
        timestamp DateTime
      ) ENGINE = MergeTree()
      ORDER BY (org_id, entity_id, timestamp)
    `,
    segments: `
      CREATE TABLE IF NOT EXISTS segment_memberships (
        segment_id String,
        entity_id String,
        org_id String,
        created_at DateTime
      ) ENGINE = ReplacingMergeTree(created_at)
      ORDER BY (org_id, segment_id, entity_id)
    `,
  };

  private migrations = [
    async () =>
      this.executeQuery(this.schemas.entities, "Creating entities table..."),
    async () =>
      this.executeQuery(this.schemas.events, "Creating events table..."),
    async () =>
      this.executeQuery(this.schemas.segments, "Creating segments table..."),
  ];

  public async runMigrations(): Promise<void> {
    logger.info("database", "Running migrations...");
    try {
      for (const migration of this.migrations) {
        await migration();
      }
      logger.info("database", "Migrations completed successfully.");
    } catch (error: any) {
      logger.error("database", "Error running migrations", error);
      throw error;
    }
  }

  public async setupDatabase(): Promise<void> {
    logger.info("database", "Setting up database...");
    try {
      await this.runMigrations();
      logger.info("database", "Database setup completed successfully.");
    } catch (error: any) {
      logger.error("database", "Error setting up database", error);
      throw error;
    }
  }
}

export const clickhouseManager = ClickHouseManager.getInstance();
export const clickhouse = clickhouseManager.getClient();
