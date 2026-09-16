import { Schema, model, type HydratedDocument, type Model } from "mongoose";

export const USER_ROLES = ["ADMIN", "SALES_MANAGER", "SALES_EXECUTIVE", "SURVEY_ENGINEER", "CUSTOMER"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const EMPLOYEE_ROLES = USER_ROLES.filter((role) => role !== "CUSTOMER") as Exclude<UserRole, "CUSTOMER">[];
export type EmployeeRole = Exclude<UserRole, "CUSTOMER">;

export const USER_STATUSES = ["ACTIVE", "INACTIVE"] as const;
export type UserStatus = (typeof USER_STATUSES)[number];

export interface UserAttrs {
  name: string;
  email: string;
  phone?: string;
  passwordHash: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type UserDocument = HydratedDocument<UserAttrs>;

const userSchema = new Schema<UserAttrs>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: USER_ROLES, required: true, default: "CUSTOMER" },
    status: { type: String, enum: USER_STATUSES, required: true, default: "ACTIVE" },
  },
  { timestamps: true },
);

export const UserModel: Model<UserAttrs> = model<UserAttrs>("User", userSchema);
