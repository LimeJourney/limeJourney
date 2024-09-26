export abstract class BaseWorker {
  constructor(workerName: string) {}

  abstract setup(): Promise<void>;
  abstract run(): Promise<void>;
  abstract shutdown(): Promise<void>;
}
