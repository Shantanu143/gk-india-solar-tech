/** A thrown ApiError is caught by the central error handler and rendered as a clean JSON response. */
export class ApiError extends Error {
  statusCode: number;
  details?: unknown;

  constructor(statusCode: number, message: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string, details?: unknown): ApiError {
    return new ApiError(400, message, details);
  }
  static unauthorized(message = "Authentication required."): ApiError {
    return new ApiError(401, message);
  }
  static forbidden(message = "You do not have access to this resource."): ApiError {
    return new ApiError(403, message);
  }
  static notFound(message = "Not found."): ApiError {
    return new ApiError(404, message);
  }
  static conflict(message: string): ApiError {
    return new ApiError(409, message);
  }
  static locked(message: string): ApiError {
    return new ApiError(423, message);
  }
  static tooMany(message = "Too many requests."): ApiError {
    return new ApiError(429, message);
  }
  static internal(message = "Something went wrong."): ApiError {
    return new ApiError(500, message);
  }
}
