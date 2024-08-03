export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public errorCode: string,
    public isOperational = true
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
