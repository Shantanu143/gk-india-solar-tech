/**
 * Emergency password reset — there is no self-service "forgot password" flow (it would need an
 * email provider this project doesn't have configured), so this is the recovery path when an
 * admin is locked out and no other admin exists to use the "Reset Password" screen for them.
 * Sets the password directly in the database and signs the account out everywhere.
 *
 * Usage: npm run reset-password -- <email> <newPassword>
 */
import { connectDatabase, disconnectDatabase } from "../config/db";
import { logger } from "../config/logger";
import { userRepository } from "../repository/user.repository";
import { refreshTokenRepository } from "../repository/refreshToken.repository";
import { hashPassword } from "../util/password";
import { passwordSchema } from "../validation/auth.validation";

async function main() {
  const [email, newPassword] = process.argv.slice(2);
  if (!email || !newPassword) {
    console.error("Usage: npm run reset-password -- <email> <newPassword>");
    process.exitCode = 1;
    return;
  }

  const parsedPassword = passwordSchema.safeParse(newPassword);
  if (!parsedPassword.success) {
    console.error(parsedPassword.error.issues[0]?.message ?? "Invalid password.");
    process.exitCode = 1;
    return;
  }

  await connectDatabase();
  try {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      logger.error(`No user found with email: ${email}`);
      process.exitCode = 1;
      return;
    }

    const passwordHash = await hashPassword(parsedPassword.data);
    await userRepository.updatePasswordHash(user._id.toString(), passwordHash);
    await refreshTokenRepository.revokeAllForUser(user._id.toString());

    logger.info(`Password reset for ${user.email} (${user.role}). All existing sessions have been signed out.`);
  } finally {
    await disconnectDatabase();
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
