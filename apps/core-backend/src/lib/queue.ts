import { Kafka, Producer, Consumer, KafkaMessage, logLevel } from "kafkajs";
import { EventEmitter } from "events";
import { AppConfig } from "@lime/config";
import { logger } from "@lime/telemetry/logger";
import { EntityData } from "../services/entitiesService";

export enum EventType {
  ENTITY_CREATED = "ENTITY_CREATED",
  ENTITY_UPDATED = "ENTITY_UPDATED",
  SEGMENT_UPDATED = "SEGMENT_UPDATED",
  EVENT_OCCURRED = "EVENT_OCCURRED",
  TRIGGER_JOURNEY = "TRIGGER_JOURNEY",
}

export interface BaseEvent {
  type: EventType;
  organizationId: string;
  timestamp: string;
}

export interface EntityCreatedEvent extends BaseEvent {
  type: EventType.ENTITY_CREATED;
  entityId: string;
  entityData: Record<string, any>;
}

export interface EntityUpdatedEvent extends BaseEvent {
  type: EventType.ENTITY_UPDATED;
  entityId: string;
  changes: Record<string, any>;
}

// export interface SegmentUpdatedEvent extends BaseEvent {
//   type: EventType.SEGMENT_UPDATED;
//   segmentId: string;
//   changes: Record<string, any>;
// }

export interface EventOccurredEvent extends BaseEvent {
  type: EventType.EVENT_OCCURRED;
  eventId: string;
  entityId: string;
  eventName: string;
  eventProperties: Record<string, any>;
}

export interface TriggerJourneyEvent extends BaseEvent {
  type: EventType.TRIGGER_JOURNEY;
  entityId: string;
  journeyId: string;
  eventName: string;
  eventProperties: Record<string, any>;
  entityData: EntityData;
}

export interface SegmentUpdatedEvent extends BaseEvent {
  type: EventType.SEGMENT_UPDATED;
  segmentId: string;
  addedEntities: string[];
  removedEntities: string[];
}

export type Event =
  | EntityCreatedEvent
  | EntityUpdatedEvent
  | SegmentUpdatedEvent
  | EventOccurredEvent
  | TriggerJourneyEvent
  | SegmentUpdatedEvent;

interface IQueue {
  publish(topic: string, message: any): Promise<void>;
  subscribe(topic: string, callback: (message: any) => void): Promise<void>;
  connect?(): Promise<void>;
}

class SimpleInMemoryEventQueue extends EventEmitter implements IQueue {
  async publish(topic: string, message: any): Promise<void> {
    this.emit(topic, message);
    logger.info("events", `Published message to topic: ${topic}`, { topic });
  }

  async subscribe(
    topic: string,
    callback: (message: any) => void
  ): Promise<void> {
    this.on(topic, callback);
    logger.info("events", `Subscribed to topic: ${topic}`, { topic });
  }

  async connect(): Promise<void> {
    logger.info("events", "Simple in-memory event queue connected");
  }
}

class KafkaEventQueue implements IQueue {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;
  private isShuttingDown: boolean = false;

  constructor() {
    this.kafka = new Kafka({
      brokers: AppConfig.eventQueue.options.brokers,
      ssl: AppConfig.eventQueue.options.ssl,
      sasl: AppConfig.eventQueue.options.username
        ? {
            mechanism: "scram-sha-256",
            username: AppConfig.eventQueue.options.username,
            password: AppConfig.eventQueue.options.password,
          }
        : undefined,
      logLevel: logLevel.ERROR,
    });

    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({
      groupId: "event-queue-service-group",
    });
    logger.info("events", "Kafka event queue initialized");
  }

