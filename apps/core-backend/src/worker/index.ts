import { WorkerManager } from "./workerManager";
import { TemporalWorker } from "./temporalWorker";
import { logger } from "@lime/telemetry/logger";

export async function runAllWorkers() {
  const manager = new WorkerManager();

  manager.addWorker(new TemporalWorker());

  manager.setupGracefulShutdown();

  try {
    await manager.startAll();
    logger.info("worker", "All workers are running. Press Ctrl+C to stop.");
  } catch (error) {
    logger.error("worker", "Failed to start workers", error as Error);
    process.exit(1);
  }
}

if (require.main === module) {
  runAllWorkers().catch((error) => {
    logger.error("worker", "Error running workers", error as Error);
    process.exit(1);
  });
}
