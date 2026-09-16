import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import { env } from "../config/env";
import { userRepository } from "../repository/user.repository";
import { refreshTokenRepository } from "../repository/refreshToken.repository";
import { comparePassword, hashPassword } from "../util/password";
import { ApiError } from "../util/ApiError";
import { toPublicUser, type PublicUser } from "../util/serializeUser";
import type { UserRole } from "../models/User.model";
import type {
  ChangePasswordInput,
  EmployeeBootstrapInput,
  LoginInput,
  SignupCustomerInput,
  UpdateProfileInput,
} from "../validation/auth.validation";

const REFRESH_TOKEN_BYTES = 40;

interface AuthResult {
  user: PublicUser;
  accessToken: string;
  refreshToken: string;
}

function signAccessToken(userId: string, role: UserRole): string {
  const options: jwt.SignOptions = { expiresIn: env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions["expiresIn"] };
  return jwt.sign({ sub: userId, role }, env.JWT_ACCESS_SECRET, options);
}

function generateRefreshToken(): string {
  return crypto.randomBytes(REFRESH_TOKEN_BYTES).toString("hex");
}

async function issueTokens(userId: string, role: UserRole): Promise<{ accessToken: string; refreshToken: string }> {
  const accessToken = signAccessToken(userId, role);
  const refreshToken = generateRefreshToken();
  const expiresAt = new Date(Date.now() + env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);
  await refreshTokenRepository.create(userId, refreshToken, expiresAt);
  return { accessToken, refreshToken };
}

export const authService = {
  async signupCustomer(input: SignupCustomerInput): Promise<AuthResult> {
    const existing = await userRepository.findByEmail(input.email);
    if (existing) throw ApiError.conflict("An account with this email already exists.");

    const passwordHash = await hashPassword(input.password);
    const user = await userRepository.create({
      name: input.name,
      email: input.email,
      phone: input.phone,
      passwordHash,
      role: "CUSTOMER",
    });
    const { accessToken, refreshToken } = await issueTokens(user._id.toString(), user.role);
    return { user: toPublicUser(user), accessToken, refreshToken };
  },

  /** One-time bootstrap — only succeeds while no ADMIN account exists yet; locks itself after. */
  async employeeSetup(input: EmployeeBootstrapInput): Promise<AuthResult> {
    const adminCount = await userRepository.countByRole("ADMIN");
    if (adminCount > 0) throw ApiError.forbidden("The first administrator account has already been created.");

    const existing = await userRepository.findByEmail(input.email);
    if (existing) throw ApiError.conflict("An account with this email already exists.");

    const passwordHash = await hashPassword(input.password);
    const user = await userRepository.create({
      name: input.name,
      email: input.email,
      phone: input.phone,
      passwordHash,
      role: "ADMIN",
    });
    const { accessToken, refreshToken } = await issueTokens(user._id.toString(), user.role);
    return { user: toPublicUser(user), accessToken, refreshToken };
  },

  async employeeSetupStatus(): Promise<{ available: boolean }> {
    const adminCount = await userRepository.countByRole("ADMIN");
    return { available: adminCount === 0 };
  },

  async login(input: LoginInput): Promise<AuthResult> {
    const user = await userRepository.findByEmailWithPassword(input.email);
    if (!user) throw ApiError.unauthorized("Incorrect email or password.");

    const valid = await comparePassword(input.password, user.passwordHash);
    if (!valid) throw ApiError.unauthorized("Incorrect email or password.");

    if (user.status === "INACTIVE") throw ApiError.forbidden("This account has been deactivated. Contact an administrator.");

    const { accessToken, refreshToken } = await issueTokens(user._id.toString(), user.role);
    return { user: toPublicUser(user), accessToken, refreshToken };
  },

  async refresh(token: string): Promise<AuthResult> {
    const existing = await refreshTokenRepository.findValidByToken(token);
    if (!existing) throw ApiError.unauthorized("Session expired. Please log in again.");

    const user = await userRepository.findById(existing.user.toString());
    if (!user || user.status === "INACTIVE") throw ApiError.unauthorized("Session expired. Please log in again.");

    await refreshTokenRepository.revoke(token);
    const { accessToken, refreshToken } = await issueTokens(user._id.toString(), user.role);
    return { user: toPublicUser(user), accessToken, refreshToken };
  },

  async logout(token: string): Promise<void> {
    await refreshTokenRepository.revoke(token);
  },

  async updateOwnProfile(userId: string, input: UpdateProfileInput): Promise<PublicUser> {
    const user = await userRepository.updateById(userId, input);
    if (!user) throw ApiError.notFound("User not found.");
    return toPublicUser(user);
  },

  async changeOwnPassword(userId: string, input: ChangePasswordInput): Promise<void> {
    const user = await userRepository.findByIdWithPassword(userId);
    if (!user) throw ApiError.notFound("User not found.");

    const valid = await comparePassword(input.currentPassword, user.passwordHash);
    if (!valid) throw ApiError.unauthorized("Your current password is incorrect.");

    const passwordHash = await hashPassword(input.newPassword);
    await userRepository.updatePasswordHash(userId, passwordHash);
    // Revoke every existing session — a password change should sign every device out.
    await refreshTokenRepository.revokeAllForUser(userId);
  },
};
