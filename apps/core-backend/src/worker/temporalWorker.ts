import { Worker, NativeConnection } from "@temporalio/worker";
import * as activities from "../lib/temporal/activities";
import * as workflows from "../lib/temporal/workflows";
import { AppConfig } from "@lime/config";
import { BaseWorker } from "./baseWorker";
import { logger } from "@lime/telemetry/logger";

export class TemporalWorker extends BaseWorker {
  private worker!: Worker;

  constructor() {
    super("TemporalWorker");
  }

  async setup(): Promise<void> {
    const connection = await NativeConnection.connect({
      address: AppConfig.temporal.address,
    });

    this.worker = await Worker.create({
      connection,
      namespace: AppConfig.temporal.namespace,
      taskQueue: AppConfig.temporal.taskQueue,
      workflowsPath: require.resolve("../lib/temporal/workflows"),
      activities,
    });

    logger.info("temporal", "Temporal Worker setup complete");
  }

  async run(): Promise<void> {
    if (!this.worker) {
      throw new Error("Worker not set up. Call setup() before run()");
    }

    try {
      logger.info("temporal", "Temporal Worker starting");
      await this.worker.run();
    } catch (error) {
      logger.error(
        "temporal",
        "Temporal Worker encountered an error",
        error as Error
      );
      throw error;
    }
  }

  async shutdown(): Promise<void> {
    try {
      await this.worker?.shutdown();
      logger.info("temporal", "Temporal Worker shut down successfully");
    } catch (error) {
      logger.error(
        "temporal",
        "Error during Temporal Worker shutdown",
        error as Error
      );
      throw error;
    }
  }
}
