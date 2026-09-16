import type { NextFunction, Request, Response } from "express";
import type { ZodTypeAny } from "zod";
import { ApiError } from "../util/ApiError";

/** Parses `req.body` against `schema`, replacing it with the validated (and coerced/trimmed) data on success. */
export function validateBody(schema: ZodTypeAny) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      next(ApiError.badRequest("Validation failed.", result.error.flatten().fieldErrors));
      return;
    }
    req.body = result.data;
    next();
  };
}
