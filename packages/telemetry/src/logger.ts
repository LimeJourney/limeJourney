import winston from "winston";
import * as Sentry from "@sentry/node";
// import { isArray, isObject, isString } from "lodash";
import { IncomingMessage } from "http";
import { Metrics } from "./metrics";
import { Tracer } from "./tracer";
import { AppConfig as config } from "@lime/config";

type LogCategory =
  | "lifecycle"
  | "authentication"
  | "http"
  | "database"
  | "task"
  | "websockets"
  | "events"
  | "redis"
  | "temporal"
  | "worker";

type LogLevel =
  | "error"
  | "warn"
  | "info"
  | "http"
  | "verbose"
  | "debug"
  | "silly";

type Extra = Record<string, any>;

class Logger {
  private winston!: winston.Logger;
  private metrics: Metrics;
  private tracer: Tracer;

  constructor() {
    this.initWinston();
    // this.initSentry();
    this.metrics = new Metrics();
    this.tracer = new Tracer();
  }

  private initWinston() {
    this.winston = winston.createLogger({
      level: this.isValidLogLevel(config.logLevel) ? config.logLevel : "info",
      format: config.isProduction
        ? winston.format.json()
        : winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: "error.log", level: "error" }),
        new winston.transports.File({ filename: "combined.log" }),
      ],
    });
  }

  private initSentry() {}

  private isValidLogLevel(level: string): level is LogLevel {
    return [
      "error",
      "warn",
      "info",
      "http",
      "verbose",
      "debug",
      "silly",
    ].includes(level);
  }

  public info(category: LogCategory, message: string, extra?: Extra) {
    this.log("info", category, message, extra);
  }

  public warn(category: LogCategory, message: string, extra?: Extra) {
    this.log("warn", category, message, extra);
  }

  public error(
    category: LogCategory,
    message: string,
    error: Error,
    extra?: Extra,
    request?: IncomingMessage
  ) {
    this.log("error", category, message, {
      ...extra,
      error: error.message,
      stack: error.stack,
    });
    this.metrics.increment("logger.error", { category, name: error.name });
    this.tracer.setError(error);
  }

  public debug(category: LogCategory, message: string, extra?: Extra) {
    this.log("debug", category, message, extra);
  }

  private log(
    level: LogLevel,
    category: LogCategory,
    message: string,
    extra?: Extra
  ) {
    this.winston.log(level, message, {
      category,
      // ...this.sanitize(extra),
    });
  }

  // private sanitize(input: any, level = 0): any {
  //   if (!config.isProduction) return input;

  //   const sensitiveFields = [
  //     "password",
  //     "token",
  //     "accessToken",
  //     "refreshToken",
  //     "secret",
  //   ];

  //   if (level > 3) return "[…]";

  //   if (isString(input)) {
  //     if (
  //       sensitiveFields.some((field) => input.toLowerCase().includes(field))
  //     ) {
  //       return "[Filtered]";
  //     }
  //     return input;
  //   }

  //   if (isArray(input)) {
  //     return input.map((item) => this.sanitize(item, level + 1));
  //   }

  //   if (isObject(input)) {
  //     const sanitized: Record<string, any> = {};
  //     for (const [key, value] of Object.entries(input)) {
  //       if (sensitiveFields.includes(key.toLowerCase())) {
  //         sanitized[key] = "[Filtered]";
  //       } else {
  //         sanitized[key] = this.sanitize(value, level + 1);
  //       }
  //     }
  //     return sanitized;
  //   }

  //   return input;
  // }

  public startTrace(name: string): string {
    return this.tracer.startTrace(name);
  }

  public endTrace(traceId: string) {
    this.tracer.endTrace(traceId);
  }
}

export const logger = new Logger();
