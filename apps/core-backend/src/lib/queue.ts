import { Kafka, Producer, Consumer, KafkaMessage, logLevel } from "kafkajs";
import { EventEmitter } from "events";
import { AppConfig } from "@lime/config";
import { logger } from "@lime/telemetry/logger";

interface EventQueueMessage {
  topic: string;
  message: string | object;
}

class SimpleEventQueue extends EventEmitter {
  async publish(topic: string, message: string | object): Promise<void> {
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
}

class KafkaEventQueue {
  private kafka: Kafka;
  private producer: Producer;
  private consumers: Map<string, Consumer> = new Map();
  private isShuttingDown: boolean = false;

  constructor() {
    this.kafka = new Kafka({
      brokers: AppConfig.eventQueue.options.brokers,
      // clientId: AppConfig.eventQueue.options.clientId,
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
    logger.info("events", "Kafka event queue initialized");
  }

  async connect(): Promise<void> {
    try {
      await this.producer.connect();
      logger.info("events", "Kafka producer connected");
    } catch (error) {
      logger.error(
        "events",
        "Failed to connect Kafka producer",
        error as Error
      );
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    this.isShuttingDown = true;
    try {
      await this.producer.disconnect();
      logger.info("events", "Kafka producer disconnected");
      for (const [topic, consumer] of this.consumers.entries()) {
        await consumer.disconnect();
        logger.info(
          "events",
          `Kafka consumer disconnected for topic: ${topic}`,
          { topic }
        );
      }
    } catch (error) {
      logger.error("events", "Error during Kafka disconnect", error as Error);
      throw error;
    }
  }

  async publish(topic: string, message: string | object): Promise<void> {
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
    callback: (message: KafkaMessage) => void
  ): Promise<void> {
    if (!this.consumers.has(topic)) {
      try {
        const consumer = this.kafka.consumer({ groupId: `${topic}-group` });
        await consumer.connect();
        await consumer.subscribe({
          topic: topic,
          fromBeginning: true,
        });
        await consumer.run({
          eachMessage: async ({ topic, partition, message }) => {
            if (message.value) {
              const messageString = message.value.toString();
              console.log("Received message string:", messageString);

              try {
                const parsedMessage = JSON.parse(messageString);
                console.log("Parsed message:", parsedMessage);
                callback(parsedMessage);
              } catch (error) {
                console.error("Error parsing message:", error);
                // Handle the error as needed
              }
            }
            logger.debug(
              "events",
              `Received message from Kafka topic: ${topic}`,
              { topic, partition }
            );
          },
        });
        this.consumers.set(topic, consumer);
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
}

class EventQueueService {
  private static instance: EventQueueService | null = null;
  private queue: SimpleEventQueue | KafkaEventQueue;
  private eventHandlers: Map<string, (message: any) => Promise<void>> =
    new Map();

  private constructor() {
    if (AppConfig.eventQueue.type === "kafka") {
      this.queue = new KafkaEventQueue();
      logger.info("events", "Initialized Kafka event queue");
    } else {
      this.queue = new SimpleEventQueue();
      logger.info("events", "Initialized Simple event queue");
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
    if (this.queue instanceof KafkaEventQueue) {
      try {
        await this.queue.connect();
        logger.info("events", "EventQueueService initialized and connected");
        await this.subscribeToAllTopics();
      } catch (error) {
        logger.error(
          "events",
          "Failed to initialize EventQueueService",
          error as Error
        );
        throw error;
      }
    }
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

  async publish(message: EventQueueMessage): Promise<void> {
    console.log("MESSAGEEEE---------", message);
    try {
      await this.queue.publish(message.topic, message.message);
      logger.info("events", `Message published to topic: ${message.topic}`, {
        topic: message.topic,
      });
    } catch (error) {
      logger.error(
        "events",
        `Failed to publish message to topic: ${message.topic}`,
        error as Error,
        { topic: message.topic }
      );
      throw error;
    }
  }

  registerEventHandler(
    topic: string,
    handler: (message: any) => Promise<void>
  ): void {
    this.eventHandlers.set(topic, handler);
    logger.info("events", `Registered event handler for topic: ${topic}`, {
      topic,
    });
  }

  private async subscribeToAllTopics(): Promise<void> {
    for (const [topic, handler] of this.eventHandlers.entries()) {
      await this.subscribe(topic, handler);
    }
  }

  private async subscribe(
    topic: string,
    callback: (message: any) => Promise<void>
  ): Promise<void> {
    try {
      await this.queue.subscribe(topic, async (message) => {
        try {
          await callback(message);
        } catch (error) {
          logger.error(
            "events",
            `Error processing message from topic: ${topic}`,
            error as Error,
            { topic }
          );
        }
      });
      logger.info("events", `Subscribed to topic: ${topic}`, { topic });
    } catch (error) {
      logger.error(
        "events",
        `Failed to subscribe to topic: ${topic}`,
        error as Error,
        { topic }
      );
      throw error;
    }
  }
}

export { EventQueueService, EventQueueMessage };
