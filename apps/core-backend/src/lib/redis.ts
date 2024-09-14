import {
  createClient,
  RedisClientOptions,
  RedisClientType,
  RedisFunctions,
  RedisModules,
  RedisScripts,
} from "redis";
import { AppConfig } from "@lime/config";
import { logger } from "@lime/telemetry/logger";

class RedisManager {
  private static instance: RedisManager | null = null;
  private client: ReturnType<typeof createClient>;
  private isConnected: boolean = false;
  private reconnectTimer: NodeJS.Timeout | null = null;

  private constructor() {
    const options: RedisClientOptions = {
      url: AppConfig.redis.url,
      socket: {
        reconnectStrategy: (retries) => Math.min(retries * 50, 2000), // Max 2 seconds
      },
    };

    this.client = createClient(options);

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.client.on("error", (err) => {
      logger.error("redis", "Redis Client Error", err);
      this.isConnected = false;
    });

    this.client.on("connect", () => {
      logger.info("redis", "Redis Client Connected");
    });

    this.client.on("ready", () => {
      logger.info("redis", "Redis Client Ready");
      this.isConnected = true;
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = null;
      }
    });

    this.client.on("end", () => {
      logger.warn("redis", "Redis connection ended");
      this.isConnected = false;
      this.scheduleReconnect();
    });
  }

  public static getInstance(): RedisManager {
    if (!RedisManager.instance) {
      console.log("Creating new RedisManager instance");
      RedisManager.instance = new RedisManager();
    }
    console.log("Returning existing RedisManager instance");
    return RedisManager.instance;
  }

  public async connect(): Promise<void> {
    if (this.isConnected) {
      logger.info("redis", "Redis already connected");
      return;
    }

    try {
      await this.client.connect();
    } catch (error) {
      logger.error("redis", "Failed to connect to Redis", error as Error);
      this.scheduleReconnect();
      throw error;
    }
  }

  private scheduleReconnect(delay: number = 5000): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
    this.reconnectTimer = setTimeout(() => this.reconnect(), delay);
  }

  private async reconnect(retries: number = 5): Promise<void> {
    while (retries > 0 && !this.isConnected) {
      try {
        logger.info(
          "redis",
          `Attempting to reconnect to Redis. Retries left: ${retries}`
        );
        await this.connect();
        return;
      } catch (error) {
        retries--;
        if (retries === 0) {
          logger.error(
            "redis",
            "Failed to reconnect to Redis after multiple attempts",
            error as Error
          );
          this.scheduleReconnect(60000); // Try again in 1 minute
          return;
        }
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }
  }

  public getClient(): ReturnType<typeof createClient> {
    if (!this.isConnected) {
      this.connect();

      logger.info("redis", "Redis client connected");
    }
    return this.client;
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      logger.info("redis", "Redis already disconnected");
      return;
    }

    try {
      await this.client.quit();
      this.isConnected = false;
      logger.info("redis", "Disconnected from Redis");
    } catch (error) {
      logger.error("redis", "Error disconnecting from Redis", error as Error);
      throw error;
    }
  }

  public async healthCheck(): Promise<boolean> {
    try {
      if (!this.isConnected) {
        return false;
      }
      await this.client.ping();
      return true;
    } catch {
      return false;
    }
  }

  // Utility methods

  public async set(
    key: string,
    value: string,
    expireSeconds?: number
  ): Promise<void> {
    try {
      if (expireSeconds) {
        await this.client.setEx(key, expireSeconds, value);
      } else {
        await this.client.set(key, value);
      }
    } catch (error) {
      logger.error("redis", `Error setting key ${key}`, error as Error);
      throw error;
    }
  }

  public async get(key: string): Promise<string | null> {
    try {
      return await this.client.get(key);
    } catch (error) {
      logger.error("redis", `Error getting key ${key}`, error as Error);
      throw error;
    }
  }

  public async del(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      logger.error("redis", `Error deleting key ${key}`, error as Error);
      throw error;
    }
  }

  public async hSet(key: string, field: string, value: string): Promise<void> {
    try {
      await this.client.hSet(key, field, value);
    } catch (error) {
      logger.error(
        "redis",
        `Error setting hash field ${field} for key ${key}`,
        error as Error
      );
      throw error;
    }
  }

  public async hGet(key: string, field: string): Promise<string | undefined> {
    try {
      return await this.client.hGet(key, field);
    } catch (error) {
      logger.error(
        "redis",
        `Error getting hash field ${field} for key ${key}`,
        error as Error
      );
      throw error;
    }
  }

  public async hGetAll(key: string): Promise<Record<string, string>> {
    try {
      return await this.client.hGetAll(key);
    } catch (error) {
      logger.error(
        "redis",
        `Error getting all hash fields for key ${key}`,
        error as Error
      );
      throw error;
    }
  }
}

// Export a single instance
export const redisManager = RedisManager.getInstance();
export type RedisClient = ReturnType<typeof createClient>;
