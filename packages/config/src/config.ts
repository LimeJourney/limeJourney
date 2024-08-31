import dotenv from "dotenv";
import { z } from "zod";

// Load environment variables from .env file
dotenv.config();

// Define the schema for the configuration
const configSchema = z.object({
  nodeEnv: z.enum(["development", "test", "production"]).default("development"),
  isProduction: z.boolean(),
  logLevel: z
    .enum(["error", "warn", "info", "http", "verbose", "debug", "silly"])
    .default("info"),
  sentryDsn: z.string().optional(),
  port: z.number().int().positive().default(3000),
  database: z.object({
    host: z.string().default("localhost"),
    port: z.number().int().positive().default(5432),
    name: z.string(),
    user: z.string(),
    password: z.string(),
  }),
  jwtSecret: z.string().default("your-default-secret-key"),
  google: z.object({
    clientId: z.string(),
    clientSecret: z.string(),
  }),
  appUrl: z.string(),
  enforceSubscriptions: z.string().default("true"),
  clickhouse: z.object({
    host: z.string(),
    port: z.number().int().positive(),
    name: z.string(),
    user: z.string(),
    password: z.string(),
  }),
  eventQueue: z.object({
    type: z.enum(["memory", "kafka"]).default("memory"),
    options: z.object({
      brokers: z.array(z.string()),
      clientId: z.string(),
      groupId: z.string(),
      username: z.string(),
      password: z.string(),
      ssl: z.boolean().default(false),
      bootstrapEndpoint: z.string(),
      topic: z.string(),
    }),
  }),
});

// Helper function to parse environment variables
const env = (key: string, defaultValue?: string): string =>
  process.env[key] || defaultValue || "";

// Create our configuration object
const config = {
  nodeEnv: env("NODE_ENV", "development"),
  isProduction: env("NODE_ENV") === "production",
  logLevel: env("LOG_LEVEL", "info"),
  sentryDsn: env("SENTRY_DSN"),
  port: parseInt(env("PORT", "3000"), 10),
  database: {
    host: env("DB_HOST", "localhost"),
    port: parseInt(env("DB_PORT", "5432"), 10),
    name: env("DB_NAME"),
    user: env("DB_USER"),
    password: env("DB_PASSWORD"),
  },
  google: {
    clientId: env("GOOGLE_CLIENT_ID"),
    clientSecret: env("GOOGLE_CLIENT_SECRET"),
  },
  jwtSecret: env("JWT_SECRET", "your-default-secret-key"),
  appUrl: env("APP_URL"),
  enforceSubscriptions: env("ENFORCE_SUBSCRIPTIONS"),
  clickhouse: {
    host: env("CLICKHOUSE_HOST", "http://localhost:8123"),
    port: parseInt(env("CLICKHOUSE_PORT", "9000"), 10),
    name: env("CLICKHOUSE_DATBASE_NAME", "default"),
    user: env("CLICKHOUSE_USER", "default"),
    password: env("CLICKHOUSE_PASSWORD", ""),
  },
  eventQueue: {
    type: env("EVENT_QUEUE_TYPE", "memory"),
    options: {
      brokers: env("KAFKA_BROKERS", "localhost:9092").split(","),
      clientId: env("KAFKA_CLIENT_ID", "my-app"),
      groupId: env("KAFKA_GROUP_ID", "my-app-group"),
      username: env("KAFKA_USERNAME"),
      password: env("KAFKA_PASSWORD"),
      ssl: env("KAFKA_USE_SSL", "false") === "true",
      bootstrapEndpoint: env("KAFKA_BOOTSTRAP_ENDPOINT", "localhost:9092"),
      topic: env("KAFKA_TOPIC", "events"),
    },
  },
};
// Parse and validate the configuration
export const AppConfig = configSchema.parse(config);

// Type for the configuration
export type AppConfigType = z.infer<typeof configSchema>;
