import type { Request, Response } from "express";
import { authService } from "../service/auth.service";
import { userRepository } from "../repository/user.repository";
import { asyncHandler } from "../util/asyncHandler";
import { ApiError } from "../util/ApiError";
import { toPublicUser } from "../util/serializeUser";
import { env } from "../config/env";

const REFRESH_COOKIE_NAME = "refreshToken";

const isProduction = env.NODE_ENV === "production";

function setRefreshCookie(res: Response, token: string): void {
  res.cookie(REFRESH_COOKIE_NAME, token, {
    httpOnly: true,
    // Frontend (Vercel) and backend (Render) are different sites in production, so the cookie
    // needs SameSite=None (which browsers only honor alongside Secure) to be sent cross-site.
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
    path: "/api/auth",
    ...(isProduction ? { partitioned: true } : {}),
  } as any);
}

function clearRefreshCookie(res: Response): void {
  res.clearCookie(REFRESH_COOKIE_NAME, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/api/auth",
    ...(isProduction ? { partitioned: true } : {}),
  } as any);
}

export const authController = {
  signupCustomer: asyncHandler(async (req, res) => {
    const { user, accessToken, refreshToken } = await authService.signupCustomer(req.body);
    setRefreshCookie(res, refreshToken);
    res.status(201).json({ user, accessToken, refreshToken });
  }),

  employeeSetup: asyncHandler(async (req, res) => {
    const { user, accessToken, refreshToken } = await authService.employeeSetup(req.body);
    setRefreshCookie(res, refreshToken);
    res.status(201).json({ user, accessToken, refreshToken });
  }),

  employeeSetupStatus: asyncHandler(async (_req, res) => {
    const status = await authService.employeeSetupStatus();
    res.json(status);
  }),

  login: asyncHandler(async (req, res) => {
    const { user, accessToken, refreshToken } = await authService.login(req.body);
    setRefreshCookie(res, refreshToken);
    res.json({ user, accessToken, refreshToken });
  }),

  refresh: asyncHandler(async (req: Request, res: Response) => {
    const token =
      req.cookies?.[REFRESH_COOKIE_NAME] ||
      req.body?.refreshToken ||
      (req.headers["x-refresh-token"] as string);
    if (!token) throw ApiError.unauthorized("No refresh token provided.");
    const { user, accessToken, refreshToken } = await authService.refresh(token);
    setRefreshCookie(res, refreshToken);
    res.json({ user, accessToken, refreshToken });
  }),

  logout: asyncHandler(async (req: Request, res: Response) => {
    const token =
      req.cookies?.[REFRESH_COOKIE_NAME] ||
      req.body?.refreshToken ||
      (req.headers["x-refresh-token"] as string);
    if (token) await authService.logout(token);
    clearRefreshCookie(res);
    res.status(204).send();
  }),

  me: asyncHandler(async (req, res) => {
    const user = await userRepository.findById(req.user!.id);
    if (!user) throw ApiError.notFound("User not found.");
    res.json({ user: toPublicUser(user) });
  }),

  updateMe: asyncHandler(async (req, res) => {
    const user = await authService.updateOwnProfile(req.user!.id, req.body);
    res.json({ user });
  }),

  changePassword: asyncHandler(async (req, res) => {
    await authService.changeOwnPassword(req.user!.id, req.body);
    res.status(204).send();
  }),
};
