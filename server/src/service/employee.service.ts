import { userRepository } from "../repository/user.repository";
import { refreshTokenRepository } from "../repository/refreshToken.repository";
import { hashPassword } from "../util/password";
import { ApiError } from "../util/ApiError";
import { toPublicUser, type PublicUser } from "../util/serializeUser";
import type { UserStatus } from "../models/User.model";
import type { CreateEmployeeInput, UpdateEmployeeInput } from "../validation/employee.validation";

export interface ListEmployeesResult {
  items: PublicUser[];
  total: number;
  page: number;
  pageSize: number;
}

export const employeeService = {
  /** Admin-only — provisions a new employee account directly (no self-signup after bootstrap). */
  async createEmployee(input: CreateEmployeeInput): Promise<PublicUser> {
    const existing = await userRepository.findByEmail(input.email);
    if (existing) throw ApiError.conflict("An account with this email already exists.");

    const passwordHash = await hashPassword(input.password);
    const user = await userRepository.create({
      name: input.name,
      email: input.email,
      phone: input.phone,
      passwordHash,
      role: input.role,
    });

    return toPublicUser(user);
  },

  async listEmployees(params: { page: number; pageSize: number; search?: string }): Promise<ListEmployeesResult> {
    const { items, total } = await userRepository.listEmployees(params);
    return { items: items.map(toPublicUser), total, page: params.page, pageSize: params.pageSize };
  },

  async getEmployee(id: string): Promise<PublicUser> {
    const user = await userRepository.findById(id);
    if (!user || user.role === "CUSTOMER") throw ApiError.notFound("Employee not found.");
    return toPublicUser(user);
  },

  async updateEmployee(id: string, input: UpdateEmployeeInput): Promise<PublicUser> {
    const user = await userRepository.updateById(id, input);
    if (!user || user.role === "CUSTOMER") throw ApiError.notFound("Employee not found.");
    return toPublicUser(user);
  },

  async setEmployeeStatus(id: string, status: UserStatus): Promise<PublicUser> {
    const user = await userRepository.updateById(id, { status });
    if (!user || user.role === "CUSTOMER") throw ApiError.notFound("Employee not found.");
    return toPublicUser(user);
  },

  /** Admin-only — sets a new password for an employee (e.g. they're locked out). Signs out every device on that account, same as a self-service password change. */
  async resetEmployeePassword(id: string, newPassword: string): Promise<void> {
    const user = await userRepository.findById(id);
    if (!user || user.role === "CUSTOMER") throw ApiError.notFound("Employee not found.");

    const passwordHash = await hashPassword(newPassword);
    await userRepository.updatePasswordHash(id, passwordHash);
    await refreshTokenRepository.revokeAllForUser(id);
  },
};
