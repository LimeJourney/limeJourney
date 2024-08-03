import { Request, Response, NextFunction } from "express";
import { AppError } from "./appError";
import { logger } from "@lime/telemetry/logger";

export const expressErrorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    // Log server errors and specific client errors
    if (
      err.statusCode >= 500 ||
      err.errorCode === "AUTH_ERROR" ||
      err.errorCode === "EXTERNAL_SERVICE_ERROR"
    ) {
      logger.error(
        "http",
        `${err.statusCode} - ${err.message}`,
        err,
        {
          errorCode: err.errorCode,
          path: req.path,
          method: req.method,
        },
        req
      );
    } else {
      // For other client errors, we might want to log them as warnings
      logger.warn("http", `${err.statusCode} - ${err.message}`, {
        errorCode: err.errorCode,
        path: req.path,
        method: req.method,
      });
    }

    res.status(err.statusCode).json({
      status: "error",
      error: {
        message: err.message,
        code: err.errorCode,
      },
    });
  } else {
    // Always log unhandled errors as errors
    logger.error(
      "http",
      "Unhandled error",
      err,
      {
        path: req.path,
        method: req.method,
      },
      req
    );

    res.status(500).json({
      status: "error",
      error: {
        message: "An unexpected error occurred",
        code: "INTERNAL_SERVER_ERROR",
      },
    });
  }
};
