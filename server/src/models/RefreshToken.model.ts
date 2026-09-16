import { Schema, model, Types, type HydratedDocument, type Model } from "mongoose";

export interface RefreshTokenAttrs {
  user: Types.ObjectId;
  tokenHash: string;
  expiresAt: Date;
  revoked: boolean;
  createdAt: Date;
}

export type RefreshTokenDocument = HydratedDocument<RefreshTokenAttrs>;

const refreshTokenSchema = new Schema<RefreshTokenAttrs>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    tokenHash: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    revoked: { type: Boolean, required: true, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const RefreshTokenModel: Model<RefreshTokenAttrs> = model<RefreshTokenAttrs>("RefreshToken", refreshTokenSchema);
