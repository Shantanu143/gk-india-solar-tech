import rateLimit from "express-rate-limit";
import { ApiError } from "../util/ApiError";

/** Throttles credential-guessing endpoints (login, signup) without limiting normal API traffic. */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, _res, next) => next(ApiError.tooMany("Too many attempts. Please try again later.")),
});
