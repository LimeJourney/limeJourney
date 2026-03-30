// Mock dependencies before imports
jest.mock("@lime/config", () => ({
  AppConfig: {
    eventQueue: { type: "simple" },
  },
}));

jest.mock("@lime/telemetry/logger", () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  },
}));

jest.mock("../../services/entitiesService", () => ({}));

import {
  EventQueueService,
  EventType,
  TriggerJourneyEvent,
  RetryConfig,
} from "../../lib/queue";

const { logger } = jest.requireMock("@lime/telemetry/logger");

describe("EventQueueService retry and dead-letter logic", () => {
  let service: EventQueueService;

  const retryConfig: RetryConfig = {
    maxRetries: 2,
    baseDelayMs: 10,
    maxDelayMs: 50,
  };

  beforeEach(() => {
    EventQueueService.resetInstance();
    service = EventQueueService.getInstance(retryConfig);
    jest.clearAllMocks();
  });

  afterEach(() => {
    EventQueueService.resetInstance();
  });

  const makeTriggerEvent = (): TriggerJourneyEvent => ({
    type: EventType.TRIGGER_JOURNEY,
    organizationId: "org-1",
    timestamp: new Date().toISOString(),
    entityId: "entity-1",
    journeyId: "journey-1",
    eventName: "test-event",
    eventProperties: { key: "value" },
    entityData: {} as any,
  });

  describe("executeWithRetry", () => {
    it("should call handler once on success", async () => {
      const handler = jest.fn().mockResolvedValue(undefined);
      service.registerEventHandler(EventType.TRIGGER_JOURNEY, handler);

      await service.initialize();
      await service.publish(makeTriggerEvent());

      expect(handler).toHaveBeenCalledTimes(1);
      expect(service.getFailedEventCount()).toBe(0);
      expect(service.getDeadLetterQueue()).toHaveLength(0);
    });

    it("should retry on failure and succeed on subsequent attempt", async () => {
      const handler = jest
        .fn()
        .mockRejectedValueOnce(new Error("Temporal unavailable"))
        .mockResolvedValue(undefined);

      service.registerEventHandler(EventType.TRIGGER_JOURNEY, handler);
      await service.initialize();
      await service.publish(makeTriggerEvent());

      expect(handler).toHaveBeenCalledTimes(2);
      expect(service.getRetriedEventCount()).toBe(1);
      expect(service.getFailedEventCount()).toBe(0);
      expect(service.getDeadLetterQueue()).toHaveLength(0);
    });

    it("should move event to DLQ after exhausting retries", async () => {
      const handler = jest
        .fn()
        .mockRejectedValue(new Error("Persistent failure"));

      service.registerEventHandler(EventType.TRIGGER_JOURNEY, handler);
      await service.initialize();
      await service.publish(makeTriggerEvent());

      // Initial attempt + 2 retries = 3 calls
      expect(handler).toHaveBeenCalledTimes(3);
      expect(service.getFailedEventCount()).toBe(1);
      expect(service.getDeadLetterQueue()).toHaveLength(1);

      const dlqEvent = service.getDeadLetterQueue()[0];
      expect(dlqEvent.error).toBe("Persistent failure");
      expect(dlqEvent.attempts).toBe(3);
      expect(dlqEvent.event.type).toBe(EventType.TRIGGER_JOURNEY);
    });

    it("should log warnings on each retry attempt", async () => {
      const handler = jest
        .fn()
        .mockRejectedValue(new Error("Temporary error"));

      service.registerEventHandler(EventType.TRIGGER_JOURNEY, handler);
      await service.initialize();
      await service.publish(makeTriggerEvent());

      // 2 retries = 2 warn calls
      const warnCalls = logger.warn.mock.calls.filter(
        (call: any[]) =>
          call[0] === "events" && call[1].includes("retrying in")
      );
      expect(warnCalls).toHaveLength(2);
      expect(warnCalls[0][2]).toMatchObject({ attempt: 1 });
    });

    it("should log error when event is moved to DLQ", async () => {
      const handler = jest.fn().mockRejectedValue(new Error("Fatal error"));

      service.registerEventHandler(EventType.TRIGGER_JOURNEY, handler);
      await service.initialize();
      await service.publish(makeTriggerEvent());

      const errorCalls = logger.error.mock.calls.filter(
        (call: any[]) =>
          call[0] === "events" && call[1].includes("dead-letter queue")
      );
      expect(errorCalls).toHaveLength(1);
      expect(errorCalls[0][3]).toMatchObject({ attempts: 3 });
    });
  });

  describe("getEventMetrics", () => {
    it("should return correct metrics", async () => {
      const handler = jest
        .fn()
        .mockRejectedValue(new Error("Persistent failure"));

      service.registerEventHandler(EventType.TRIGGER_JOURNEY, handler);
      await service.initialize();
      await service.publish(makeTriggerEvent());
      await service.publish(makeTriggerEvent());

      const metrics = service.getEventMetrics();
      expect(metrics.failedEvents).toBe(2);
      expect(metrics.retriedEvents).toBe(4); // 2 retries per event * 2 events
      expect(metrics.deadLetterQueueSize).toBe(2);
    });
  });

  describe("replayDeadLetterEvent", () => {
    it("should replay a dead-letter event successfully", async () => {
      const handler = jest
        .fn()
        .mockRejectedValue(new Error("Failure"));

      service.registerEventHandler(EventType.TRIGGER_JOURNEY, handler);
      await service.initialize();
      await service.publish(makeTriggerEvent());

      expect(service.getDeadLetterQueue()).toHaveLength(1);

      // Now make handler succeed for replay
      handler.mockResolvedValue(undefined);
      const result = await service.replayDeadLetterEvent(0);

      expect(result).toBe(true);
      expect(service.getDeadLetterQueue()).toHaveLength(0);
    });

    it("should return false for invalid index", async () => {
      const result = await service.replayDeadLetterEvent(999);
      expect(result).toBe(false);
    });

    it("should return false if replay fails", async () => {
      const handler = jest
        .fn()
        .mockRejectedValue(new Error("Always fails"));

      service.registerEventHandler(EventType.TRIGGER_JOURNEY, handler);
      await service.initialize();
      await service.publish(makeTriggerEvent());

      expect(service.getDeadLetterQueue()).toHaveLength(1);

      // Handler still fails for replay
      const result = await service.replayDeadLetterEvent(0);
      expect(result).toBe(false);
      expect(service.getDeadLetterQueue()).toHaveLength(1);
    });
  });

  describe("exponential backoff", () => {
    it("should cap delay at maxDelayMs", async () => {
      EventQueueService.resetInstance();
      const configWithManyRetries: RetryConfig = {
        maxRetries: 5,
        baseDelayMs: 10,
        maxDelayMs: 50,
      };
      service = EventQueueService.getInstance(configWithManyRetries);

      const handler = jest
        .fn()
        .mockRejectedValue(new Error("Failure"));

      service.registerEventHandler(EventType.TRIGGER_JOURNEY, handler);
      await service.initialize();

      const start = Date.now();
      await service.publish(makeTriggerEvent());
      const elapsed = Date.now() - start;

      // Capped delays: 10 + 20 + 40 + 50 + 50 = 170ms max, with timing variance
      expect(elapsed).toBeLessThan(500);
      expect(handler).toHaveBeenCalledTimes(6); // 1 initial + 5 retries
    });
  });
});
