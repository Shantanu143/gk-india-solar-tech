import { EMPLOYEE_ROLES, UserModel, type UserRole, type UserStatus } from "../models/User.model";

export interface CreateUserInput {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  phone?: string;
}

export interface ListEmployeesParams {
  page: number;
  pageSize: number;
  search?: string;
}

export interface UpdateUserInput {
  name?: string;
  phone?: string;
  role?: UserRole;
  status?: UserStatus;
}

export const userRepository = {
  findByEmail(email: string) {
    return UserModel.findOne({ email: email.toLowerCase() });
  },

  findByEmailWithPassword(email: string) {
    return UserModel.findOne({ email: email.toLowerCase() }).select("+passwordHash");
  },

  findById(id: string) {
    return UserModel.findById(id);
  },

  findByIdWithPassword(id: string) {
    return UserModel.findById(id).select("+passwordHash");
  },

  create(input: CreateUserInput) {
    return UserModel.create(input);
  },

  countByRole(role: UserRole) {
    return UserModel.countDocuments({ role });
  },

  async findIdsByRoles(roles: UserRole[]): Promise<string[]> {
    const users = await UserModel.find({ role: { $in: roles }, status: "ACTIVE" }).select("_id");
    return users.map((u) => u._id.toString());
  },

  updateById(id: string, updates: UpdateUserInput) {
    return UserModel.findByIdAndUpdate(id, updates, { new: true });
  },

  updatePasswordHash(id: string, passwordHash: string) {
    return UserModel.findByIdAndUpdate(id, { passwordHash });
  },

  async listEmployees({ page, pageSize, search }: ListEmployeesParams) {
    const filter: Record<string, unknown> = { role: { $in: EMPLOYEE_ROLES } };
    if (search) {
      const q = search.trim();
      filter.$or = [{ name: new RegExp(q, "i") }, { email: new RegExp(q, "i") }];
    }

    const [items, total] = await Promise.all([
      UserModel.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize),
      UserModel.countDocuments(filter),
    ]);

    return { items, total };
  },
};
