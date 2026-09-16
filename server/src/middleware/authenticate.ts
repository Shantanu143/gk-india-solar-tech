import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { userRepository } from "../repository/user.repository";
import { ApiError } from "../util/ApiError";

interface AccessTokenPayload {
  sub: string;
  role: string;
}

/**
 * Looks the user up on every request (rather than trusting the JWT payload alone) so a
 * deactivated employee's still-valid access token stops working the moment an admin flips their
 * status, and so downstream handlers always have the user's current name for audit fields.
 */
export async function authenticate(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    next(ApiError.unauthorized());
    return;
  }

  const token = header.slice("Bearer ".length);
  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;
    const user = await userRepository.findById(payload.sub);
    if (!user) {
      next(ApiError.unauthorized());
      return;
    }
    if (user.status === "INACTIVE") {
      next(ApiError.forbidden("This account has been deactivated. Contact an administrator."));
      return;
    }
    req.user = { id: user._id.toString(), role: user.role, name: user.name };
    next();
  } catch {
    next(ApiError.unauthorized());
  }
}
