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

  /**
   * Atomically checks validity and revokes in one round trip. Plain `findValidByToken` + `revoke`
   * has a find-then-write gap: two refresh calls landing near-simultaneously (e.g. React StrictMode's
   * double-mount firing the silent-refresh effect twice) could both see the token as valid before
   * either revokes it, so the loser fails wrongly instead of getting the same rotated pair as the winner.
   */
  findValidAndRevoke(token: string) {
    return RefreshTokenModel.findOneAndUpdate(
      { tokenHash: hashToken(token), revoked: false, expiresAt: { $gt: new Date() } },
      { revoked: true },
    );
  },

  revoke(token: string) {
    return RefreshTokenModel.updateOne({ tokenHash: hashToken(token) }, { revoked: true });
  },

  revokeAllForUser(userId: string) {
    return RefreshTokenModel.updateMany({ user: userId, revoked: false }, { revoked: true });
  },
};