  async connect(): Promise<void> {
    try {
      await this.producer.connect();
      await this.consumer.connect();
      logger.info("events", "Kafka producer and consumer connected");
    } catch (error) {
      logger.error("events", "Failed to connect Kafka", error as Error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    this.isShuttingDown = true;
    try {
      await this.producer.disconnect();
      await this.consumer.disconnect();
      logger.info("events", "Kafka producer and consumer disconnected");
    } catch (error) {
      logger.error("events", "Error during Kafka disconnect", error as Error);
      throw error;
    }
  }

  async publish(topic: string, message: any): Promise<void> {
    try {
      await this.producer.send({
        topic,
        messages: [{ value: JSON.stringify(message) }],
      });
      logger.info("events", `Published message to Kafka topic: ${topic}`, {
        topic,
      });
    } catch (error) {
      logger.error(
        "events",
        `Failed to publish message to Kafka topic: ${topic}`,
        error as Error,
        { topic }
      );
      throw error;
    }
  }

  async subscribe(
    topic: string,
    callback: (message: any) => void
  ): Promise<void> {
    try {
      await this.consumer.subscribe({ topic, fromBeginning: true });
      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          if (message.value) {
            const messageString = message.value.toString();
            try {
              const parsedMessage = JSON.parse(messageString);
              callback(parsedMessage);
            } catch (error) {
              logger.error("events", "Error parsing message", error as Error);
            }
          }
        },
      });
      logger.info("events", `Subscribed to Kafka topic: ${topic}`, { topic });
    } catch (error) {
      logger.error(
        "events",
        `Failed to subscribe to Kafka topic: ${topic}`,
        error as Error,
        { topic }
      );
      throw error;
    }
  }
}

class EventQueueService {
  private static instance: EventQueueService | null = null;
  private queue: IQueue;
  private eventHandlers: Map<EventType, (event: Event) => Promise<void>> =
    new Map();

  private constructor() {
    if (AppConfig.eventQueue.type === "kafka") {
      this.queue = new KafkaEventQueue();
      logger.info("events", "Initialized Kafka event queue");
    } else {
      this.queue = new SimpleInMemoryEventQueue();
      logger.info("events", "Initialized Simple in-memory event queue");
    }
  }

  public static getInstance(): EventQueueService {
    if (!EventQueueService.instance) {
      EventQueueService.instance = new EventQueueService();
      logger.info("events", "Created EventQueueService instance");
    }
    return EventQueueService.instance;
  }

  async initialize(): Promise<void> {
    // if (this.queue instanceof KafkaEventQueue) {
    try {
      await this.queue.connect();
      logger.info("events", "EventQueueService initialized and connected");
      await this.subscribeToEvents();
    } catch (error) {
      logger.error(
        "events",
        "Failed to initialize EventQueueService",
        error as Error
      );
      throw error;
    }
    // }
  }

  async shutdown(): Promise<void> {
    if (this.queue instanceof KafkaEventQueue) {
      try {
        await this.queue.disconnect();
        logger.info("events", "EventQueueService shut down");
      } catch (error) {
        logger.error(
          "events",
          "Error during EventQueueService shutdown",
          error as Error
        );
        throw error;
      }
    }
  }

  async publish(event: Event): Promise<void> {
    try {
      await this.queue.publish("Events", event);
      logger.info("events", `Event published: ${event.type}`, {
        eventType: event.type,
      });
    } catch (error) {
      logger.error(
        "events",
        `Failed to publish event: ${event.type}`,
        error as Error,
        { eventType: event.type }
      );
      throw error;
    }
  }

  registerEventHandler(
    eventType: EventType,
    handler: (event: Event) => Promise<void>
  ): void {
    this.eventHandlers.set(eventType, handler);
    logger.info("events", `Registered event handler for type: ${eventType}`, {
      eventType,
    });
  }

  private async handleEvent(event: Event): Promise<void> {
    const handler = this.eventHandlers.get(event.type);
    if (handler) {
      try {
        await handler(event);
      } catch (error) {
        logger.error(
          "events",
          `Error processing event of type: ${event.type}`,
          error as Error,
          { eventType: event.type }
        );
      }
    } else {
      logger.warn(
        "events",
        `No handler registered for event type: ${event.type}`,
        { eventType: event.type }
      );
    }
  }

  private async subscribeToEvents(): Promise<void> {
    await this.queue.subscribe("Events", async (message: Event) => {
      await this.handleEvent(message);
    });
  }
}

export { EventQueueService };
