import { BaseWorker } from "./baseWorker";
import { logger } from "@lime/telemetry/logger";

export class WorkerManager {
  private workers: BaseWorker[] = [];

  constructor() {}

  addWorker(worker: BaseWorker): void {
    this.workers.push(worker);
  }

  async startAll(): Promise<void> {
    logger.info("worker", `Starting ${this.workers.length} workers...`);

    for (const worker of this.workers) {
      try {
        await worker.setup();
        worker.run().catch((error) => {
          logger.error("worker", `Worker encountered an error:`, error);
        });
        logger.info("worker", `Started worker: ${worker.constructor.name}`);
      } catch (error) {
        logger.error(
          "worker",
          `Failed to start worker: ${worker.constructor.name}`,
          error as Error
        );
      }
    }

    logger.info("worker", "All workers started");
  }

  setupGracefulShutdown(): void {
    process.on("SIGINT", this.handleShutdownSignal.bind(this));
    process.on("SIGTERM", this.handleShutdownSignal.bind(this));
  }

  private async handleShutdownSignal(signal: string): Promise<void> {
    logger.info(
      "worker",
      `Received ${signal}. Shutting down all workers gracefully...`
    );

    await Promise.all(this.workers.map((worker) => worker.shutdown()));

    logger.info("worker", "All workers shut down successfully");
    process.exit(0);
  }
}
