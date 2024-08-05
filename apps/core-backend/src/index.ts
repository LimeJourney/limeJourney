import { App } from "./app";
import { logger } from "@lime/telemetry/logger";

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3002;
const app = new App();
app.start(port);
const gracefulShutdown = async (signal: string) => {
  logger.info("lifecycle", `${signal} received. Starting graceful shutdown`);
  await app.stop();
  process.exit(0);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

process.on("unhandledRejection", (reason, promise) => {
  logger.error("lifecycle", "Unhandled Rejection", new Error(String(reason)), {
    promise,
  });
});

process.on("uncaughtException", (error) => {
  logger.error("lifecycle", "Uncaught Exception", error);
  process.exit(1);
});
