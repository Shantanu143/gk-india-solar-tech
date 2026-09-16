import crypto from "node:crypto";
import { RefreshTokenModel } from "../models/RefreshToken.model";

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export const refreshTokenRepository = {
  create(userId: string, token: string, expiresAt: Date) {
    return RefreshTokenModel.create({ user: userId, tokenHash: hashToken(token), expiresAt });
  },

  findValidByToken(token: string) {
    return RefreshTokenModel.findOne({ tokenHash: hashToken(token), revoked: false, expiresAt: { $gt: new Date() } });
  },

  revoke(token: string) {
    return RefreshTokenModel.updateOne({ tokenHash: hashToken(token) }, { revoked: true });
  },

  revokeAllForUser(userId: string) {
    return RefreshTokenModel.updateMany({ user: userId, revoked: false }, { revoked: true });
  },
};
