import type { Request, Response } from "express";
import { authService } from "../service/auth.service";
import { userRepository } from "../repository/user.repository";
import { asyncHandler } from "../util/asyncHandler";
import { ApiError } from "../util/ApiError";
import { toPublicUser } from "../util/serializeUser";
import { env } from "../config/env";

const REFRESH_COOKIE_NAME = "refreshToken";

function setRefreshCookie(res: Response, token: string): void {
  res.cookie(REFRESH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
    path: "/api/auth",
  });
}

function clearRefreshCookie(res: Response): void {
  res.clearCookie(REFRESH_COOKIE_NAME, { path: "/api/auth" });
}

export const authController = {
  signupCustomer: asyncHandler(async (req, res) => {
    const { user, accessToken, refreshToken } = await authService.signupCustomer(req.body);
    setRefreshCookie(res, refreshToken);
    res.status(201).json({ user, accessToken });
  }),

  employeeSetup: asyncHandler(async (req, res) => {
    const { user, accessToken, refreshToken } = await authService.employeeSetup(req.body);
    setRefreshCookie(res, refreshToken);
    res.status(201).json({ user, accessToken });
  }),

  employeeSetupStatus: asyncHandler(async (_req, res) => {
    const status = await authService.employeeSetupStatus();
    res.json(status);
  }),

  login: asyncHandler(async (req, res) => {
    const { user, accessToken, refreshToken } = await authService.login(req.body);
    setRefreshCookie(res, refreshToken);
    res.json({ user, accessToken });
  }),

  refresh: asyncHandler(async (req: Request, res: Response) => {
    const token = req.cookies?.[REFRESH_COOKIE_NAME];
    if (!token) throw ApiError.unauthorized();
    const { user, accessToken, refreshToken } = await authService.refresh(token);
    setRefreshCookie(res, refreshToken);
    res.json({ user, accessToken });
  }),

  logout: asyncHandler(async (req: Request, res: Response) => {
    const token = req.cookies?.[REFRESH_COOKIE_NAME];
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
