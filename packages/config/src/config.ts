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
};

// Parse and validate the configuration
export const AppConfig = configSchema.parse(config);

console.log("AppConfig", AppConfig);
// Type for the configuration
export type AppConfigType = z.infer<typeof configSchema>;
