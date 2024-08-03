import { AppError } from "./appError";
import { expressErrorMiddleware } from "./expressErrorMiddleware";
export { expressErrorMiddleware };
export class AuthError extends AppError {
  constructor(message: string, statusCode = 401, errorCode = "AUTH_ERROR") {
    super(message, statusCode, errorCode);
  }
}

export class ValidationError extends AppError {
  constructor(
    message: string,
    statusCode = 400,
    errorCode = "VALIDATION_ERROR"
  ) {
    super(message, statusCode, errorCode);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string, statusCode = 404, errorCode = "NOT_FOUND") {
    super(message, statusCode, errorCode);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, statusCode = 500, errorCode = "DATABASE_ERROR") {
    super(message, statusCode, errorCode);
  }
}

export class ExternalServiceError extends AppError {
  constructor(
    message: string,
    statusCode = 502,
    errorCode = "EXTERNAL_SERVICE_ERROR"
  ) {
    super(message, statusCode, errorCode);
  }
}
