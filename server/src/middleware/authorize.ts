import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../util/ApiError";
import { can, type Permission } from "../util/permissions";
import type { UserRole } from "../models/User.model";

/** Restricts a route to an explicit set of roles. Must run after `authenticate`. */
export function authorizeRoles(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      next(ApiError.unauthorized());
      return;
    }
    if (!roles.includes(req.user.role)) {
      next(ApiError.forbidden());
      return;
    }
    next();
  };
}

/** Restricts a route to roles holding a specific permission (the real, backend-enforced RBAC check). */
export function authorizePermission(permission: Permission) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      next(ApiError.unauthorized());
      return;
    }
    if (!can(req.user.role, permission)) {
      next(ApiError.forbidden());
      return;
    }
    next();
  };
}
