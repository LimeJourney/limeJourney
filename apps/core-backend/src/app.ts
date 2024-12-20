import "reflect-metadata";
import express, { Express, Request, Response, NextFunction } from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import { Server } from "http";
import { logger } from "@lime/telemetry/logger";
import { RegisterRoutes as RegisterPublicRoutes } from "./generated/public/routes";
import { RegisterRoutes as RegisterPrivateRoutes } from "./generated/private/routes"; // This will be generated by tsoa
import swaggerUi from "swagger-ui-express";
import passport from "passport";
import { expressErrorMiddleware } from "@lime/errors";
import { SwaggerController } from "./controllers/private/swaggerController";
import * as SwaggerJson from "./generated/private/swagger.json";
import {
  EntityCreatedEvent,
  EntityUpdatedEvent,
  EventOccurredEvent,
  EventQueueService,
  EventType,
} from "./lib/queue";
import { SegmentationService } from "./services/segmentationService";
import { redisManager } from "./lib/redis";
import { EventHandler } from "./lib/eventHandler";
import bodyParser from "body-parser";

interface RawBodyRequest extends Request {
  rawBody?: string;
}

const rawBodySaver = (
  req: RawBodyRequest,
  res: Response,
  buf: Buffer,
  encoding: BufferEncoding
) => {
  if (
    req.url.startsWith("/api/internal/v1/billing/webhook") &&
    buf &&
    buf.length
  ) {
    req.rawBody = buf.toString(encoding || "utf8");
  }
};

export class App {
  private app: Express;
  private server: Server | null = null;
  private eventQueueService: EventQueueService;
  private eventHandler: EventHandler;

  constructor() {
    this.app = express();
    this.eventQueueService = EventQueueService.getInstance();
    this.configureMiddleware();
    this.configureRoutes();
    this.eventHandler = new EventHandler();
    this.eventHandler.configureEventHandlers();
  }

  private configureMiddleware(): void {
    // Use rawBodySaver for JSON and URL-encoded bodies
    this.app.use(bodyParser.json({ verify: rawBodySaver }));
    this.app.use(
      bodyParser.urlencoded({ verify: rawBodySaver, extended: true })
    );

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(morgan("dev"));
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(passport.initialize());

    // Use custom logger for each request
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      logger.info("http", "Request received", {
        method: req.method,
        path: req.path,
      });
      next();
    });
  }

  private configureRoutes(): void {
    // Serve OpenAPI UI
    this.app.use("/docs", swaggerUi.serve, swaggerUi.setup(SwaggerJson));

    // Serve OpenAPI spec
    this.app.get("/swagger.json", (req: Request, res: Response) => {
      res.sendFile(__dirname + "/swagger.json");
    });

    // Register routes generated by tsoa
    RegisterPublicRoutes(this.app);
    RegisterPrivateRoutes(this.app);

    // Error handling middleware
    this.app.use(expressErrorMiddleware);
    // SwaggerController.setupSwaggerRoute(this.app);
  }

  public async start(port: number): Promise<void> {
    try {
      // console.log("STARTING NOW");
      await redisManager.connect();

      logger.info("lifecycle", "Redis connection established");

      await this.eventQueueService.initialize();
      this.server = this.app.listen(port, () => {
        logger.info("lifecycle", `Server is running on port ${port}`);
      });
    } catch (error) {
      logger.error(
        "lifecycle",
        "Failed to start the application",
        error as Error
      );
      throw error;
    }
  }

  public getApp(): Express {
    return this.app;
  }

  private async disconnectRedis(): Promise<void> {
    try {
      await redisManager.disconnect();
      logger.info("lifecycle", "Redis disconnected successfully");
    } catch (error) {
      logger.error("lifecycle", "Error disconnecting Redis", error as Error);
      throw error;
    }
  }

  public async stop(): Promise<void> {
    if (this.server) {
      return new Promise((resolve, reject) => {
        this.server!.close(async (err) => {
          if (err) {
            logger.error("lifecycle", "Error shutting down server", err);
            reject(err);
          } else {
            try {
              await this.eventQueueService.shutdown();
              await this.disconnectRedis();
              logger.info(
                "lifecycle",
                "Server, EventQueueService, and Redis shut down gracefully"
              );
              resolve();
            } catch (error) {
              logger.error(
                "lifecycle",
                "Error shutting down EventQueueService",
                error as Error
              );
              reject(error);
            }
          }
        });
      });
    }
  }
}
