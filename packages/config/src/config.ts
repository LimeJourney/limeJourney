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
  sentryDsn: z.string().url().optional(),
  port: z.number().int().positive().default(3000),
  database: z.object({
    host: z.string().default("localhost"),
    port: z.number().int().positive().default(5432),
    name: z.string(),
    user: z.string(),
    password: z.string(),
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
};

// Parse and validate the configuration
export const AppConfig = configSchema.parse(config);

// Type for the configuration
export type AppConfigType = z.infer<typeof configSchema>;
