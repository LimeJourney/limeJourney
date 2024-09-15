import { createClient, RedisClientType } from "redis";
import { logger } from "@lime/telemetry/logger";
import { AppError } from "@lime/errors";

export class RedisManager {
  private static instance: RedisManager;
  private client: RedisClientType;

  private constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL || "redis://localhost:6379",
    });

    this.client.on("error", (err) => {
      logger.error("redis", "Redis Client Error", err);
    });

    this.client.on("connect", () => {
      logger.info("redis", "Redis Client Connected");
    });
  }

  public static getInstance(): RedisManager {
    if (!RedisManager.instance) {
      RedisManager.instance = new RedisManager();
    }
    return RedisManager.instance;
  }

  public async connect(): Promise<void> {
    try {
      await this.client.connect();
    } catch (error: any) {
      logger.error("redis", "Failed to connect to Redis", error);
      throw new AppError(
        "Failed to connect to Redis",
        500,
        "REDIS_CONNECTION_ERROR"
      );
    }
  }

  public getClient(): RedisClientType {
    return this.client;
  }

  public async sAdd(key: string, member: string): Promise<number> {
    try {
      return await this.client.sAdd(key, member);
    } catch (error: any) {
      logger.error("redis", `Error adding member to set: ${key}`, error);
      throw new AppError(
        "Failed to add member to set",
        500,
        "REDIS_SADD_ERROR"
      );
    }
  }

  public async sMembers(key: string): Promise<string[]> {
    try {
      return await this.client.sMembers(key);
    } catch (error: any) {
      logger.error("redis", `Error getting members from set: ${key}`, error);
      throw new AppError(
        "Failed to get members from set",
        500,
        "REDIS_SMEMBERS_ERROR"
      );
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await this.client.disconnect();
    } catch (error: any) {
      logger.error("redis", "Error disconnecting from Redis", error);
      throw new AppError(
        "Failed to disconnect from Redis",
        500,
        "REDIS_DISCONNECT_ERROR"
      );
    }
  }
}

export const redisManager = RedisManager.getInstance();
